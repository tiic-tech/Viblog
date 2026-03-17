# @viblog/mcp-server

MCP Server for Viblog - AI-Native Blogging Platform for Vibe Coders.

## Overview

This package provides a Model Context Protocol (MCP) server that enables Claude Code to write and publish directly to Viblog. It replaces the previous Playwright-based indirect workflow with a direct API integration.

## Features

- **Create Vibe Sessions** - Start recording your coding sessions
- **Append Context** - Incrementally add conversation, code, commands
- **Batch Upload** - Upload complete session context at once
- **Generate Structured Context** - AI-powered extraction of problems, solutions, learnings
- **Generate Article Drafts** - Transform sessions into blog articles
- **List Sessions** - View and manage your sessions

## Installation

```bash
npm install @viblog/mcp-server
```

## Configuration

### 1. Get Your API Key

1. Log in to your Viblog Web UI
2. Navigate to Settings > API Keys
3. Generate a new API key (format: `vb_xxxxxxxx`)

### 2. Configure Claude Code

Add the following to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "viblog": {
      "command": "npx",
      "args": ["@viblog/mcp-server"],
      "env": {
        "VIBLOG_API_URL": "https://viblog.tiic.tech",
        "VIBLOG_API_KEY": "vb_your_api_key_here"
      }
    }
  }
}
```

### 3. Restart Claude Code

After updating the configuration, restart Claude Code to load the MCP server.

## Available Tools

### Layer 1: Data Collection

| Tool | Description |
|------|-------------|
| `create_vibe_session` | Create a new recording session |
| `append_session_context` | Add context incrementally during a session |
| `upload_session_context` | Batch upload complete session data |

### Layer 2: Structured Processing

| Tool | Description |
|------|-------------|
| `generate_structured_context` | Extract structured data from raw session |

### Layer 3: Content Generation

| Tool | Description |
|------|-------------|
| `generate_article_draft` | Transform session into blog article |

### Layer 4: Session Management

| Tool | Description |
|------|-------------|
| `list_user_sessions` | List all your sessions |

## Usage Examples

### Creating a Session

```
User: Create a new vibe session for my Next.js project

Claude: I'll create a new vibe session for you.
[Uses create_vibe_session tool]

Session created successfully!
Session ID: abc-123-def
```

### Appending Context

```
User: Record this code snippet in my session

Claude: I'll append this to your session.
[Uses append_session_context tool]

Fragment #5 appended successfully.
```

### Generating an Article

```
User: Generate a tutorial article from my session

Claude: I'll generate an article draft from your session.
[Uses generate_article_draft tool]

Article draft generated! Preview it in the Viblog Web UI.
```

## Architecture

```
Claude Code
    │
    │ stdio (JSON-RPC 2.0)
    ▼
viblog-mcp-server (npm package)
    │
    │ HTTP REST
    ▼
Viblog Backend APIs
├── POST /api/vibe-sessions
├── POST /api/vibe-sessions/[id]/fragments
├── POST /api/vibe-sessions/generate-structured-context
└── POST /api/vibe-sessions/generate-article-draft
```

## Development

### Build

```bash
npm run build
```

### Local Testing

```bash
# Set environment variables
export VIBLOG_API_URL="http://localhost:3000"
export VIBLOG_API_KEY="vb_test_key"

# Run the server
node dist/index.js
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VIBLOG_API_URL` | Yes | Base URL of the Viblog API |
| `VIBLOG_API_KEY` | Yes | Your API key from Viblog Web UI |

## License

MIT

## Support

For issues and feature requests, please visit [GitHub Issues](https://github.com/viblog/viblog/issues).