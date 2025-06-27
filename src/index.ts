#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { QuickNodeClient } from "./clients/console_api_client";
import { setResources } from "./resource";
import { setTools } from "./tools";

const QUICKNODE_API_KEY = process.env.QUICKNODE_API_KEY;
const QUICKNODE_API_URL =
  process.env.QUICKNODE_API_URL || "https://api.quicknode.com";

if (!QUICKNODE_API_KEY) {
  console.error("QUICKNODE_API_KEY must be set");
  process.exit(1);
}

const client = new QuickNodeClient({
  token: QUICKNODE_API_KEY,
  baseUrl: QUICKNODE_API_URL,
});

const server = new McpServer({
  name: "QuickNode Web3 InfrastructureMCP Server",
  description:
    "A MCP server for interacting with QuickNode, leading Web3 infrastructure provider, this server can be used to manage web3 infrastructure (i.e. rpc endpoints) under a user's QuickNode account",
  version: "0.0.1",
});

setTools(server, client);
setResources(server, client);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Secure MCP Filesystem Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
