import test from "node:test";
import assert from "node:assert/strict";
import { decodeDexInput } from "../src/dex/decoder.js";

test("unknown input returns base decode", () => {
  const x = decodeDexInput("0x12345678", "unknown");
  assert.equal(x.selector, "0x12345678");
  assert.equal(x.methodName, null);
});
