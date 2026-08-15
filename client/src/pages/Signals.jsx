import React, { useMemo, useState } from "react";
import { Header, Panel, Badge } from "../components/UI.jsx";
import { shortHash } from "../lib/api.js";

export default function Signals({ feed }) {
  const [type, setType] = useState("");
  const types = [...new Set(feed.signals.map(x => x.type))];
  const rows = useMemo(() => type ? feed.signals.filter(x => x.type === type) : feed.signals, [feed.signals, type]);

  return <>
    <Header title="MEV Signals" subtitle="Heuristic transaction intelligence — detection only, no execution" />
    <Panel title="Signal filter">
      <select value={type} onChange={e=>setType(e.target.value)}><option value="">All signal types</option>{types.map(x=><option key={x}>{x}</option>)}</select>
    </Panel>
    <Panel title="Signals" right={`${rows.length} cached`}>
      <div className="signal-cards">
        {rows.map((s,i)=><article key={`${s.txHash}-${i}`}>
          <div><Badge value={s.type}/><b>{s.confidence}% confidence</b></div>
          <p>{s.reason}</p>
          <small className="mono">{shortHash(s.txHash)}</small>
          <time>{new Date(s.createdAt).toLocaleString()}</time>
        </article>)}
      </div>
    </Panel>
  </>;
}
