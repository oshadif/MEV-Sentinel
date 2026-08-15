# Testing

Backend unit tests:

```bash
cd server
npm install
npm test
```

Manual integration test:

1. Start Docker Compose in demo mode.
2. Open the dashboard.
3. Confirm transaction count increases.
4. Confirm gas chart updates.
5. Confirm signals appear.
6. Confirm block number updates approximately every 12 seconds.
7. Open Live Mempool and test filters.
8. Open Search and query `Uniswap` or `WHALE`.

Live-mode test:

1. Configure a valid Ethereum WebSocket endpoint.
2. Set `DEMO_MODE=false`.
3. Restart the server.
4. Confirm `/api/health` reports `mode: ethereum`.
5. Confirm pending transaction hashes are resolved and blocks are received.
