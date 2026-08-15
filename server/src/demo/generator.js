const protocols = [
  ["Uniswap V3", "exactInputSingle"],
  ["Uniswap V2", "swapExactTokensForTokens"],
  ["1inch", null],
  ["SushiSwap", "swapExactTokensForTokens"],
  ["Unknown", null]
];

const classes = ["DEX_SWAP", "NORMAL", "WHALE", "HIGH_GAS", "HIGH_PRIORITY_DEX", "MEV_PRIORITY_SIGNAL"];
const randomHex = (n) => "0x" + Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");

export function demoTransaction() {
  const [protocol, methodName] = protocols[Math.floor(Math.random() * protocols.length)];
  const classification = classes[Math.floor(Math.random() * classes.length)];
  const whale = classification === "WHALE";
  const gas = +(1 + Math.random() * (classification.includes("HIGH") || classification.includes("MEV") ? 100 : 20)).toFixed(2);
  return {
    hash: randomHex(64),
    from: randomHex(40),
    to: randomHex(40),
    valueEth: +(Math.random() * (whale ? 80 : 7)).toFixed(5),
    gasLimit: 21000 + Math.floor(Math.random() * 350000),
    gasPriceGwei: gas,
    maxFeeGwei: gas,
    priorityFeeGwei: +(Math.random() * 5).toFixed(2),
    nonce: Math.floor(Math.random() * 5000),
    selector: randomHex(4),
    protocol,
    family: protocol.includes("V3") ? "v3" : protocol === "Unknown" ? "unknown" : "v2",
    methodName,
    tokenIn: protocol === "Unknown" ? null : randomHex(40),
    tokenOut: protocol === "Unknown" ? null : randomHex(40),
    amountInRaw: protocol === "Unknown" ? null : String(Math.floor(Math.random() * 1e12)),
    amountOutMinRaw: null,
    path: [],
    classification,
    confidence: classification === "NORMAL" ? 30 : 68 + Math.floor(Math.random() * 29),
    reason: "Demo-mode intelligence signal",
    status: "PENDING",
    timestamp: new Date().toISOString()
  };
}

export function demoBlock(number) {
  return {
    number,
    hash: randomHex(64),
    parentHash: randomHex(64),
    baseFeeGwei: +(1 + Math.random() * 20).toFixed(2),
    gasUsed: 15000000 + Math.floor(Math.random() * 10000000),
    gasLimit: 30000000,
    txCount: 120 + Math.floor(Math.random() * 250),
    timestamp: Math.floor(Date.now() / 1000)
  };
}
