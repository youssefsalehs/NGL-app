import { AppError } from "../../pkg/error/error.js";
import { cacheProvider } from "../cache/init.js";
export const idempotency = (ttl = 3600) => {
  return async (req, res, next) => {
    const idempotencyKey = req.headers["idempotency-key"];
    if (!idempotencyKey) {
      return next(new AppError("Idempotency key is required", 400));
    }
    const key = `${req.method}:${req.originalUrl}:${idempotencyKey}`;
    const cached = await cacheProvider.get(key);

    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        res.setHeader("X-Cache", "MISS");
        await cacheProvider.set(key, JSON.stringify(body), ttl);
      }
      return originalJson(body);
    };
    next();
  };
};
