\# AI Asset Intelligence Platform



Enterprise-style Asset Intelligence POC.



\## Objectives



\- Unified asset information

\- Natural language asset queries

\- RAG-based policy and knowledge retrieval

\- AI-powered asset recommendations

\- Risk prioritization

\- Asset lifecycle management

\- Reconciliation

\- Human approval workflows

\- MCP-based tool execution

\- RBAC and security

\- Audit and traceability

\- Local-first development



\## Architecture



Figma

&#x20; ↓

React + TypeScript

&#x20; ↓

FastAPI

&#x20; ↓

AI Agent

&#x20; ↓

MCP

&#x20; ├── Asset MCP

&#x20; ├── Knowledge MCP

&#x20; ├── Reconciliation MCP

&#x20; └── Workflow MCP

&#x20; ↓

PostgreSQL / Qdrant / Ollama

&#x20; ↓

Keycloak

&#x20; ↓

Audit / Observability



\## Development Environment



This project is intended to run locally on a Windows desktop

using free/open-source technologies wherever practical.



\## Project Structure



\- docs/       Architecture and documentation

\- design/     Figma/design artifacts

\- frontend/   React application

\- backend/    FastAPI backend

\- agents/     AI agents

\- mcp/        MCP servers/tools

\- rag/        RAG pipeline

\- database/   Database scripts/migrations

\- security/   Security configuration/tests

\- tests/      Automated tests

\- docker/     Docker configuration

