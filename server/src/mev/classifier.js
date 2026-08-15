import { config } from "../config.js";

export function classify(tx) {
  const gas = Math.max(tx.gasPriceGwei || 0, tx.maxFeeGwei || 0);
  const dex = tx.protocol !== "Unknown";

  if (tx.valueEth >= config.whaleEth) {
    return { classification: "WHALE", confidence: 95, reason: `Native value >= ${config.whaleEth} ETH` };
  }

  if (dex && gas >= config.veryHighGasGwei) {
    return { classification: "MEV_PRIORITY_SIGNAL", confidence: 88, reason: `DEX transaction with unusually high fee >= ${config.veryHighGasGwei} Gwei` };
  }

  if (dex && gas >= config.highGasGwei) {
    return { classification: "HIGH_PRIORITY_DEX", confidence: 80, reason: `Recognized DEX transaction with fee >= ${config.highGasGwei} Gwei` };
  }

  if (dex && tx.methodName) {
    return { classification: "DEX_SWAP", confidence: 76, reason: `Decoded ${tx.protocol} method ${tx.methodName}` };
  }

  if (dex) {
    return { classification: "DEX_ACTIVITY", confidence: 68, reason: `Transaction targets a recognized ${tx.protocol} router` };
  }

  if (gas >= config.veryHighGasGwei) {
    return { classification: "HIGH_GAS", confidence: 66, reason: "Unusually high transaction fee" };
  }

  return { classification: "NORMAL", confidence: 30, reason: "No elevated heuristic signal" };
}
