#!/usr/bin/env node

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import { QuickNodeClient } from "./clients/console_api_client";

// Config
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

// Create an MCP server
const server = new McpServer({
  name: "QuickNode MCP Server",
  description:
    "A MCP server for interacting with QuickNode, leading Web3 infrastructure provider, this server can be used to retrieve information about the user's QuickNode Web3 IaaS resources (i.e. rpc endpoints)",
  version: "1.0.0",
});

server.resource(
  "endpoint",
  new ResourceTemplate("endpoint://{name}", {
    list: async (data) => {
      const endpoints = await client.listEndpoints();
      return {
        resources: endpoints.map((endpoint) => ({
          name: endpoint.name,
          uri: `endpoint://${endpoint.name}`,
        })),
      };
    },
    complete: {
      name: async (data) => {
        console.error("\n\n---data\n", { data });
        const endpoints = await client.listEndpoints();
        return endpoints
          .map((endpoint: any) => endpoint.name)
          .filter((name: string) => name.startsWith(data));
      },
    },
  }),
  {
    description:
      "A resource for listing and getting QuickNode endpoints information",
  },
  async (uri, { name }) => {
    if (Array.isArray(name)) {
      console.error("\n\n---name is array this is not supported yet\n", {
        name,
      });
    }

    const endpoints = await client.listEndpoints();
    const endpoint = endpoints.find((endpoint: any) => endpoint.name === name);
    if (!endpoint) {
      throw new Error(`Endpoint not found: ${name}`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(endpoint, null, 2),
        },
      ],
    };
  },
);

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
  {
    id: z.string(),
  },
  { description: "Get a specific web3 QuickNode endpoint by id" },
  async ({ id }) => {
    const endpoint = await client.getEndpoint(id);
    return {
      content: [
        {
          type: "text",
          // @ts-ignore
          text: JSON.stringify(endpoint.data, null, 2),
        },
      ],
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

server.tool(
  "get-chains",
  { description: "Get all chains supported by QuickNode" },
  async () => {
    const chains = await client.getChains();
    return {
      content: [
        {
          type: "text",
          // @ts-ignore
          text: JSON.stringify(chains.data, null, 2),
        },
      ],
    };
  },
);

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
          // @ts-ignore
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
    const usage = await client.getRpcUsageByEndpoint({ start_time, end_time });
    return {
      content: [
        {
          type: "text",
          // @ts-ignore
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
          // @ts-ignore
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
          // @ts-ignore
          text: JSON.stringify(usage.data, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "get-endpoint-logs",
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

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Secure MCP Filesystem Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
