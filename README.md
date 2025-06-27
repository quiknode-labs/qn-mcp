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
      "args": ["-y", "@quicknode/mcp"],
      "env": {
        "QUICKNODE_API_KEY": "<replace-with-qn-token>"
      }
    }
  }
}
```

Replace `<qn-token>` with a QuickNode API token. Can be created on the [QuickNode dashboard](https://dashboard.quicknode.com/api-keys)

---

## 📋 Notes

This MCP server requires **Node.js 18.18.0 or higher**.

### Installing Node.js

If you don't have Node.js installed or need to upgrade:

**Download from nodejs.org**

- Visit [nodejs.org](https://nodejs.org/)
- Download and install the LTS version (recommended)

**Verify your installation:**

```bash
node --version  # Should show v18.18.0 or higher
npm --version   # Should show npm version
```

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
        "QUICKNODE_API_KEY": "<replace-with-qn-token>"
      }
    }
  }
}
```

To install dependencies

```bash
pnpm i
```

and kickstart the build with

```bash
pnpm build
```

can also run with watch mode

```bash
pnpm watch
```

Then restart Claude/reload Cursor config or similar, you should see resources/tools get picked up by the chat client.

---

## 💬 Feedback & Support

We'd love to hear from you! If you have questions, suggestions, or run into any issues:

- 📧 **Email us:** [devex@quicknode.com](mailto:devex@quicknode.com)
- 🆘 **General support:** [QuickNode Support](https://support.quicknode.com/)

Your feedback helps us make QuickNode even better! 🚀
