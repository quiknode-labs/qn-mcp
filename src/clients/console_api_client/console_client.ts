import { Client, ClientOptions } from "../base_http_client/base_client";

import type {
  CreateEndpointRequest,
  GetEndpointLogsQueryParams,
  GetEndpointLogsResponse,
  GetEndpointsResponse,
  GetRpcEndpointSecurityOptionsResponse,
  GetUsageQueryParams,
} from "./types";

export class QuickNodeClient extends Client {
  constructor(options: ClientOptions) {
    super({
      ...options, headers: {
        ...options.headers,
        "x-qn-sdk": "qn-mcp"
    }});
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
    return this.get(`/v0/endpoints/${id}`);
  }

  async createEndpoint(body: CreateEndpointRequest) {
    return this.post("/v0/endpoints", body);
  }

  async getChains() {
    return this.get("/v0/chains");
  }

  async getRpcUsage(queryParams: GetUsageQueryParams) {
    return this.get("/v0/usage/rpc", {
      params: queryParams,
    });
  }

  async getRpcUsageByEndpoint(queryParams: GetUsageQueryParams) {
    return this.get("/v0/usage/rpc/by-endpoint", {
      params: queryParams,
    });
  }

  async getRpcUsageByMethod(queryParams: GetUsageQueryParams) {
    return this.get("/v0/usage/rpc/by-method", {
      params: queryParams,
    });
  }

  async getRpcUsageByChain(queryParams: GetUsageQueryParams) {
    return this.get("/v0/usage/rpc/by-chain", {
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
}

const endpointNameFromUrl = (url: string) => {
  const match = url.match(/https:\/\/(.*)\.quiknode\.pro\//);
  if (!match) {
    throw new Error(`Invalid URL: ${url}`);
  }
  return match[1];
};
