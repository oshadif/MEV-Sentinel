export const toBigInt = (v) => {
  try { return v ? BigInt(v) : 0n; } catch { return 0n; }
};
export const weiToEth = (v) => Number(toBigInt(v)) / 1e18;
export const weiToGwei = (v) => Number(toBigInt(v)) / 1e9;
export const hexToNumber = (v) => Number(toBigInt(v));
export const selectorOf = (input) => input && input.length >= 10 ? input.slice(0, 10).toLowerCase() : "0x";
