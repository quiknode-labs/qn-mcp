## QuickNode MCP server

QuickNode platform MCP server

## Getting Started

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

Replace <qn-token> with a QuickNode API token. Can be created on the [QuickNode dashboard](https://dashboard.quicknode.com/api-keys)

## Development Guide

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

Then restart Claude/reload Cursor config or alike, you should see resources/tools get picked up by the chat client.
