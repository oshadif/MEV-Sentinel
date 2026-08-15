export class EthereumHttpRpc {
  constructor(url) {
    this.url = url;
    this.id = 1;
  }

  async request(method, params = []) {
    if (!this.url) throw new Error("HTTP RPC URL is not configured");
    const response = await fetch(this.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: this.id++, method, params })
    });
    if (!response.ok) throw new Error(`HTTP RPC error ${response.status}`);
    const json = await response.json();
    if (json.error) throw new Error(json.error.message || "RPC error");
    return json.result;
  }
}
