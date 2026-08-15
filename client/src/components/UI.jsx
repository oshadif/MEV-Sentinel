import React from "react";
import { shortHash } from "../lib/api.js";

export function Header({ title, subtitle, right }) {
  return <header className="page-header">
    <div><h1>{title}</h1><p>{subtitle}</p></div>
    <div>{right}</div>
  </header>;
}

export function StatCard({ label, value, note }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

export function Badge({ value }) {
  return <span className={`badge badge-${String(value).toLowerCase().replaceAll("_","-")}`}>{value}</span>;
}

export function TxTable({ rows }) {
  return <div className="table-wrap"><table>
    <thead><tr><th>Hash</th><th>Protocol</th><th>Method</th><th>Value</th><th>Gas</th><th>Status</th><th>Signal</th></tr></thead>
    <tbody>
      {rows.map(tx => <tr key={tx.hash}>
        <td className="mono">{shortHash(tx.hash)}</td>
        <td>{tx.protocol}</td>
        <td>{tx.methodName || "—"}</td>
        <td>{Number(tx.valueEth || 0).toFixed(4)} ETH</td>
        <td>{Number(tx.maxFeeGwei || tx.gasPriceGwei || 0).toFixed(2)}</td>
        <td><Badge value={tx.status || "PENDING"} /></td>
        <td><Badge value={tx.classification} /></td>
      </tr>)}
    </tbody>
  </table></div>;
}

export function Panel({ title, right, children }) {
  return <section className="panel">
    <div className="panel-title"><strong>{title}</strong><span>{right}</span></div>
    {children}
  </section>;
}
