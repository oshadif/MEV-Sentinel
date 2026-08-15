import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";
import { MemoryStore } from "./store/memoryStore.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { buildApi } from "./routes/api.js";
import { EthereumWsRpc } from "./blockchain/rpc.js";
import { normalizeTransaction } from "./mev/processor.js";
import { saveTransaction, saveSignal, saveBlock, markIncluded, markDropped } from "./db.js";
import { demoTransaction, demoBlock } from "./demo/generator.js";
import { hexToNumber, weiToGwei } from "./utils/hex.js";

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: "250kb" }));
app.use(rateLimit());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: config.clientOrigin } });
const store = new MemoryStore();
const mode = config.demoMode || !config.ethWsUrl ? "demo" : "ethereum";

app.get("/", (_, res) => res.json({ name: "MEV Sentinel API", version: "2.0.0", mode }));
app.use("/api", buildApi({ store, mode }));

async function ingest(tx, persist = true) {
  if (!tx?.hash || !store.addTransaction(tx)) return;

  if (tx.classification !== "NORMAL") {
    const signal = {
      txHash: tx.hash,
      type: tx.classification,
      confidence: tx.confidence,
      reason: tx.reason,
      createdAt: tx.timestamp
    };
    store.addSignal(signal);
    io.emit("mev_signal", signal);
    if (persist) saveSignal(signal).catch(() => {});
  }

  if (persist) saveTransaction(tx).catch(() => {});
  io.emit("new_transaction", tx);
  io.emit("stats", store.stats);
}

async function processBlock(raw, persist = true) {
  const number = hexToNumber(raw.number);
  const txs = Array.isArray(raw.transactions) ? raw.transactions : [];

  const block = {
    number,
    hash: raw.hash,
    parentHash: raw.parentHash,
    baseFeeGwei: weiToGwei(raw.baseFeePerGas),
    gasUsed: hexToNumber(raw.gasUsed),
    gasLimit: hexToNumber(raw.gasLimit),
    txCount: txs.length,
    timestamp: hexToNumber(raw.timestamp)
  };

  store.addBlock(block);
  io.emit("new_block", block);
  io.emit("stats", store.stats);
  if (persist) saveBlock(block).catch(() => {});

  for (const tx of txs) {
    const hash = typeof tx === "string" ? tx : tx.hash;
    if (hash && store.markIncluded(hash, number)) {
      io.emit("tx_status", { hash, status: "INCLUDED", blockNumber: number });
      if (persist) markIncluded(hash, number).catch(() => {});
    }
  }
}

function sweepDropped(persist = true) {
  const cutoff = Date.now() - config.pendingTtlSeconds * 1000;
  for (const tx of store.transactions) {
    if (tx.status === "PENDING" && new Date(tx.timestamp).getTime() < cutoff) {
      if (store.markDropped(tx.hash)) {
        io.emit("tx_status", { hash: tx.hash, status: "DROPPED" });
        if (persist) markDropped(tx.hash).catch(() => {});
      }
    }
  }
}

async function startLive() {
  const rpc = new EthereumWsRpc(config.ethWsUrl);
  await rpc.connect();

  await rpc.subscribe("newPendingTransactions", async (hash) => {
    try {
      const raw = await rpc.getTransaction(hash);
      if (raw) await ingest(normalizeTransaction(raw), true);
    } catch (e) {
      logger.warn("Pending transaction fetch failed", { error: e.message });
    }
  });

  await rpc.subscribe("newHeads", async (head) => {
    try {
      const rawBlock = await rpc.getBlockByHash(head.hash, true);
      if (rawBlock) await processBlock(rawBlock, true);
    } catch (e) {
      logger.warn("Block fetch failed", { error: e.message });
    }
  });

  setInterval(() => sweepDropped(true), 15000);
}

function startDemo() {
  let blockNumber = 22000000;
  setInterval(() => ingest(demoTransaction(), false), 650);
  setInterval(() => {
    const b = demoBlock(blockNumber++);
    store.addBlock(b);
    io.emit("new_block", b);
    store.stats.latestBlock = b.number;
    const pending = store.transactions.filter(x => x.status === "PENDING").slice(-25);
    for (const tx of pending.slice(0, Math.floor(Math.random() * 8))) {
      if (store.markIncluded(tx.hash, b.number)) {
        io.emit("tx_status", { hash: tx.hash, status: "INCLUDED", blockNumber: b.number });
      }
    }
    io.emit("stats", store.stats);
  }, 12000);
  setInterval(() => sweepDropped(false), 15000);
}

server.listen(config.port, async () => {
  logger.info("MEV Sentinel API started", { port: config.port, mode });
  if (mode === "demo") startDemo();
  else {
    try { await startLive(); }
    catch (e) {
      logger.error("Live mode startup failed", { error: e.message });
    }
  }
});
