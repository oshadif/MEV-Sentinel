import WebSocket from "ws";
import { logger } from "../utils/logger.js";

export class EthereumWsRpc {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
    this.handlers = new Map();
    this.reconnectTimer = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.once("open", () => {
        logger.info("Ethereum WebSocket connected");
        resolve();
      });

      this.ws.once("error", reject);

      this.ws.on("message", (raw) => this.onMessage(raw));
      this.ws.on("close", () => this.scheduleReconnect());
      this.ws.on("error", (e) => logger.error("Ethereum WS error", { error: e.message }));
    });
  }

  scheduleReconnect() {
    logger.warn("Ethereum WebSocket closed; reconnecting");
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect();
        for (const [kind, handler] of this.handlers) await this.subscribe(kind, handler, true);
      } catch {}
    }, 5000);
  }

  onMessage(raw) {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.id && this.pending.has(msg.id)) {
      const item = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      return msg.error ? item.reject(new Error(msg.error.message || "RPC error")) : item.resolve(msg.result);
    }

    if (msg.method === "eth_subscription") {
      const sub = msg.params?.subscription;
      const handler = this.handlers.get(sub);
      if (handler) handler(msg.params?.result);
    }
  }

  request(method, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return reject(new Error("WebSocket not open"));
      const id = this.id++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`RPC timeout: ${method}`));
        }
      }, 12000);
    });
  }

  async subscribe(kind, handler, reconnect = false) {
    const subId = await this.request("eth_subscribe", [kind]);
    this.handlers.set(subId, handler);
    if (!reconnect) this.handlers.set(kind, handler);
    logger.info("Ethereum subscription active", { kind, subId });
    return subId;
  }

  async getTransaction(hash) {
    return this.request("eth_getTransactionByHash", [hash]);
  }

  async getBlockByHash(hash, full = true) {
    return this.request("eth_getBlockByHash", [hash, full]);
  }
}
