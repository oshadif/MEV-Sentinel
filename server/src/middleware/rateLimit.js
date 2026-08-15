const buckets = new Map();

export function rateLimit({ windowMs = 10000, max = 250 } = {}) {
  return (req, res, next) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const bucket = buckets.get(key) || { start: now, count: 0 };

    if (now - bucket.start > windowMs) {
      bucket.start = now;
      bucket.count = 0;
    }

    bucket.count++;
    buckets.set(key, bucket);

    if (bucket.count > max) return res.status(429).json({ error: "Rate limit exceeded" });
    next();
  };
}
