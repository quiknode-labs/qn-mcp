import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { QuickNodeClient } from "../clients/console_api_client";

export function setEndpointResources(
  server: McpServer,
  client: QuickNodeClient,
) {
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
      const endpoint = endpoints.find(
        (endpoint: any) => endpoint.name === name,
      );
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
}
