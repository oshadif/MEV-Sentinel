<div align="center">

# 🛡️ MEV Sentinel

### Real-Time Ethereum Mempool Intelligence & MEV Analytics Platform

An analytics-only blockchain intelligence platform for observing Ethereum pending transactions, recognizing DEX activity, decoding supported swap calls, tracking transaction lifecycle, and surfacing heuristic MEV-related signals through a real-time dashboard.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-JSON--RPC-627EEA?logo=ethereum&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

---

## 🚀 Overview

**MEV Sentinel v2.0** is a full-stack Ethereum mempool intelligence platform built as a portfolio-grade blockchain engineering project. It can run entirely in **demo mode** with realistic synthetic transaction flow, or connect to an Ethereum WebSocket RPC endpoint for live pending-transaction and block monitoring.

The project focuses on **observation, decoding, analytics, and defensive intelligence**. It does not sign transactions or execute MEV strategies.

## ✨ Core Capabilities

- Real-time Ethereum `newPendingTransactions` WebSocket subscription
- New-block subscription and pending → included lifecycle tracking
- Pending transaction timeout / dropped-state tracking
- Known DEX router recognition
- Uniswap V2 / V3-style ABI and selector-aware swap decoding
- Ethereum value and gas normalization
- Whale transaction detection
- High-gas and high-priority DEX alerts
- Heuristic MEV-related transaction classification
- Real-time Socket.IO event streaming
- MySQL telemetry persistence
- REST API with search and filtering
- Protocol, classification, and gas analytics
- React + Vite dark analytics dashboard
- Recharts visualizations
- Docker Compose environment
- Automated backend tests
- Realistic synthetic demo stream

## 🧠 Intelligence Pipeline

```text
Ethereum WebSocket RPC
        │
        ▼
Pending Transaction Hashes
        │
        ▼
eth_getTransactionByHash
        │
        ▼
Router Recognition
        │
        ▼
DEX Calldata Decoder
        │
        ▼
Transaction Normalization
        │
        ▼
Heuristic MEV Classifier
        │
   ┌────┴────┐
   ▼         ▼
MySQL     Socket.IO
   │         │
   ▼         ▼
REST API  React Dashboard
```

## 🔎 Signal Types

The current intelligence layer can classify activity such as:

- `NORMAL`
- `DEX_ACTIVITY`
- `DEX_SWAP`
- `WHALE`
- `HIGH_GAS`
- `HIGH_PRIORITY_DEX`
- `MEV_PRIORITY_SIGNAL`

These are **heuristic analytics labels**, not guarantees that a transaction represents profitable or malicious MEV activity.

## 🧱 Architecture

```text
client/
  React + Vite + Recharts + Socket.IO Client

server/
  Express + Socket.IO
  Ethereum JSON-RPC / WebSocket ingestion
  DEX router recognition + decoder
  MEV analytics classifier
  in-memory hot cache
  MySQL persistence

database/
  normalized MySQL schema

docs/
  architecture, API, testing, security
```

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router, Recharts |
| Backend | Node.js, Express.js |
| Realtime | Socket.IO, Ethereum WebSockets |
| Blockchain | Ethereum JSON-RPC, ethers.js, ws |
| Database | MySQL 8, mysql2 |
| Deployment | Docker, Docker Compose |
| Testing | Node.js built-in test runner |

## ⚡ Quick Start — Demo Mode

The safest and easiest way to run the portfolio locally is Docker demo mode.

```bash
git clone https://github.com/oshadif/MEV-Sentinel.git
cd MEV-Sentinel
cp .env.example .env
docker compose up --build
```

Open:

- **Dashboard:** `http://localhost:5173`
- **API health:** `http://localhost:4000/api/health`

Demo mode is enabled by default and continuously generates realistic synthetic blockchain telemetry.

## ⛓️ Live Ethereum Mode

Configure your own Ethereum RPC endpoints in `.env`:

```env
DEMO_MODE=false
ETH_WS_URL=wss://your-ethereum-websocket-endpoint
ETH_HTTP_URL=https://your-ethereum-http-endpoint
```

Then restart:

```bash
docker compose up --build
```

> Never commit your real RPC credentials or other secrets.

## 🌐 REST API

Main endpoints:

```text
GET /api/health
GET /api/stats
GET /api/transactions
GET /api/transactions/:hash
GET /api/signals
GET /api/blocks
GET /api/analytics/protocols
GET /api/analytics/classifications
GET /api/analytics/gas
```

Example filters:

```text
/api/transactions?protocol=Uniswap%20V3&classification=DEX_SWAP&minValue=1&limit=50
/api/transactions?address=0xabc...
/api/signals?type=WHALE&limit=25
```

See [`docs/API.md`](docs/API.md) for more details.

## 🖥️ Dashboard

The frontend includes five primary views:

- **Overview** — network statistics, gas analytics, protocol distribution, latest signals and blocks
- **Live Mempool** — real-time transaction inspection and filtering
- **MEV Signals** — heuristic intelligence events and confidence levels
- **Analytics** — protocol, classification and gas visualizations
- **Search** — transaction cache search by address, hash, protocol, method or signal

## 🧪 Testing

```bash
cd server
npm install
npm test
```

Additional manual and live-mode testing guidance is available in [`docs/TESTING.md`](docs/TESTING.md).

## 🔐 Security & Ethical Boundary

MEV Sentinel is **observational and analytics-only**.

It deliberately does **not** contain:

- private-key management
- transaction signing
- bundle relay submission
- front-running execution
- sandwich execution
- exploit automation

For public deployment, add authentication, TLS, stronger distributed rate limiting, private database networking, secret management, observability and hardened infrastructure. See [`docs/SECURITY.md`](docs/SECURITY.md).

## 📚 Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture and data flow
- [`docs/API.md`](docs/API.md) — REST API reference
- [`docs/TESTING.md`](docs/TESTING.md) — testing procedures
- [`docs/SECURITY.md`](docs/SECURITY.md) — security and ethical scope
- [`docs/CV_PROJECT.md`](docs/CV_PROJECT.md) — CV-ready project description

## 🗺️ Future Evolution

- Redis Streams or Kafka for high-volume ingestion
- ClickHouse/time-series analytics storage
- broader ABI and router registry
- token metadata workers
- Prometheus / OpenTelemetry metrics
- authenticated multi-user dashboard
- additional chains and L2 monitoring
- anomaly-detection models
- replayable historical analytics

## 👩‍💻 Author

**Oshadi Vidumini Fernando**  
Software Engineer · Full-Stack & Mobile Developer  
GitHub: [@oshadif](https://github.com/oshadif)

---

<div align="center">

### MEV Sentinel — Observe the mempool. Decode the flow. Surface the signal.

⭐ Star the repository if you find the project useful.

</div>
