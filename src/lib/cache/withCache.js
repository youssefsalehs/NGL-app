import { cacheProvider } from "./init.js";

export function withCache(ttl = 3600) {
  return async (req, res, next) => {
    const key = `${req.method}:${req.originalUrl}`;

    try {
      const cached = await cacheProvider.get(key);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.json(cached);
      }
    } catch (err) {
      console.error("Cache read failed:", err);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      res.setHeader("X-Cache", "MISS");
      cacheProvider
        .set(key, body, ttl)
        .catch((err) => console.error("Cache write failed:", err));
      return originalJson(body);
    };

    next();
  };
}
