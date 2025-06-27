import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { QuickNodeClient } from "../clients/console_api_client";
import { setEndpointResources } from "./endpoints";

export function setResources(server: McpServer, client: QuickNodeClient) {
  setEndpointResources(server, client);
}
