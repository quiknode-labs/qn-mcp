import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { QuickNodeClient } from "../clients/console_api_client";
import {
  MetricsPeriod,
  MetricsType,
  RateLimitInterval,
  RateLimitStatus,
} from "../clients/console_api_client/types";
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

const endpointMetricArgs = {
  ...genericArgs.endpointIdArgs,
  period: z
    .enum([
      MetricsPeriod.HOUR,
      MetricsPeriod.DAY,
      MetricsPeriod.WEEK,
      MetricsPeriod.MONTH,
    ])
    .describe("The time period for which the data is to be retrieved"),
  metric: z
    .enum([
      MetricsType.METHOD_CALLS_OVER_TIME,
      MetricsType.RESPONSE_STATUS_OVER_TIME,
      MetricsType.METHOD_CALL_BREAKDOWN,
      MetricsType.RESPONSE_STATUS_BREAKDOWN,
      MetricsType.METHOD_RESPONSE_TIME_MAX,
    ])
    .describe("The type of metric to retrieve"),
};

const updateRateLimitsArgs = {
  ...genericArgs.endpointIdArgs,
  rps: z.number().min(1).optional().describe("Maximum requests per second"),
  rpm: z.number().min(1).optional().describe("Maximum requests per minute"),
  rpd: z.number().min(1).optional().describe("Maximum requests per day"),
};

const createMethodRateLimitArgs = {
  ...genericArgs.endpointIdArgs,
  interval: z
    .enum([
      RateLimitInterval.SECOND,
      RateLimitInterval.MINUTE,
      RateLimitInterval.HOUR,
    ])
    .describe("The time interval for the rate limit"),
  methods: z
    .array(z.string())
    .min(1)
    .describe("Array of method names to apply the rate limit to"),
  rate: z
    .number()
    .min(1)
    .describe(
      "Maximum number of requests allowed within the specified interval",
    ),
};

const updateMethodRateLimitArgs = {
  ...genericArgs.endpointIdArgs,
  method_rate_limit_id: z
    .string()
    .describe("The unique identifier for the rate limiter"),
  status: z
    .enum([RateLimitStatus.ENABLED, RateLimitStatus.DISABLED])
    .describe("If the rate limiter should be enabled or disabled"),
  methods: z
    .array(z.string())
    .min(1)
    .describe("Array of method names to apply the rate limit to"),
  rate: z
    .number()
    .min(1)
    .describe(
      "Maximum number of requests allowed within the specified interval",
    ),
};

const deleteMethodRateLimitArgs = {
  ...genericArgs.endpointIdArgs,
  method_rate_limit_id: z
    .string()
    .describe(
      "The unique identifier of the rate limiter to delete. This can be found in the output of the get-endpoint-method-rate-limits tool",
    ),
};

const updateSecurityOptionsArgs = {
  ...genericArgs.endpointIdArgs,
  tokens: z
    .enum(["enabled", "disabled"])
    .optional()
    .describe("Controls the token-based authentication mechanism"),
  referrers: z
    .enum(["enabled", "disabled"])
    .optional()
    .describe(
      "The URL or domain that is allowed to access the specific API endpoint",
    ),
  jwts: z
    .enum(["enabled", "disabled"])
    .optional()
    .describe(
      "Configures JSON Web Tokens (JWTs) for secure authentication and authorization",
    ),
  ips: z
    .enum(["enabled", "disabled"])
    .optional()
    .describe("Specifies IP address-based restrictions or permissions"),
  domainMasks: z
    .enum(["enabled", "disabled"])
    .optional()
    .describe("Configures the masking or restriction of specific domains"),
  hsts: z
    .enum(["enabled", "disabled"])
    .optional()
    .describe("The HTTP Strict Transport Security (HSTS)"),
  cors: z
    .enum(["enabled", "disabled"])
    .optional()
    .describe(
      "Configures Cross-Origin Resource Sharing (CORS) policies to control how resources can be accessed by external domains",
    ),
};

// Security management argument schemas
const createDomainMaskArgs = {
  ...genericArgs.endpointIdArgs,
  domain_mask: z
    .string()
    .describe("The domain mask that you will use to mask your endpoint"),
};

const deleteDomainMaskArgs = {
  ...genericArgs.endpointIdArgs,
  domain_mask_id: z
    .string()
    .describe("The unique identifier of the domain mask to delete"),
};

const createIpArgs = {
  ...genericArgs.endpointIdArgs,
  ip: z
    .string()
    .describe(
      "The specific IP address that is allowed to access the API endpoint",
    ),
};

const deleteIpArgs = {
  ...genericArgs.endpointIdArgs,
  ip_id: z.string().describe("The unique identifier of the IP rule to delete"),
};

const createJwtArgs = {
  ...genericArgs.endpointIdArgs,
  public_key: z
    .string()
    .describe("The public key used to verify the JWT token"),
  kid: z
    .string()
    .describe("The key identifier (KID) associated with the public key"),
  name: z.string().describe("A human-readable name for the JWT configuration"),
};

const deleteJwtArgs = {
  ...genericArgs.endpointIdArgs,
  jwt_id: z
    .string()
    .describe("The unique identifier of the JWT configuration to delete"),
};

