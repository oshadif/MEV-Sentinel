import React from "react";
import { NavLink } from "react-router-dom";

export function Layout({ children, health, connected }) {
  const links = [
    ["/", "Overview"],
    ["/mempool", "Live Mempool"],
    ["/signals", "MEV Signals"],
    ["/analytics", "Analytics"],
    ["/search", "Search"]
  ];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">◈</div>
        <div><strong>MEV SENTINEL</strong><span>Ethereum Intelligence</span></div>
      </div>
      <nav>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}
      </nav>
      <div className="network-card">
        <div><i className={connected ? "dot ok" : "dot"}></i>{connected ? "Socket connected" : "Socket offline"}</div>
        <small>{health?.mode === "demo" ? "Demo stream" : "Ethereum RPC stream"}</small>
        <small>DB: {health?.database ? "connected" : "not confirmed"}</small>
      </div>
    </aside>
    <main className="content">{children}</main>
  </div>;
}
