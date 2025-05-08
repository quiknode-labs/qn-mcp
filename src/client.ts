export interface ClientOptions {
  baseUrl: string;
  token: string;
  headers?: Record<string, string>;
}

type QueryParams = Record<string, string | number>;

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

  private async request<T>(
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

  protected async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  protected async post<T>(path: string, body: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', path, { ...options, body });
  }

  protected async put<T>(path: string, body: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PUT', path, { ...options, body });
  }

  protected async patch<T>(path: string, body: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PATCH', path, { ...options, body });
  }

  protected async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
  startTime: number;
  /**
   * end_time integer
   * Specifies the end of the time period for which the usage data is to be retrieved
   */
  endTime: number;
}


export class QuickNodeClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }
  
  async listEndpoints(limit: number = 10, offset: number = 0) {
    // @ts-ignore
    const { data } = await this.get('/v0/endpoints', {
      params: {
        limit: limit.toString(),
        offset: offset.toString(),
      },
    });

    // @ts-ignore
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
}



const endpointNameFromUrl = (url: string) => {
  // URL is like https://staging-twilight-restless-breeze.quiknode.pro/7d4081fff499f8f8800b3b7a9780f2d19d53e4bf/
  // we need to extract in between https:// and .quiknode.pro/
  const match = url.match(/https:\/\/(.*)\.quiknode\.pro\//);
  if (!match) {
    throw new Error(`Invalid URL: ${url}`);
  }
  return match[1];
}


