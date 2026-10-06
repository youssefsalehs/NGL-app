import { RedisCacheProvider } from "../../pkg/cache/redis";

export const cacheProvider = new RedisCacheProvider({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || "",
});
