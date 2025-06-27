# ![QuickNode Logo](https://www.quicknode.com/compiled-assets/qn-logo-q.svg)uickNode MCP Server

> **🚀 The official Model Context Protocol (MCP) server for QuickNode**
>
> Unleash the power of blockchain infrastructure from your AI workflows

---

## 🌟 What is QuickNode MCP?

QuickNode MCP Server brings the power of QuickNode's blockchain infrastructure directly to your AI assistant. With this MCP server, you can:

- **🔧 Set up and configure** QuickNode endpoints and infra across multiple networks
- **📊 Monitor endpoint usage** and billing information
- **⚡ Manage your QuickNode infrastructure** through natural language
- **🛠️ Unlock blockchain operations** by provisioning the infrastructure you need

Built by the team at [QuickNode](http://quicknode.com/), we're trailblazers in blockchain and web3 technology, tirelessly working to simplify blockchain infrastructure. Our combined passion, ingenuity, and dedication pave the way for seamless, high-performance API access across multiple platforms, shaping the future of digital interactions.

---

## 🚀 Getting Started

Add to your config on your `claude_desktop_config.json`, Cursor's `mcp.json` or alike

```json
{
  "mcpServers": {
    "quicknode-mcp": {
      "command": "npx",
      "args": ["-y", "quiknode-labs/qn-mcp"],
      "env": {
        "QUICKNODE_API_KEY": "<qn-token>"
      }
    }
  }
}
```

Replace `<qn-token>` with a QuickNode API token. Can be created on the [QuickNode dashboard](https://dashboard.quicknode.com/api-keys)

---

## 🛠️ Development Guide

### How to run locally

To run from local repo, put this server config on your `claude_desktop_config.json`, Cursor's `mcp.json` or alike

```json
{
  "mcpServers": {
    "quicknode-mcp": {
      "command": "<absolute-path-to-repo>/qn-mcp/dist/index.js",
      "env": {
        "QUICKNODE_API_KEY": "<qn-token>"
      }
    }
  }
}
```

Then restart Claude/reload Cursor config or similar, you should see resources/tools get picked up by the chat client.
