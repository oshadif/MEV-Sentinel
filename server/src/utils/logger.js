export function log(level, message, meta = {}) {
  const payload = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  console.log(JSON.stringify(payload));
}
export const logger = {
  info: (m, x) => log("info", m, x),
  warn: (m, x) => log("warn", m, x),
  error: (m, x) => log("error", m, x)
};
