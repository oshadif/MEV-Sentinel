import { config } from "../config.js";

export class MemoryStore {
  constructor() {
    this.transactions = [];
    this.byHash = new Map();
    this.signals = [];
    this.blocks = [];
    this.stats = {
      total: 0,
      dex: 0,
      mevSignals: 0,
      included: 0,
      dropped: 0,
      avgGas: 0,
      gasTotal: 0,
      latestBlock: null
    };
  }

  addTransaction(tx) {
    if (this.byHash.has(tx.hash)) return false;
    this.transactions.unshift(tx);
    this.byHash.set(tx.hash, tx);
    if (this.transactions.length > config.maxMemoryTransactions) {
      const removed = this.transactions.pop();
      if (removed) this.byHash.delete(removed.hash);
    }

    this.stats.total++;
    const gas = Number(tx.maxFeeGwei || tx.gasPriceGwei || 0);
    this.stats.gasTotal += gas;
    this.stats.avgGas = this.stats.gasTotal / this.stats.total;
    if (tx.protocol !== "Unknown") this.stats.dex++;
    if (tx.classification !== "NORMAL") this.stats.mevSignals++;
    return true;
  }

  addSignal(signal) {
    this.signals.unshift(signal);
    if (this.signals.length > config.maxMemorySignals) this.signals.pop();
  }

  markIncluded(hash, blockNumber) {
    const tx = this.byHash.get(hash);
    if (!tx || tx.status === "INCLUDED") return false;
    tx.status = "INCLUDED";
    tx.includedBlock = blockNumber;
    tx.includedAt = new Date().toISOString();
    this.stats.included++;
    return true;
  }

  markDropped(hash) {
    const tx = this.byHash.get(hash);
    if (!tx || tx.status !== "PENDING") return false;
    tx.status = "DROPPED";
    this.stats.dropped++;
    return true;
  }

  addBlock(block) {
    this.blocks.unshift(block);
    this.blocks = this.blocks.slice(0, 100);
    this.stats.latestBlock = block.number;
  }

  queryTransactions(q) {
    let rows = this.transactions;
    if (q.protocol) rows = rows.filter(x => x.protocol === q.protocol);
    if (q.classification) rows = rows.filter(x => x.classification === q.classification);
    if (q.status) rows = rows.filter(x => x.status === q.status);
    if (q.address) {
      const a = q.address.toLowerCase();
      rows = rows.filter(x => (x.from || "").toLowerCase() === a || (x.to || "").toLowerCase() === a);
    }
    if (q.minValue != null) rows = rows.filter(x => x.valueEth >= Number(q.minValue));
    if (q.search) {
      const s = q.search.toLowerCase();
      rows = rows.filter(x => [x.hash, x.from, x.to, x.protocol, x.methodName, x.classification]
        .some(v => String(v || "").toLowerCase().includes(s)));
    }
    const limit = Math.min(Number(q.limit || 100), 500);
    return rows.slice(0, limit);
  }
}
