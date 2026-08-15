import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie } from "recharts";
import { Header, StatCard, Panel, TxTable } from "../components/UI.jsx";

export default function Overview({ feed }) {
  const { transactions, signals, stats, blocks } = feed;

  const gasSeries = useMemo(() => transactions.slice(0, 80).reverse().map(tx => ({
    t: new Date(tx.timestamp).toLocaleTimeString(),
    gas: Number(tx.maxFeeGwei || tx.gasPriceGwei || 0)
  })), [transactions]);

  const protocolData = useMemo(() => {
    const c = {};
    transactions.forEach(tx => c[tx.protocol] = (c[tx.protocol] || 0) + 1);
    return Object.entries(c).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value);
  }, [transactions]);

  return <>
    <Header title="Network Overview" subtitle="Real-time Ethereum mempool intelligence and MEV signal monitoring"
      right={<div className="live-pill">● LIVE</div>} />
    <div className="stats-grid">
      <StatCard label="Observed TX" value={stats.total.toLocaleString()} note="since service start" />
      <StatCard label="DEX Transactions" value={stats.dex.toLocaleString()} note="recognized routers" />
      <StatCard label="MEV Signals" value={stats.mevSignals.toLocaleString()} note="heuristic alerts" />
      <StatCard label="Average Gas" value={`${Number(stats.avgGas || 0).toFixed(2)} Gwei`} note={`block ${stats.latestBlock || "—"}`} />
    </div>

    <div className="two-col">
      <Panel title="Gas Intelligence" right="recent transactions">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={gasSeries}><XAxis dataKey="t" hide/><YAxis width={42}/><Tooltip/><Line type="monotone" dataKey="gas" dot={false}/></LineChart>
        </ResponsiveContainer>
      </Panel>
      <Panel title="Protocol Distribution" right={`${transactions.length} cached`}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart><Pie data={protocolData.slice(0,6)} dataKey="value" nameKey="name" outerRadius={88} label /></PieChart>
        </ResponsiveContainer>
      </Panel>
    </div>

    <Panel title="Live Mempool" right={`${transactions.length} cached`}><TxTable rows={transactions.slice(0,18)} /></Panel>

    <div className="two-col">
      <Panel title="Recent Intelligence Signals">
        <div className="signal-list">
          {signals.slice(0,8).map((s,i)=><div className="signal-row" key={`${s.txHash}-${i}`}><b>{s.type}</b><span>{s.reason}</span><strong>{s.confidence}%</strong></div>)}
        </div>
      </Panel>
      <Panel title="Recent Blocks">
        <div className="block-list">
          {blocks.slice(0,8).map(b=><div key={b.number}><b>#{b.number}</b><span>{b.txCount} tx</span><span>{Number(b.baseFeeGwei||0).toFixed(2)} Gwei base</span></div>)}
        </div>
      </Panel>
    </div>
  </>;
}
