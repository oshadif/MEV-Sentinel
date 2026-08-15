import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { useLiveFeed } from "./hooks/useLiveFeed.js";
import Overview from "./pages/Overview.jsx";
import Mempool from "./pages/Mempool.jsx";
import Signals from "./pages/Signals.jsx";
import Analytics from "./pages/Analytics.jsx";
import Search from "./pages/Search.jsx";

export default function App() {
  const feed = useLiveFeed();
  return <Layout health={feed.health} connected={feed.connected}>
    <Routes>
      <Route path="/" element={<Overview feed={feed}/>} />
      <Route path="/mempool" element={<Mempool feed={feed}/>} />
      <Route path="/signals" element={<Signals feed={feed}/>} />
      <Route path="/analytics" element={<Analytics feed={feed}/>} />
      <Route path="/search" element={<Search/>} />
    </Routes>
  </Layout>;
}
