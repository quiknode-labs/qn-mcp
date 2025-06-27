import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { QuickNodeClient } from "../clients/console_api_client";
import { genericArgs } from "../common/generic_args";
import { isValidIsoString } from "../common/utils";

const endpointLogsArgs = {
  ...genericArgs.endpointIdArgs,
  from: z
    .string()
    .describe("The start timestamp for logs (ISO 8601 format)")
    .refine(isValidIsoString, {
      message: "from must be a valid ISO 8601 date string",
    }),
  to: z
    .string()
    .describe("The end timestamp for logs (ISO 8601 format)")
    .refine(isValidIsoString, {
      message: "to must be a valid ISO 8601 date string",
    }),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(20)
    .describe("Number of logs to retrieve (1-100, default: 20)"),
  include_details: z
    .boolean()
    .default(false)
    .describe("Include request/response details in logs"),
  next_at: z
    .string()
    .optional()
    .describe("Pagination token from previous response"),
};

const createEndpointArgs = {
  chain: z
    .string()
    .describe("The blockchain chain (e.g., 'ethereum', 'polygon', 'arbitrum')"),
  network: z
    .string()
    .describe(
      "The specific network within the chain (e.g., 'mainnet', 'testnet')",
    ),
};

export function setEndpointTools(server: McpServer, client: QuickNodeClient) {
  server.registerTool(
    "get-endpoints",
    {
      description:
        "Get all web3 QuickNode endpoints for the user, this is a list of all the endpoints that the user has created across all chains and networks",
    },
    async () => {
      const endpoints = await client.listEndpoints();
      return {
        structuredContent: { data: endpoints },
        content: [
          {
            type: "text",
            text: JSON.stringify(endpoints, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get-endpoint",
    {
      description: "Get a specific web3 QuickNode endpoint details by id",
      inputSchema: { ...genericArgs.endpointIdArgs },
    },
    async ({ endpoint_id }) => {
      const endpoint = await client.getEndpoint(endpoint_id);
      return {
        structuredContent: { data: endpoint.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(endpoint.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get-endpoint-logs",
    {
      description:
        "Get the request/response logs for a specific QuickNode endpoint",
      inputSchema: { ...endpointLogsArgs },
    },
    async ({ endpoint_id, from, to, limit, include_details, next_at }) => {
      const logs = await client.getEndpointLogs({
        endpoint_id,
        from,
        to,
        limit,
        include_details,
        next_at: next_at,
      });
      return {
        structuredContent: { data: logs.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(logs.data, null, 2),
          },
        ],
        nextCursor: logs.next_at,
      };
    },
  );

  server.registerTool(
    "create-endpoint",
    {
      description:
        "Create a new web3 RPC endpoint for a given chain and network under user's QuickNode account. This can error if the chain and network combination is not supported or if the user has reached their endpoint limit, in which case the user should try a different chain and network combination (can request get-chains tool for information on supported chains) or delete an existing endpoint",
      inputSchema: { ...createEndpointArgs },
    },
    async ({ chain, network }) => {
      const endpoint = await client.createEndpoint({ chain, network });
      return {
        structuredContent: { data: endpoint.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(endpoint.data, null, 2),
          },
        ],
      };
    },
  );
}
