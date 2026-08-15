export const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getJson(path) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export function shortHash(s = "") {
  return s.length > 18 ? `${s.slice(0, 10)}…${s.slice(-6)}` : s;
}
