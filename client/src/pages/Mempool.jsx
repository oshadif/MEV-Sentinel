import React, { useMemo, useState } from "react";
import { Header, Panel, TxTable } from "../components/UI.jsx";

export default function Mempool({ feed }) {
  const [protocol, setProtocol] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");

  const rows = useMemo(() => feed.transactions.filter(tx => {
    if (protocol && tx.protocol !== protocol) return false;
    if (status && tx.status !== status) return false;
    if (q && ![tx.hash, tx.from, tx.to, tx.protocol, tx.methodName, tx.classification].some(v => String(v||"").toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [feed.transactions, protocol, status, q]);

  const protocols = [...new Set(feed.transactions.map(x => x.protocol))];

  return <>
    <Header title="Live Mempool" subtitle="Inspect, filter, and monitor pending transaction activity" />
    <Panel title="Filters">
      <div className="filters">
        <input placeholder="Hash, address, method, signal..." value={q} onChange={e=>setQ(e.target.value)} />
        <select value={protocol} onChange={e=>setProtocol(e.target.value)}><option value="">All protocols</option>{protocols.map(x=><option key={x}>{x}</option>)}</select>
        <select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option>PENDING</option><option>INCLUDED</option><option>DROPPED</option></select>
      </div>
    </Panel>
    <Panel title="Transactions" right={`${rows.length} results`}><TxTable rows={rows.slice(0,150)} /></Panel>
  </>;
}
