import dotenv from "dotenv";
dotenv.config();

const num = (v, d) => Number(v ?? d);

export const config = {
  port: num(process.env.PORT, 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  demoMode: String(process.env.DEMO_MODE || "true").toLowerCase() === "true",
  ethWsUrl: process.env.ETH_WS_URL || "",
  ethHttpUrl: process.env.ETH_HTTP_URL || "",
  whaleEth: num(process.env.WHALE_ETH_THRESHOLD, 10),
  highGasGwei: num(process.env.HIGH_GAS_GWEI_THRESHOLD, 20),
  veryHighGasGwei: num(process.env.VERY_HIGH_GAS_GWEI_THRESHOLD, 50),
  pendingTtlSeconds: num(process.env.PENDING_TTL_SECONDS, 180),
  maxMemoryTransactions: num(process.env.MAX_MEMORY_TRANSACTIONS, 1500),
  maxMemorySignals: num(process.env.MAX_MEMORY_SIGNALS, 500),
  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: num(process.env.MYSQL_PORT, 3306),
    database: process.env.MYSQL_DATABASE || "mev_sentinel",
    user: process.env.MYSQL_USER || "mev",
    password: process.env.MYSQL_PASSWORD || "mev_password"
  }
};
