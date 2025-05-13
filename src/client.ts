export interface ClientOptions {
  baseUrl: string;
  token: string;
  headers?: Record<string, string>;
}

interface QueryParams extends Record<string, string | number | boolean>{};

interface BaseData extends Record<string, unknown> {}

export interface BaseResponse<T extends BaseData[] | BaseData> {
  data: T;
  error: string | null;
}

export interface RequestOptions {
  params?: QueryParams;
  headers?: Record<string, string>;
  body?: any;
}

export class Client {
  private baseUrl: string;
  private token: string;
  private defaultHeaders: Record<string, string>;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl.endsWith('/')
      ? options.baseUrl.slice(0, -1)
      : options.baseUrl;
    this.token = options.token;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': this.token,
      ...options.headers,
    };
  }

  private async request<T extends BaseResponse<BaseData[] | BaseData>>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = new URL(path.startsWith('/') ? path.slice(1) : path, this.baseUrl);

    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (typeof value === 'string') {
          url.searchParams.append(key, value);
        } else {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (options.body && method !== 'GET' && method !== 'HEAD') {
      requestOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Return empty object for 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json() as T;
    } catch (error) {
      throw new Error(`Failed to parse response: ${error}`);
    }
  }

  protected async get<T extends BaseResponse<BaseData[] | BaseData>>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  protected async post<T extends BaseResponse<BaseData[] | BaseData>>(path: string, body: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', path, { ...options, body });
  }

  protected async put<T extends BaseResponse<BaseData[] | BaseData>>(path: string, body: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PUT', path, { ...options, body });
  }

  protected async patch<T extends BaseResponse<BaseData[] | BaseData>>(path: string, body: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PATCH', path, { ...options, body });
  }

  protected async delete<T extends BaseResponse<BaseData[] | BaseData>>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }
}

interface CreateEndpointRequest {
  chain: string;
  network: string;
}

interface GetUsageQueryParams extends QueryParams {
  /**
   * start_time integer
   * Specifies the start of the time period for which the usage data is to be retrieved
   */
  start_time: number;
  /**
   * end_time integer
   * Specifies the end of the time period for which the usage data is to be retrieved
   */
  end_time: number;
}

interface GetEndpointLogsQueryParams extends QueryParams {
  endpoint_id: string;
  /**
   * The start timestamp encoded in ISO8601 format
   */
  from: string;
  /**
   * The end timestamp encoded in ISO8601 format
   */
  to: string;
  /**
   * Number of logs (1-100, default: 20)
   */
  limit: number;
  /**
   * Includes request/response details. The default value is set to be false
   */
  include_details: boolean;
  /**
   * Pagination token from previous response
   */
  next_at: string;
}

interface GetEndpointsResponse extends BaseResponse<{
  id: string;
  label: string;
  chain: string;
  network: string;
  http_url: string;
  wss_url: string;
  error: string;
}[]>{}

interface GetEndpointLogsResponse extends BaseResponse<{
  /**
   * The timestamp when the log was recorded
   */
  timestamp: string;
  /**
   * The name of the method invoked
   */
  method: string;
  /**
   * The name of the network on which the method was called
   */
  network: string;
  /**
   * The HTTP method used for the request
   */
  http_method: string;
  /**
   * The HTTP status code returned by the request
   */
  status: number;
  /**
   * The application-specific error code returned
   */
  error_code: number;
  /**
   * The unique identifier for the request
   */
  request_id: string;
  /**
   * The request URL
   */
  url: string;
  /**
   * Additional error details if available (nullable)
   */
  details: string | null;
}[]> {
  next_at: string;
}

export class QuickNodeClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }

  async listEndpoints(limit: number = 10, offset: number = 0) {
    const { data } = await this.get<GetEndpointsResponse>('/v0/endpoints', {
      params: {
        limit: limit.toString(),
        offset: offset.toString(),
      },
    });

    return data.map((endpoint) => ({
      ...endpoint,
      name: endpointNameFromUrl(endpoint.http_url),
    }));
  }

  async getEndpoint(id: string) {
    return this.get(`/v0/endpoints/${id}`);
  }

  async createEndpoint(body: CreateEndpointRequest) {
    return this.post('/v0/endpoints', body);
  }

  async getChains() {
    return this.get('/v0/chains');
  }

  async getRpcUsage(queryParams: GetUsageQueryParams) {
    return this.get('/v0/usage/rpc', {
      params: queryParams,
    });
  }

  async getRpcUsageByEndpoint(queryParams: GetUsageQueryParams) {
    return this.get('/v0/usage/rpc/by-endpoint', {
      params: queryParams,
    });
  }

  async getRpcUsageByMethod(queryParams: GetUsageQueryParams) {
    return this.get('/v0/usage/rpc/by-method', {
      params: queryParams,
    });
  }

  async getRpcUsageByChain(queryParams: GetUsageQueryParams) {
    return this.get('/v0/usage/rpc/by-chain', {
      params: queryParams,
    });    
  }

  async getEndpointLogs(queryParams: GetEndpointLogsQueryParams) {
    return this.get<GetEndpointLogsResponse>(`/v0/endpoints/${queryParams.endpoint_id}/logs`, {
      params: queryParams,
    });
  }
}


const endpointNameFromUrl = (url: string) => {
  const match = url.match(/https:\/\/(.*)\.quiknode\.pro\//);
  if (!match) {
    throw new Error(`Invalid URL: ${url}`);
  }
  return match[1];
}
