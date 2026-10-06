import { AppError } from "../../pkg/error/error.js";
import { cacheProvider } from "../cache/init.js";

export function idempotency(ttl = 3600) {
  return async (req, res, next) => {
    const idempotency = req.headers["idempotency-key"];
    if (!idempotency) {
      return next(new AppError("Idempotency key is required", 400));
    }
    let key = `${req.method}:${req.originalUrl}:${idempotency}`;
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
      if (res.statusCode >= 200 && res.statusCode < 300) {
        res.setHeader("X-Cache", "MISS");
        cacheProvider
          .set(key, body, ttl)
          .catch((err) => console.error("Cache write failed:", err));
      }
      return originalJson(body);
    };

    next();
  };
}
