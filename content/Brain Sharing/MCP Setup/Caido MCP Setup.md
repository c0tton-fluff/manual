---
title: Caido MCP Server
tags:
  - mcp
  - caido
  - claude-code
  - go
---

MCP server and CLI for the Caido web proxy. Browse, replay, and analyze HTTP traffic from AI assistants or your terminal. Built on the community Go SDK with OAuth + PAT auth, HTTPQL filtering, and 34 tools.

Source: [c0tton-fluff/caido-mcp-server](https://github.com/c0tton-fluff/caido-mcp-server)

## Architecture

```
Claude Code  -->  stdio  -->  caido-mcp-server (Go)  -->  GraphQL  -->  Caido (port 8080)
Terminal     -->  caido-cli  -->  same GraphQL API
```

Both MCP and CLI share internal packages. Uses [caido-community/sdk-go](https://github.com/caido-community/sdk-go) for type-safe GraphQL communication.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/c0tton-fluff/caido-mcp-server/main/install.sh | bash
```

Or build from source:

```bash
git clone https://github.com/c0tton-fluff/caido-mcp-server.git
cd caido-mcp-server
go build -ldflags "-X main.version=$(git describe --tags)" -o caido-mcp-server ./cmd/mcp
```

## Auth

Two options:

**Personal Access Token (recommended):**
Set `CAIDO_PAT` environment variable.

**OAuth device flow:**
```bash
CAIDO_URL=http://localhost:8080 caido-mcp-server login
```
Opens browser, saves token to `~/.caido-mcp/token.json`. Auto-refreshes.

## Claude Code Config

```json
{
  "mcpServers": {
    "caido": {
      "command": "caido-mcp-server",
      "args": ["serve"],
      "env": {
        "CAIDO_URL": "http://127.0.0.1:8080",
        "CAIDO_PAT": "your-personal-access-token"
      }
    }
  }
}
```

## Tools (34)

### Proxy & Replay

| Tool | What it does |
|------|-------------|
| `list_requests` | Proxy history with HTTPQL filter |
| `get_request` | Request details with body limit + offset |
| `send_request` | Send raw HTTP via replay |
| `list_replay_sessions` | List replay sessions |
| `get_replay_entry` | Get replay entry with request/response |

### Automate (Fuzzing)

| Tool | What it does |
|------|-------------|
| `list_automate_sessions` | List fuzzing sessions |
| `get_automate_session` | Session details + entry list |
| `get_automate_entry` | Fuzz results with payloads |
| `automate_task_control` | Start/stop automation tasks |

### Findings & Discovery

| Tool | What it does |
|------|-------------|
| `list_findings` | List security findings |
| `create_finding` | Create finding for a request |
| `delete_findings` | Remove findings |
| `export_findings` | Export finding data |
| `get_sitemap` | Browse discovered endpoints |
| `list_scopes` / `create_scope` | Target scope management |

### Workflows & Intercept

| Tool | What it does |
|------|-------------|
| `list_workflows` / `run_workflow` / `toggle_workflow` | Workflow automation |
| `intercept_status` / `intercept_control` | Intercept toggle |
| `list_intercept_entries` / `forward_intercept` / `drop_intercept` | Intercept queue |
| `list_tamper_rules` / `create_tamper_rule` / `toggle_tamper_rule` / `delete_tamper_rule` | Match & Replace |
| `list_environments` / `select_environment` | Environment variables |
| `list_projects` / `select_project` | Project switching |
| `list_filters` | Saved filter presets |
| `get_instance` | Instance info |

## Built-in Protections

- Automatic credential redaction (Authorization, Cookie, API key headers)
- Response body capped at 2KB default
- Input validation with length limits
- Minimal tool descriptions for token efficiency

## Caido vs Burp MCP

| Feature | Caido MCP | Burp MCP |
|---------|-----------|----------|
| Transport | Go > GraphQL | Go > SSE |
| Tools | 34 | 10 |
| Filtering | HTTPQL (`req.host.eq:"..."`) | Regex |
| Fuzzing | Automate sessions | Send to Intruder |
| Scanner | No built-in | `get_scanner_issues` |
| Match & Replace | Full CRUD | No |
| Intercept | Full control | No |
| Auth | OAuth + PAT | None (localhost) |

**Use Caido for**: daily proxy work, HTTPQL filtering, fuzzing with Automate, workflow automation, intercept control.

**Use Burp for**: active scanning, Collaborator/blind testing, extension ecosystem (Autorize, Param Miner).

## Port Notes

- Caido default proxy: `127.0.0.1:8080`
- Burp default proxy: `127.0.0.1:8080` (conflict)
- Change one (e.g., Caido to `127.0.0.1:1234`)
- MCP servers use different ports: Caido GraphQL (8080) vs Burp SSE (9876) -- no conflict
