import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { QuickNodeClient } from "../clients/console_api_client";
import { genericArgs } from "../common/generic_args";
import { isoToUnixTimestamp, unixTimestampToIso } from "../common/utils";

export function setUsageTools(server: McpServer, client: QuickNodeClient) {
  server.tool(
    "get-rpc-usage",
    "Get the usage data for the user's QuickNode RPC account. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    {
      ...genericArgs.timeRangeArgs,
    },
    async ({ start_time, end_time }) => {
      const start_time_unix = isoToUnixTimestamp(start_time);
      const end_time_unix = isoToUnixTimestamp(end_time);

      if (!start_time_unix || !end_time_unix) {
        throw new Error("Invalid time range, start_time and end_time must be valid ISO 8601 date strings");
      }

      const usage = await client.getRpcUsage({ start_time: start_time_unix, end_time: end_time_unix });
      const data = {
        ...usage.data,
        start_time: unixTimestampToIso(usage.data.start_time),
        end_time: unixTimestampToIso(usage.data.end_time),
      }

      return {
        structuredContent: { data },
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get-rpc-usage-by-endpoint",
    "Get the usage data for the user's QuickNode RPC endpoints. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    {
      ...genericArgs.timeRangeArgs,
    },
    async ({ start_time, end_time }) => {
      const start_time_unix = isoToUnixTimestamp(start_time);
      const end_time_unix = isoToUnixTimestamp(end_time);

      if (!start_time_unix || !end_time_unix) {
        throw new Error("Invalid time range, start_time and end_time must be valid ISO 8601 date strings");
      }

      const usage = await client.getRpcUsageByEndpoint({
        start_time: start_time_unix,
        end_time: end_time_unix,
      });
      return {
        structuredContent: { data: usage.data },
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
    "Get the usage data for the user's QuickNode RPC endpoints, broken down by method. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    {
      ...genericArgs.timeRangeArgs,
    },
    async ({ start_time, end_time }) => {
      const start_time_unix = isoToUnixTimestamp(start_time);
      const end_time_unix = isoToUnixTimestamp(end_time);

      if (!start_time_unix || !end_time_unix) {
        throw new Error("Invalid time range, start_time and end_time must be valid ISO 8601 date strings");
      }

      const usage = await client.getRpcUsageByMethod({ start_time: start_time_unix, end_time: end_time_unix });
      return {
        structuredContent: { data: usage.data },
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
    "Get the usage data for the user's QuickNode RPC endpoints, broken down by chain. The start_time and end_time parameters are unix timestamps in seconds to filter the usage data by time range",
    {
      ...genericArgs.timeRangeArgs,
    },
    async ({ start_time, end_time }) => {
      const start_time_unix = isoToUnixTimestamp(start_time);
      const end_time_unix = isoToUnixTimestamp(end_time);

      if (!start_time_unix || !end_time_unix) {
        throw new Error("Invalid time range, start_time and end_time must be valid ISO 8601 date strings");
      }

      const usage = await client.getRpcUsageByChain({ start_time: start_time_unix, end_time: end_time_unix });
      return {
        structuredContent: { data: usage.data },
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
