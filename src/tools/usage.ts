import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { QuickNodeClient } from "../clients/console_api_client";

export function setUsageTools(server: McpServer, client: QuickNodeClient) {
  server.tool(
    "get-rpc-usage",
    {
      start_time: z.number(),
      end_time: z.number(),
    },
    {
      description:
        "Get the usage data for the user's QuickNode RPC account. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    },
    async ({ start_time, end_time }) => {
      const usage = await client.getRpcUsage({ start_time, end_time });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(usage.data, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get-rpc-usage-by-endpoint",
    {
      start_time: z.number(),
      end_time: z.number(),
    },
    {
      description:
        "Get the usage data for the user's QuickNode RPC endpoints. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    },
    async ({ start_time, end_time }) => {
      const usage = await client.getRpcUsageByEndpoint({
        start_time,
        end_time,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(usage.data, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get-rpc-usage-by-method",
    {
      start_time: z.number(),
      end_time: z.number(),
    },
    {
      description:
        "Get the usage data for the user's QuickNode RPC endpoints, broken down by method. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    },
    async ({ start_time, end_time }) => {
      const usage = await client.getRpcUsageByMethod({ start_time, end_time });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(usage.data, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get-rpc-usage-by-chain",
    {
      start_time: z.number(),
      end_time: z.number(),
    },
    {
      description:
        "Get the usage data for the user's QuickNode RPC endpoints, broken down by chain. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    },
    async ({ start_time, end_time }) => {
      const usage = await client.getRpcUsageByChain({ start_time, end_time });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(usage.data, null, 2),
          },
        ],
      };
    },
  );
}
