import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { QuickNodeClient } from "../clients/console_api_client";
import { unixTimestampToIso } from "../common/utils";

export function setBillingTools(server: McpServer, client: QuickNodeClient) {
  server.registerTool(
    "get-billing-invoices",
    {
      description: "Get all billing invoices for the user's QuickNode account",
    },
    async () => {
      const invoices = await client.getBillingInvoices();

      const data = {
        invoices: invoices.data.invoices.map((invoice) => ({
          ...invoice,
          period_end: unixTimestampToIso(invoice.period_end),
          period_start: unixTimestampToIso(invoice.period_start),
          created: unixTimestampToIso(invoice.created),
        })),
      };

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

  server.registerTool(
    "get-billing-payments",
    {
      description: "Get all billing payments for the user's QuickNode account",
    },
    async () => {
      const payments = await client.getBillingPayments();

      const data = {
        payments: payments.data.payments.map((payment) => ({
          ...payment,
          created_at: unixTimestampToIso(parseInt(payment.created_at)),
        })),
      };

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
}
