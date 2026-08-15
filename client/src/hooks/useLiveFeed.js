import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API, getJson } from "../lib/api.js";

export function useLiveFeed() {
  const [transactions, setTransactions] = useState([]);
  const [signals, setSignals] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState({ total: 0, dex: 0, mevSignals: 0, included: 0, dropped: 0, avgGas: 0, latestBlock: null });
  const [health, setHealth] = useState({ mode: "connecting", database: false });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      getJson("/api/transactions?limit=150"),
      getJson("/api/signals?limit=100"),
      getJson("/api/blocks?limit=50"),
      getJson("/api/stats"),
      getJson("/api/health")
    ]).then(([t,s,b,st,h]) => {
      if (t.status === "fulfilled") setTransactions(t.value);
      if (s.status === "fulfilled") setSignals(s.value);
      if (b.status === "fulfilled") setBlocks(b.value);
      if (st.status === "fulfilled") setStats(st.value);
      if (h.status === "fulfilled") setHealth(h.value);
    });

    const socket = io(API);
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("new_transaction", tx => setTransactions(v => [tx, ...v].slice(0, 300)));
    socket.on("mev_signal", x => setSignals(v => [x, ...v].slice(0, 200)));
    socket.on("new_block", x => setBlocks(v => [x, ...v].slice(0, 100)));
    socket.on("stats", setStats);
    socket.on("tx_status", ({ hash, status, blockNumber }) => {
      setTransactions(v => v.map(tx => tx.hash === hash ? { ...tx, status, includedBlock: blockNumber ?? tx.includedBlock } : tx));
    });

    return () => socket.close();
  }, []);

  return { transactions, signals, blocks, stats, health, connected };
}
