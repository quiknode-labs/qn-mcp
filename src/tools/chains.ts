import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { QuickNodeClient } from "../clients/console_api_client";

export function setChainTools(server: McpServer, client: QuickNodeClient) {
  server.registerTool(
    "get-chains",
    {
      description: "Get all chains supported by QuickNode",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async () => {
      const chains = await client.getChains();
      return {
        structuredContent: { data: chains.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(chains.data, null, 2),
          },
        ],
      };
    },
  );
}
