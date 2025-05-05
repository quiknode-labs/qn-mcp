## QuickNode MCP server

QuickNode platform MCP server


## How to run locally

To run from local repo, put this server config on your `claude_desktop_config.json`, Cursor's `mcp.json` or alike

```json
{
  "mcpServers": {
    "quicknode-mcp": {
      "command": "<absolute-path-to-repo>/mc3po/dist/index.js",
            "env": {
              "QUICKNODE_API_KEY": "<qn-token>",
                "QUICKNODE_API_URL": "https://api.quicknode.dev"
            }
        }
    }
}
```

can skip `QUICKNODE_API_URL` and it'll default to api.quicknode.com.

Then restart Claude/reload Cursor config or alike, you should see resources/tools get picked up by the chat client.

