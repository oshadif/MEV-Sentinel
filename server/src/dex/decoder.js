import { Interface } from "ethers";
import { selectorOf } from "../utils/hex.js";

const V2 = new Interface([
  "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] path,address to,uint deadline)",
  "function swapTokensForExactTokens(uint amountOut,uint amountInMax,address[] path,address to,uint deadline)",
  "function swapExactETHForTokens(uint amountOutMin,address[] path,address to,uint deadline)",
  "function swapExactTokensForETH(uint amountIn,uint amountOutMin,address[] path,address to,uint deadline)"
]);

const V3 = new Interface([
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params)",
  "function exactOutputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountOut,uint256 amountInMaximum,uint160 sqrtPriceLimitX96) params)"
]);

function safeString(v) {
  try { return v == null ? null : v.toString(); } catch { return null; }
}

export function decodeDexInput(input, family) {
  if (!input || input === "0x") return base(input);

  try {
    if (family === "v2") {
      const parsed = V2.parseTransaction({ data: input });
      const args = parsed.args;
      const path = args.path || args[2] || args[1] || [];
      const arr = Array.isArray(path) ? path : Array.from(path || []);
      return {
        selector: selectorOf(input),
        methodName: parsed.name,
        tokenIn: arr[0] || null,
        tokenOut: arr.length ? arr[arr.length - 1] : null,
        amountInRaw: safeString(args.amountIn ?? args[0]),
        amountOutMinRaw: safeString(args.amountOutMin ?? args[1]),
        path: arr
      };
    }

    if (family === "v3") {
      const parsed = V3.parseTransaction({ data: input });
      const p = parsed.args?.params ?? parsed.args?.[0];
      return {
        selector: selectorOf(input),
        methodName: parsed.name,
        tokenIn: p?.tokenIn || null,
        tokenOut: p?.tokenOut || null,
        amountInRaw: safeString(p?.amountIn ?? p?.amountInMaximum),
        amountOutMinRaw: safeString(p?.amountOutMinimum ?? p?.amountOut),
        path: [p?.tokenIn, p?.tokenOut].filter(Boolean)
      };
    }
  } catch {}

  return base(input);
}

function base(input) {
  return {
    selector: selectorOf(input),
    methodName: null,
    tokenIn: null,
    tokenOut: null,
    amountInRaw: null,
    amountOutMinRaw: null,
    path: []
  };
}
