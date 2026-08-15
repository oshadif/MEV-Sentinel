import mysql from "mysql2/promise";
import { config } from "./config.js";

export const pool = mysql.createPool({
  ...config.mysql,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true
});

export async function pingDb() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows?.[0]?.ok === 1;
}

export async function saveTransaction(tx) {
  await pool.execute(
    `INSERT INTO transactions
      (hash, from_address, to_address, value_eth, gas_limit, gas_price_gwei,
       max_fee_gwei, priority_fee_gwei, nonce, selector, protocol, method_name,
       token_in, token_out, amount_in_raw, amount_out_min_raw, classification,
       confidence, reason, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       protocol=VALUES(protocol), method_name=VALUES(method_name),
       classification=VALUES(classification), confidence=VALUES(confidence),
       reason=VALUES(reason), status=VALUES(status)`,
    [tx.hash, tx.from, tx.to, tx.valueEth, tx.gasLimit, tx.gasPriceGwei,
     tx.maxFeeGwei, tx.priorityFeeGwei, tx.nonce, tx.selector, tx.protocol,
     tx.methodName, tx.tokenIn, tx.tokenOut, tx.amountInRaw, tx.amountOutMinRaw,
     tx.classification, tx.confidence, tx.reason, tx.status]
  );
}

export async function markIncluded(hash, blockNumber) {
  await pool.execute(
    `UPDATE transactions SET status='INCLUDED', included_block=?, included_at=NOW() WHERE hash=?`,
    [blockNumber, hash]
  );
}

export async function markDropped(hash) {
  await pool.execute(
    `UPDATE transactions SET status='DROPPED' WHERE hash=? AND status='PENDING'`,
    [hash]
  );
}

export async function saveSignal(signal) {
  await pool.execute(
    `INSERT INTO mev_signals (tx_hash, signal_type, confidence, reason)
     VALUES (?, ?, ?, ?)`,
    [signal.txHash, signal.type, signal.confidence, signal.reason]
  );
}

export async function saveBlock(block) {
  await pool.execute(
    `INSERT INTO blocks
     (number, hash, parent_hash, base_fee_gwei, gas_used, gas_limit, tx_count, block_time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE hash=VALUES(hash), tx_count=VALUES(tx_count)`,
    [block.number, block.hash, block.parentHash, block.baseFeeGwei, block.gasUsed,
     block.gasLimit, block.txCount, block.timestamp ? new Date(block.timestamp * 1000) : null]
  );
}
