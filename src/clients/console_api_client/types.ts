import type {
  BaseResponse,
  QueryParams,
} from "../base_http_client/base_client";

export interface CreateEndpointRequest {
  chain: string;
  network: string;
}

export interface GetUsageQueryParams extends QueryParams {
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

export interface GetEndpointLogsQueryParams extends QueryParams {
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
  next_at?: string;
}

// Security configuration types
export interface SecurityOptions {
  tokens: boolean;
  jwts: boolean;
  domainMasks: boolean;
  ips: boolean;
  hosts: boolean;
  referrers: boolean;
  validHosts: boolean;
  requestFilters: boolean;
  debugAuthErrors: boolean;
  enforceChainNetwork: boolean;
  ipCustomHeader: boolean;
  hsts: boolean;
  cors: boolean;
}

export interface JwtConfig {
  id: string;
  public_key: string;
  kid: string;
  name: string;
}

export interface TokenConfig {
  id: string;
  token: string;
}

export interface ReferrerConfig {
  id: string;
  referrer: string;
}

export interface DomainMaskConfig {
  id: string;
  domain: string;
}

export interface IpConfig {
  id: string;
  ip: string;
}

export interface RateLimits {
  rate_limit_by_ip: boolean;
  account: number;
  rps: number;
  rpm: number;
  rpd: number;
}

export interface SecurityConfig {
  options: SecurityOptions;
  jwts: JwtConfig[];
  tokens: TokenConfig[];
  referrers: ReferrerConfig[];
  domainMasks: DomainMaskConfig[];
  ips: IpConfig[];
}

// Endpoint response types
export interface EndpointData extends Record<string, unknown> {
  id: string;
  label: string;
  chain: string;
  network: string;
  http_url: string;
  wss_url: string;
  security: SecurityConfig;
  rate_limits: RateLimits;
  error?: string;
}

export interface GetEndpointsResponse extends BaseResponse<EndpointData[]> {}

export interface GetEndpointResponse extends BaseResponse<EndpointData> {}

export interface CreateEndpointResponse extends BaseResponse<EndpointData> {}

export interface ChainData extends Record<string, unknown> {
  slug: string;
  networks: {
    slug: string;
    name: string;
  }[];
}

export interface GetChainsResponse extends BaseResponse<ChainData[]> {}

export interface SecurityOptionData extends Record<string, unknown> {
  option: string;
  status: string;
}

export interface GetRpcEndpointSecurityOptionsResponse
  extends BaseResponse<SecurityOptionData[]> {}

// Usage response types
export interface RpcUsageData extends Record<string, unknown> {
  credits_used: number;
  credits_remaining: number | null;
  limit: number | null;
  overages: number | null;
  start_time: number;
  end_time: number;
  error?: string;
}

export interface RpcUsageByEndpointData extends Record<string, unknown> {
  name: string;
  label: string;
  chain: string;
  status: string;
  network: string;
  credits_used: number;
  methods_breakdown: {
    method_name: string;
    credits_used: number;
    archive: boolean;
  }[];
}

export interface RpcUsageByMethodData extends Record<string, unknown> {
  method_name: string;
  credits_used: number;
  archive: boolean;
}

export interface RpcUsageByChainData extends Record<string, unknown> {
  name: string;
  credits_used: number;
}

export interface GetRpcUsageResponse extends BaseResponse<RpcUsageData> {}

export interface GetRpcUsageByEndpointResponse
  extends BaseResponse<{
    endpoints: RpcUsageByEndpointData[];
    start_time: number;
    end_time: number;
  }> {}

export interface GetRpcUsageByMethodResponse
  extends BaseResponse<{
    methods: RpcUsageByMethodData[];
    start_time: number;
    end_time: number;
  }> {}

export interface GetRpcUsageByChainResponse
  extends BaseResponse<{
    chains: RpcUsageByChainData[];
    start_time: number;
    end_time: number;
  }> {}

export interface EndpointLogData extends Record<string, unknown> {
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
}

export interface GetEndpointLogsResponse
  extends BaseResponse<EndpointLogData[]> {
  next_at: string;
}
