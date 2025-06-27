import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { QuickNodeClient } from "../clients/console_api_client";
import { setChainTools } from "./chains";
import { setEndpointTools } from "./endpoints";
import { setUsageTools } from "./usage";

export function setTools(server: McpServer, client: QuickNodeClient) {
  setEndpointTools(server, client);
  setChainTools(server, client);
  setUsageTools(server, client);
}
