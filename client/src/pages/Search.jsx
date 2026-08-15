import React, { useState } from "react";
import { getJson } from "../lib/api.js";
import { Header, Panel, TxTable } from "../components/UI.jsx";

export default function Search() {
  const [q, setQ] = useState("");
  const [minValue, setMinValue] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function run(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (minValue) params.set("minValue", minValue);
      params.set("limit","200");
      setRows(await getJson(`/api/transactions?${params.toString()}`));
    } finally { setLoading(false); }
  }

  return <>
    <Header title="Search" subtitle="Query the current transaction cache by hash, address, protocol, method, or signal" />
    <Panel title="Transaction search">
      <form className="search-form" onSubmit={run}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. Uniswap, 0xabc..., WHALE" />
        <input value={minValue} onChange={e=>setMinValue(e.target.value)} placeholder="Minimum ETH value" type="number" step="0.01" />
        <button>{loading ? "Searching..." : "Search"}</button>
      </form>
    </Panel>
    <Panel title="Results" right={`${rows.length} matches`}><TxTable rows={rows}/></Panel>
  </>;
}
