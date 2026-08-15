import test from "node:test";
import assert from "node:assert/strict";
import { classify } from "../src/mev/classifier.js";

test("classifies decoded DEX swap", () => {
  const x = classify({
    valueEth: 0,
    gasPriceGwei: 1,
    maxFeeGwei: 2,
    protocol: "Uniswap V3",
    methodName: "exactInputSingle"
  });
  assert.equal(x.classification, "DEX_SWAP");
  assert.ok(x.confidence >= 70);
});

test("classifies whale", () => {
  const x = classify({
    valueEth: 100,
    gasPriceGwei: 1,
    maxFeeGwei: 2,
    protocol: "Unknown",
    methodName: null
  });
  assert.equal(x.classification, "WHALE");
});
