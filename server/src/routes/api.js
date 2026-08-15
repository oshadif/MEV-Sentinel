import { Router } from "express";
import { pingDb } from "../db.js";
import { protocolAnalytics, classificationAnalytics, gasAnalytics } from "../services/analytics.js";

export function buildApi({ store, mode }) {
  const r = Router();

  r.get("/health", async (_, res) => {
    let database = false;
    try { database = await pingDb(); } catch {}
    res.json({ ok: true, mode, database, time: new Date().toISOString() });
  });

  r.get("/stats", (_, res) => res.json(store.stats));
  r.get("/transactions", (req, res) => res.json(store.queryTransactions(req.query)));
  r.get("/transactions/:hash", (req, res) => {
    const tx = store.byHash.get(req.params.hash);
    tx ? res.json(tx) : res.status(404).json({ error: "Transaction not found in current cache" });
  });
  r.get("/signals", (req, res) => {
    let rows = store.signals;
    if (req.query.type) rows = rows.filter(x => x.type === req.query.type);
    const limit = Math.min(Number(req.query.limit || 100), 500);
    res.json(rows.slice(0, limit));
  });
  r.get("/blocks", (req, res) => res.json(store.blocks.slice(0, Math.min(Number(req.query.limit || 50), 100))));
  r.get("/analytics/protocols", (_, res) => res.json(protocolAnalytics(store.transactions)));
  r.get("/analytics/classifications", (_, res) => res.json(classificationAnalytics(store.transactions)));
  r.get("/analytics/gas", (_, res) => res.json(gasAnalytics(store.transactions, 150)));

  return r;
}
