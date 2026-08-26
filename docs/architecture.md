# AI Asset Intelligence Platform
## Architecture Specification - Phase 0

**Project:** AI Asset Intelligence Platform  
**Environment:** Local Windows Desktop  
**Purpose:** Enterprise-style Proof of Concept (POC)  
**Development Model:** Local-first using free/open-source technologies

---

# 1. Project Objective

The AI Asset Intelligence Platform is an enterprise-style Asset Management and Intelligence POC.

The platform will provide:

- Unified asset information
- Asset inventory and search
- Asset 360 view
- Natural-language interaction with asset information
- RAG-based knowledge and policy retrieval
- Asset lifecycle intelligence
- Risk prioritization
- Reconciliation
- AI-powered recommendations
- Human approval workflows
- MCP-based controlled tool execution
- Role-based access control
- Security guardrails
- Auditability and traceability

The initial implementation will run locally on a Windows desktop using free/open-source technologies wherever practical.

---

# 2. High-Level Architecture

```text
                         +----------------------+
                         |        Figma         |
                         | UI / UX / Prototype  |
                         +----------+-----------+
                                    |
                              Figma MCP
                                    |
                                    v
                         +----------------------+
                         |   React + TypeScript  |
                         |       Frontend       |
                         +----------+-----------+
                                    |
                                  REST
                                    |
                                    v
                         +----------------------+
                         |        FastAPI        |
                         |       Backend        |
                         +----------+-----------+
                                    |
                    +---------------+----------------+
                    |               |                |
                    v               v                v
             +-------------+ +-------------+ +-------------+
             | AI Agent    | | Business    | | Security    |
             | Layer       | | Services    | | Layer       |
             +------+------+ +------+------+ +------+------+
                    |               |                |
                    +---------------+----------------+
                                    |
                                    v
                              +-----------+
                              |    MCP    |
                              |   Layer   |
                              +-----+-----+
                                    |
              +---------------------+----------------------+
              |                     |                      |
              v                     v                      v
       +-------------+       +-------------+       +-------------+
       | Asset MCP   |       | Knowledge   |       | Workflow    |
       |             |       | MCP         |       | MCP         |
       +------+------+       +------+------+       +------+------+
              |                     |                      |
              v                     v                      v
       +-------------+       +-------------+       +-------------+
       | PostgreSQL  |       |   Qdrant    |       | PostgreSQL  |
       | Asset Data  |       | Vector DB   |       | Workflow    |
       +-------------+       +------+------+       +-------------+
                                      |
                                      v
                               +-------------+
                               |   Ollama    |
                               | Local LLM   |
                               +-------------+

                         Security / Identity
                              |
                              v
                         +-----------+
                         | Keycloak  |
                         | OIDC/RBAC |
                         +-----------+

                         Observability
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
         Audit Logs      Metrics/Logs       Traces