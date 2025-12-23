## Simple Read-Only Microservices App

This project is a minimal two-service, read-only app designed for load testing:

- `api-gateway` (port 3000): Thin HTTP layer that exposes read endpoints and proxies to the data service.
- `data-service` (port 3002): Holds 10 preloaded items in memory and serves them via simple GET APIs.

There is no persistence; each pod keeps its own in-memory list of 10 items.

### Quick Start (Local with Docker Compose)

```bash
# Build and start locally
docker compose up --build

# API Gateway will be on http://localhost:3000
# Data Service will be on http://localhost:3002
```

Or run services manually:

```bash
# Install dependencies
pushd api-gateway && npm install && popd
pushd data-service && npm install && popd

# Start services (in two terminals)
cd data-service && npm start
cd api-gateway && npm start
```

### API (via API Gateway)

- `GET /api/items` – list all items (10 preloaded)
- `GET /api/items/:id` – get an item by ID (1–10)

Health endpoints:

- `GET /health` – basic health check
- `GET /ready` – readiness check

Notes:

- IDs are integers 1–10. A request outside this range returns 404.

### Load Testing (k6)

There is a simple k6 script that randomly reads items 1–10.

```bash
# From repo root
k6 run -e API_URL=http://localhost:3000 k6-tests/load-test.js

# Or against a deployed URL
k6 run -e API_URL=https://app.alvyltunnel.com k6-tests/load-test.js
```

The script performs simple GETs and asserts 200 status.

### Build and Push Images

Use the provided build script (amd64):

```bash
# Optional: set TAG=v1.0.0
./build.sh
```

### Kubernetes

Manifests are under `k8s/`. The `api-gateway` service is exposed via Ingress; `data-service` is cluster-internal.

