import RedisCacheProvider from "../../pkg/cache/redis.js";
import { env } from "../config/env.js";

export const cacheProvider = new RedisCacheProvider({
  url: env.redis.url,
});