const createReferrerArgs = {
  ...genericArgs.endpointIdArgs,
  referrer: z
    .string()
    .describe(
      "The URL or domain that is allowed to access the specific API endpoint",
    ),
};

const deleteReferrerArgs = {
  ...genericArgs.endpointIdArgs,
  referrer_id: z
    .string()
    .describe("The unique identifier of the referrer rule to delete"),
};

const createTokenArgs = {
  ...genericArgs.endpointIdArgs,
  token: z
    .string()
    .describe(
      "The authentication token that is allowed to access the API endpoint",
    ),
};

const deleteTokenArgs = {
  ...genericArgs.endpointIdArgs,
  token_id: z.string().describe("The unique identifier of the token to delete"),
};

const getLogDetailsArgs = {
  ...genericArgs.endpointIdArgs,
  request_id: z
    .string()
    .describe("The UUID of the log entry to get detailed information for"),
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
    "get-endpoint-log-details",
    {
      description:
        "Get detailed request and response information for a specific log entry. This provides the raw request payload and full response that were logged for a particular request",
      inputSchema: { ...getLogDetailsArgs },
    },
    async ({ endpoint_id, request_id }) => {
      const logDetails = await client.getEndpointLogDetails({
        endpoint_id,
        request_id,
      });
      return {
        structuredContent: { data: logDetails.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(logDetails.data, null, 2),
          },
        ],
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

  server.registerTool(
    "delete-endpoint",
    {
      description:
        "Archive a QuickNode endpoint by its ID. This will archive the endpoint and make it inactive. THIS IS A DESTRUCTIVE ACTION",
      inputSchema: { ...genericArgs.endpointIdArgs },
    },
    async ({ endpoint_id }) => {
      const result = await client.deleteEndpoint(endpoint_id);
      return {
        structuredContent: { data: result.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get-endpoint-metrics",
    {
      description:
        "Get metrics for a specific QuickNode endpoint. Supports various metrics like method calls, response status, and response times over different time periods",
      inputSchema: { ...endpointMetricArgs },
    },
    async ({ endpoint_id, period, metric }) => {
      const metrics = await client.getEndpointMetrics(endpoint_id, {
        period,
        metric,
      });
      return {
        structuredContent: { data: metrics.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(metrics.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "update-endpoint-rate-limits",
    {
      description:
        "Update the general rate limits (RPS, RPM, RPD) for a QuickNode endpoint",
      inputSchema: { ...updateRateLimitsArgs },
    },
    async ({ endpoint_id, rps, rpm, rpd }) => {
      const rateLimits = await client.updateRateLimits(endpoint_id, {
        rate_limits: {
          ...(rps !== undefined && { rps }),
          ...(rpm !== undefined && { rpm }),
          ...(rpd !== undefined && { rpd }),
        },
      });
      return {
        structuredContent: { data: rateLimits.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(rateLimits.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get-endpoint-method-rate-limits",
    {
      description:
        "Get all method rate limits for a specific QuickNode endpoint",
      inputSchema: { ...genericArgs.endpointIdArgs },
    },
    async ({ endpoint_id }) => {
      const rateLimits = await client.getMethodRateLimits(endpoint_id);
      return {
        structuredContent: { data: rateLimits.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(rateLimits.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "create-endpoint-method-rate-limit",
    {
      description:
        "Create a new method-specific rate limiter for a QuickNode endpoint",
      inputSchema: { ...createMethodRateLimitArgs },
    },
    async ({ endpoint_id, interval, methods, rate }) => {
      const rateLimit = await client.createMethodRateLimit(endpoint_id, {
        interval,
        methods,
        rate,
      });
      return {
        structuredContent: { data: rateLimit.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(rateLimit.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "update-endpoint-method-rate-limit",
    {
      description:
        "Update an existing method-specific rate limit for a QuickNode endpoint",
      inputSchema: { ...updateMethodRateLimitArgs },
    },
    async ({ endpoint_id, method_rate_limit_id, status, methods, rate }) => {
      const rateLimit = await client.updateMethodRateLimit(
        endpoint_id,
        method_rate_limit_id,
        {
          status,
          methods,
          rate,
        },
      );
      return {
        structuredContent: { data: rateLimit.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(rateLimit.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "delete-endpoint-method-rate-limit",
    {
      description:
        "Delete a method-specific rate limit from a QuickNode endpoint. THIS IS A DESTRUCTIVE ACTION",
      inputSchema: { ...deleteMethodRateLimitArgs },
    },
    async ({ endpoint_id, method_rate_limit_id }) => {
      const result = await client.deleteMethodRateLimit(
        endpoint_id,
        method_rate_limit_id,
      );
      return {
        structuredContent: { data: result.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get-endpoint-security-options",
    {
      description: "Get security options for a specific QuickNode endpoint",
      inputSchema: { ...genericArgs.endpointIdArgs },
    },
    async ({ endpoint_id }) => {
      const securityOptions = await client.getSecurityOptions(endpoint_id);
      return {
        structuredContent: { data: securityOptions.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(securityOptions.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "update-endpoint-security-options",
    {
      description: "Update security options for a specific QuickNode endpoint",
      inputSchema: { ...updateSecurityOptionsArgs },
    },
    async ({
      endpoint_id,
      tokens,
      referrers,
      jwts,
      ips,
      domainMasks,
      hsts,
      cors,
    }) => {
      const options: any = {};
      if (tokens !== undefined) options.tokens = tokens;
      if (referrers !== undefined) options.referrers = referrers;
      if (jwts !== undefined) options.jwts = jwts;
      if (ips !== undefined) options.ips = ips;
      if (domainMasks !== undefined) options.domainMasks = domainMasks;
      if (hsts !== undefined) options.hsts = hsts;
      if (cors !== undefined) options.cors = cors;

      const securityOptions = await client.updateSecurityOptions(endpoint_id, {
        options,
      });
      return {
        structuredContent: { data: securityOptions.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(securityOptions.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "create-endpoint-security-domain-mask",
    {
      description: "Create a domain mask for a QuickNode endpoint",
      inputSchema: { ...createDomainMaskArgs },
    },
    async ({ endpoint_id, domain_mask }) => {
      const domainMask = await client.createEndpointSecurityDomainMask(
        endpoint_id,
        {
          domain_mask,
        },
      );
      return {
        structuredContent: { data: domainMask.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(domainMask.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "delete-endpoint-security-domain-mask",
    {
      description:
        "Delete a domain mask from a QuickNode endpoint. THIS IS A DESTRUCTIVE ACTION",
      inputSchema: { ...deleteDomainMaskArgs },
    },
    async ({ endpoint_id, domain_mask_id }) => {
      const result = await client.deleteEndpointSecurityDomainMask(
        endpoint_id,
        domain_mask_id,
      );
      return {
        structuredContent: { data: result.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "create-endpoint-security-ip",
    {
      description: "Create an IP restriction for a QuickNode endpoint",
      inputSchema: { ...createIpArgs },
    },
    async ({ endpoint_id, ip }) => {
      const ipRule = await client.createEndpointSecurityIp(endpoint_id, { ip });
      return {
        structuredContent: { data: ipRule.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(ipRule.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "delete-endpoint-security-ip",
    {
      description:
        "Delete an IP restriction from a QuickNode endpoint. THIS IS A DESTRUCTIVE ACTION",
      inputSchema: { ...deleteIpArgs },
    },
    async ({ endpoint_id, ip_id }) => {
      const result = await client.deleteEndpointSecurityIp(endpoint_id, ip_id);
      return {
        structuredContent: { data: result.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "create-endpoint-security-jwt",
    {
      description: "Create a JWT configuration for a QuickNode endpoint",
      inputSchema: { ...createJwtArgs },
    },
    async ({ endpoint_id, public_key, kid, name }) => {
      const jwt = await client.createEndpointSecurityJwt(endpoint_id, {
        public_key,
        kid,
        name,
      });
      return {
        structuredContent: { data: jwt.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(jwt.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "delete-endpoint-security-jwt",
    {
      description:
        "Delete a JWT configuration from a QuickNode endpoint. THIS IS A DESTRUCTIVE ACTION",
      inputSchema: { ...deleteJwtArgs },
    },
    async ({ endpoint_id, jwt_id }) => {
      const result = await client.deleteEndpointSecurityJwt(
        endpoint_id,
        jwt_id,
      );
      return {
        structuredContent: { data: result.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "create-endpoint-security-referrer",
    {
      description: "Create a referrer restriction for a QuickNode endpoint",
      inputSchema: { ...createReferrerArgs },
    },
    async ({ endpoint_id, referrer }) => {
      const referrerRule = await client.createEndpointSecurityReferrer(
        endpoint_id,
        { referrer },
      );
      return {
        structuredContent: { data: referrerRule.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(referrerRule.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "delete-endpoint-security-referrer",
    {
      description:
        "Delete a referrer restriction from a QuickNode endpoint. THIS IS A DESTRUCTIVE ACTION",
      inputSchema: { ...deleteReferrerArgs },
    },
    async ({ endpoint_id, referrer_id }) => {
      const result = await client.deleteEndpointSecurityReferrer(
        endpoint_id,
        referrer_id,
      );
      return {
        structuredContent: { data: result.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "create-endpoint-security-token",
    {
      description: "Create an authentication token for a QuickNode endpoint",
      inputSchema: { ...createTokenArgs },
    },
    async ({ endpoint_id, token }) => {
      const authToken = await client.createEndpointSecurityToken(endpoint_id, {
        token,
      });
      return {
        structuredContent: { data: authToken.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(authToken.data, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "delete-endpoint-security-token",
    {
      description:
        "Delete an authentication token from a QuickNode endpoint. THIS IS A DESTRUCTIVE ACTION",
      inputSchema: { ...deleteTokenArgs },
    },
    async ({ endpoint_id, token_id }) => {
      const result = await client.deleteEndpointSecurityToken(
        endpoint_id,
        token_id,
      );
      return {
        structuredContent: { data: result.data },
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    },
  );
}
