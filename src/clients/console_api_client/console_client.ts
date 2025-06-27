import { Client, ClientOptions } from "../base_http_client/base_client";

import type {
  CreateEndpointRequest,
  CreateEndpointResponse,
  DeleteEndpointResponse,
  EndpointMetricsQueryParams,
  GetBillingInvoicesResponse,
  GetBillingPaymentsResponse,
  GetChainsResponse,
  GetEndpointLogsQueryParams,
  GetEndpointLogsResponse,
  GetEndpointMetricsResponse,
  GetEndpointResponse,
  GetEndpointsResponse,
  GetRpcEndpointSecurityOptionsResponse,
  GetRpcUsageByChainResponse,
  GetRpcUsageByEndpointResponse,
  GetRpcUsageByMethodResponse,
  GetRpcUsageResponse,
  GetUsageQueryParams,
} from "./types";

export class QuickNodeClient extends Client {
  constructor(options: ClientOptions) {
    super({
      ...options,
      headers: {
        ...options.headers,
        "x-qn-sdk": "qn-mcp",
      },
    });
  }

  async listEndpoints(limit: number = 10, offset: number = 0) {
    const { data } = await this.get<GetEndpointsResponse>("/v0/endpoints", {
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
    return this.get<GetEndpointResponse>(`/v0/endpoints/${id}`);
  }

  async createEndpoint(body: CreateEndpointRequest) {
    return this.post<CreateEndpointResponse>("/v0/endpoints", body);
  }

  async deleteEndpoint(id: string) {
    return this.delete<DeleteEndpointResponse>(`/v0/endpoints/${id}`);
  }

  async getChains() {
    return this.get<GetChainsResponse>("/v0/chains");
  }

  async getRpcUsage(queryParams: GetUsageQueryParams) {
    return this.get<GetRpcUsageResponse>("/v0/usage/rpc", {
      params: queryParams,
    });
  }

  async getRpcUsageByEndpoint(queryParams: GetUsageQueryParams) {
    return this.get<GetRpcUsageByEndpointResponse>(
      "/v0/usage/rpc/by-endpoint",
      {
        params: queryParams,
      },
    );
  }

  async getRpcUsageByMethod(queryParams: GetUsageQueryParams) {
    return this.get<GetRpcUsageByMethodResponse>("/v0/usage/rpc/by-method", {
      params: queryParams,
    });
  }

  async getRpcUsageByChain(queryParams: GetUsageQueryParams) {
    return this.get<GetRpcUsageByChainResponse>("/v0/usage/rpc/by-chain", {
      params: queryParams,
    });
  }

  async getRpcEndpointSecurityOptions(endpointId: string) {
    return this.get<GetRpcEndpointSecurityOptionsResponse>(
      `v0/endpoints/${endpointId}/security_options`,
    );
  }

  async getEndpointLogs(queryParams: GetEndpointLogsQueryParams) {
    return this.get<GetEndpointLogsResponse>(
      `/v0/endpoints/${queryParams.endpoint_id}/logs`,
      {
        params: queryParams,
      },
    );
  }

  async getBillingInvoices() {
    return this.get<GetBillingInvoicesResponse>("/v0/billing/invoices");
  }

  async getBillingPayments() {
    return this.get<GetBillingPaymentsResponse>("/v0/billing/payments");
  }

  async getEndpointMetrics(
    endpointId: string,
    queryParams: EndpointMetricsQueryParams,
  ) {
    return this.get<GetEndpointMetricsResponse>(
      `/v0/endpoints/${endpointId}/metrics`,
      {
        params: queryParams,
      },
    );
  }
}

const endpointNameFromUrl = (url: string) => {
  const match = url.match(/https:\/\/(.*)\.quiknode\.pro\//);
  if (!match) {
    throw new Error(`Invalid URL: ${url}`);
  }
  return match[1];
};
