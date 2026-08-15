CREATE DATABASE IF NOT EXISTS mev_sentinel;
USE mev_sentinel;

CREATE TABLE IF NOT EXISTS blocks (
  number BIGINT UNSIGNED PRIMARY KEY,
  hash VARCHAR(66),
  parent_hash VARCHAR(66),
  base_fee_gwei DECIMAL(24,9) DEFAULT 0,
  gas_used BIGINT UNSIGNED DEFAULT 0,
  gas_limit BIGINT UNSIGNED DEFAULT 0,
  tx_count INT DEFAULT 0,
  block_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  hash VARCHAR(66) PRIMARY KEY,
  from_address VARCHAR(42),
  to_address VARCHAR(42),
  value_eth DECIMAL(36,18) DEFAULT 0,
  gas_limit BIGINT UNSIGNED DEFAULT 0,
  gas_price_gwei DECIMAL(24,9) DEFAULT 0,
  max_fee_gwei DECIMAL(24,9) DEFAULT 0,
  priority_fee_gwei DECIMAL(24,9) DEFAULT 0,
  nonce BIGINT UNSIGNED DEFAULT 0,
  selector VARCHAR(10),
  protocol VARCHAR(64) DEFAULT 'Unknown',
  method_name VARCHAR(128),
  token_in VARCHAR(42),
  token_out VARCHAR(42),
  amount_in_raw VARCHAR(90),
  amount_out_min_raw VARCHAR(90),
  classification VARCHAR(64) DEFAULT 'NORMAL',
  confidence INT DEFAULT 0,
  reason VARCHAR(255),
  status VARCHAR(32) DEFAULT 'PENDING',
  included_block BIGINT UNSIGNED NULL,
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  included_at TIMESTAMP NULL,
  INDEX idx_first_seen (first_seen),
  INDEX idx_protocol (protocol),
  INDEX idx_classification (classification),
  INDEX idx_from (from_address),
  INDEX idx_to (to_address),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS mev_signals (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tx_hash VARCHAR(66),
  signal_type VARCHAR(64) NOT NULL,
  confidence INT DEFAULT 0,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_signal_created_at (created_at),
  INDEX idx_signal_type (signal_type)
);

CREATE TABLE IF NOT EXISTS token_metadata (
  address VARCHAR(42) PRIMARY KEY,
  symbol VARCHAR(32),
  name VARCHAR(128),
  decimals INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
