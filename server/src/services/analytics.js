export function protocolAnalytics(transactions) {
  const counts = {};
  for (const tx of transactions) counts[tx.protocol] = (counts[tx.protocol] || 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value-a.value);
}

export function classificationAnalytics(transactions) {
  const counts = {};
  for (const tx of transactions) counts[tx.classification] = (counts[tx.classification] || 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value-a.value);
}

export function gasAnalytics(transactions, max = 100) {
  return transactions.slice(0, max).reverse().map(tx => ({
    t: tx.timestamp,
    gas: Number(tx.maxFeeGwei || tx.gasPriceGwei || 0),
    protocol: tx.protocol
  }));
}
