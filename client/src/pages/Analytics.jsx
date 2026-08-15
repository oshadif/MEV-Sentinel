import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Header, Panel } from "../components/UI.jsx";

export default function Analytics({ feed }) {
  const protocols = useMemo(() => {
    const c={}; feed.transactions.forEach(x=>c[x.protocol]=(c[x.protocol]||0)+1);
    return Object.entries(c).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  }, [feed.transactions]);

  const classes = useMemo(() => {
    const c={}; feed.transactions.forEach(x=>c[x.classification]=(c[x.classification]||0)+1);
    return Object.entries(c).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  }, [feed.transactions]);

  const gas = feed.transactions.slice(0,120).reverse().map(x=>({t:new Date(x.timestamp).toLocaleTimeString(),gas:Number(x.maxFeeGwei||x.gasPriceGwei||0)}));

  return <>
    <Header title="Analytics" subtitle="Protocol, classification, and fee distribution across the observed stream" />
    <div className="two-col">
      <Panel title="Transactions by protocol">
        <ResponsiveContainer width="100%" height={310}><BarChart data={protocols}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value"/></BarChart></ResponsiveContainer>
      </Panel>
      <Panel title="Transactions by classification">
        <ResponsiveContainer width="100%" height={310}><BarChart data={classes}><XAxis dataKey="name" hide/><YAxis/><Tooltip/><Bar dataKey="value"/></BarChart></ResponsiveContainer>
      </Panel>
    </div>
    <Panel title="Gas timeline">
      <ResponsiveContainer width="100%" height={330}><LineChart data={gas}><XAxis dataKey="t" hide/><YAxis/><Tooltip/><Line type="monotone" dataKey="gas" dot={false}/></LineChart></ResponsiveContainer>
    </Panel>
  </>;
}
