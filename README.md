# Viblog

> **Your Personal Vibe Coding Growth Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is Viblog?

Viblog is an **open-source personal tool** for Vibe Coders - developers who use AI tools (Claude, Cursor, Windsurf, etc.) to build faster.

### Mission

**Prove your capability, accelerate your growth.**

Viblog helps you:
- **Record** - Capture your authentic vibe coding sessions
- **Analyze** - Track velocity, efficiency, and growth metrics
- **Share** - Transform experiences into beautiful content

---

## Key Features

- **MCP Session Sync** - Zero-effort recording from Claude Code
- **Efficiency Dashboard** - Quantified metrics (velocity, token economy, etc.)
- **Article Generation** - AI-powered blog post creation
- **Local-First** - All data stays on your machine

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 18 |
| Database | PostgreSQL (Docker) |
| MCP Server | Built-in, 7 tools |
| Deployment | Docker Compose |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/archygang/Viblog.git
cd Viblog

# Start with Docker Compose
docker-compose up -d

# Open in browser
open http://localhost:3000
```

That's it! No Supabase, no cloud setup. Just you and your data.

---

## Docker Configuration

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: viblog
      POSTGRES_USER: viblog
      POSTGRES_PASSWORD: viblog
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Extended Features (Optional)

```bash
# Start with Apache AGE (knowledge graph) and TimescaleDB (time-series)
docker-compose --profile extended up -d
```

---

## Environment Variables

```env
# Database (auto-configured in Docker)
DATABASE_URL=postgresql://viblog:viblog@db:5432/viblog

# LLM Configuration (your own API keys)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# MCP Server
MCP_API_URL=http://localhost:3000/api
```

---

## MCP Tools

Viblog includes 7 MCP tools for session management:

| Tool | Purpose |
|------|---------|
| `create_vibe_session` | Start a new session |
| `append_session_context` | Add content to session |
| `upload_session_context` | Batch upload fragments |
| `generate_structured_context` | Extract insights |
| `generate_article_draft` | Create blog draft |
| `list_user_sessions` | View all sessions |
| `publish_article` | Publish to Viblog |

---

## Project Structure

```
Viblog/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── types/            # TypeScript definitions
├── packages/
│   └── viblog-mcp-server/  # MCP Server
├── docker/               # Docker configuration
└── docs/                 # Documentation
```

---

## Related Projects

- **[viblog-community](https://github.com/archygang/viblog-community)** - Community platform for Vibe Coders (cloud-hosted)

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 0 | Docker setup, local PostgreSQL | In Progress |
| Phase 1 | Metrics Engine, Dashboard | Planned |
| Phase 2 | Apache AGE integration | Planned |
| Phase 3 | TimescaleDB for analytics | Planned |

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with vibe, for Vibe Coders**