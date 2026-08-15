export const ROUTERS = {
  "0x7a250d5630b4cf539739df2c5dacab4c659f2488": { protocol: "Uniswap V2", family: "v2" },
  "0xe592427a0aece92de3edee1f18e0157c05861564": { protocol: "Uniswap V3", family: "v3" },
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": { protocol: "Uniswap V3", family: "v3" },
  "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f": { protocol: "SushiSwap", family: "v2" },
  "0x1111111254eeb25477b68fb85ed929f73a960582": { protocol: "1inch", family: "aggregator" },
  "0x111111125421ca6dc452d289314280a0f8842a65": { protocol: "1inch", family: "aggregator" },
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff": { protocol: "0x", family: "aggregator" }
};

export const routerInfo = (address) => ROUTERS[(address || "").toLowerCase()] || { protocol: "Unknown", family: "unknown" };
