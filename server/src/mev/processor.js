import { routerInfo } from "../dex/routers.js";
import { decodeDexInput } from "../dex/decoder.js";
import { classify } from "./classifier.js";
import { hexToNumber, weiToEth, weiToGwei, selectorOf } from "../utils/hex.js";

export function normalizeTransaction(raw) {
  const route = routerInfo(raw.to);
  const decoded = decodeDexInput(raw.input, route.family);

  const tx = {
    hash: raw.hash,
    from: raw.from || null,
    to: raw.to || null,
    valueEth: weiToEth(raw.value),
    gasLimit: hexToNumber(raw.gas),
    gasPriceGwei: weiToGwei(raw.gasPrice),
    maxFeeGwei: weiToGwei(raw.maxFeePerGas),
    priorityFeeGwei: weiToGwei(raw.maxPriorityFeePerGas),
    nonce: hexToNumber(raw.nonce),
    selector: decoded.selector || selectorOf(raw.input),
    protocol: route.protocol,
    family: route.family,
    methodName: decoded.methodName,
    tokenIn: decoded.tokenIn,
    tokenOut: decoded.tokenOut,
    amountInRaw: decoded.amountInRaw,
    amountOutMinRaw: decoded.amountOutMinRaw,
    path: decoded.path,
    status: "PENDING",
    timestamp: new Date().toISOString()
  };

  return { ...tx, ...classify(tx) };
}
