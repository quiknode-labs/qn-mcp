export interface ClientOptions {
  baseUrl: string;
  token: string;
  headers?: Record<string, string>;
}

export interface QueryParams
  extends Record<string, string | number | boolean> {}

export interface BaseData extends Record<string, unknown> {}

export interface BaseResponse<T extends BaseData[] | BaseData> {
  data: T;
  error?: string | null;
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
    this.baseUrl = options.baseUrl.endsWith("/")
      ? options.baseUrl.slice(0, -1)
      : options.baseUrl;
    this.token = options.token;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "x-api-key": this.token,
      ...options.headers,
    };
  }

  private async request<T extends BaseResponse<BaseData[] | BaseData>>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = new URL(
      path.startsWith("/") ? path.slice(1) : path,
      this.baseUrl,
    );

    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (typeof value === "string") {
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

    if (options.body && method !== "GET" && method !== "HEAD") {
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
      return (await response.json()) as T;
    } catch (error) {
      throw new Error(`Failed to parse response: ${error}`);
    }
  }

  protected async get<T extends BaseResponse<BaseData[] | BaseData>>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  protected async post<T extends BaseResponse<BaseData[] | BaseData>>(
    path: string,
    body: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>("POST", path, { ...options, body });
  }

  protected async put<T extends BaseResponse<BaseData[] | BaseData>>(
    path: string,
    body: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  protected async patch<T extends BaseResponse<BaseData[] | BaseData>>(
    path: string,
    body: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  protected async delete<T extends BaseResponse<BaseData[] | BaseData>>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}
