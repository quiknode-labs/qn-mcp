import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { QuickNodeClient } from "../clients/console_api_client";

export function setEndpointTools(server: McpServer, client: QuickNodeClient) {
  server.tool(
    "get-endpoints",
    "Get all web3 QuickNode endpoints for the user, this is a list of all the endpoints that the user has created across all chains and networks",
    async () => {
      const endpoints = await client.listEndpoints();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(endpoints, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get-endpoint",
    "Get a specific web3 QuickNode endpoint details by id",
    {
      id: z.string().describe("The id of the endpoint to get"),
    },
    { description: "Get a specific web3 QuickNode endpoint by id" },
    async ({ id }) => {
      const endpoint = await client.getEndpoint(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(endpoint.data, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get-endpoint-logs",
    "Get the request/response logs for a specific QuickNode endpoint",
    {
      endpoint_id: z.string(),
      from: z.string(),
      to: z.string(),
      limit: z.number(),
      include_details: z.boolean(),
      next_at: z.string(),
    },
    { description: "Get the logs for a specific QuickNode endpoint" },
    async ({ endpoint_id, from, to, limit, include_details, next_at }) => {
      const logs = await client.getEndpointLogs({
        endpoint_id,
        from,
        to,
        limit,
        include_details,
        next_at,
      });
      return {
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

  server.tool(
    "create-endpoint",
    {
      chain: z.string(),
      network: z.string(),
    },
    {
      description:
        "Create a new web3 RPC endpoint for a given chain and network under user's QuickNode account. This can error if the chain and network combination is not supported or if the user has reached their endpoint limit, in which case the user should try a different chain and network combination (can request get-chains tool for information on supported chains) or delete an existing endpoint",
    },
    async ({ chain, network }) => {
      const endpoint = await client.createEndpoint({ chain, network });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(endpoint, null, 2),
          },
        ],
      };
    },
  );
}
