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
  next_at: string;
}

export interface GetEndpointsResponse
  extends BaseResponse<
    {
      id: string;
      label: string;
      chain: string;
      network: string;
      http_url: string;
      wss_url: string;
      error: string;
    }[]
  > {}

export interface GetRpcEndpointSecurityOptionsResponse
  extends BaseResponse<
    {
      option: string;
      status: string;
    }[]
  > { }

export interface GetRpcUsageResponse
  extends BaseResponse<
    {
      start_time: number;
      end_time: number;
      credits_used: number;
      credits_remaining: number | null;
      limit: number | null;
      overages: number | null;
    }
  > { }

export interface GetEndpointLogsResponse
  extends BaseResponse<
    {
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
    }[]
  > {
  next_at: string;
}
