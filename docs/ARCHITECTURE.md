# Architecture

## Data flow

1. Ethereum WebSocket subscription receives pending transaction hashes.
2. The backend resolves each hash with `eth_getTransactionByHash`.
3. Router recognition identifies known DEX targets.
4. The decoder attempts selector/ABI decoding for supported Uniswap V2/V3-style calls.
5. The normalization layer computes ETH/Gwei values and extracts method/token data.
6. The heuristic intelligence layer classifies the transaction.
7. The transaction is added to the in-memory hot cache and persisted to MySQL.
8. Socket.IO broadcasts the transaction and any generated signal to the React client.
9. A `newHeads` subscription fetches full blocks and updates pending transaction lifecycle status to `INCLUDED`.
10. Pending transactions that exceed the configured TTL are marked `DROPPED`.

## Backend layers

- `blockchain/` — JSON-RPC connectivity
- `dex/` — router map and calldata decoding
- `mev/` — normalization and heuristic intelligence
- `store/` — hot in-memory cache
- `services/` — analytics
- `routes/` — REST API
- `demo/` — synthetic stream for portfolio demonstration
- `db.js` — MySQL persistence

## Frontend pages

- Overview
- Live Mempool
- MEV Signals
- Analytics
- Search

## Production evolution

For a larger real-world deployment, move the hot stream to Redis Streams/Kafka, use ClickHouse for large-scale analytics, add ABI registries and token metadata workers, expose Prometheus/OpenTelemetry metrics, and add authentication/authorization.
