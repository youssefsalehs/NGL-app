// import Redis from "ioredis";
import { Redis } from "@upstash/redis";
export class RedisCacheProvider {
  client;
  constructor(config) {
    this.client = new Redis({
      url: config.url,
      token: config.token,
    });
  }
  async set(key, value, ttl) {
    await this.client.set(key, value,{ ex: ttl });
  }
  async get(key) {
    return await this.client.get(key);
  }
  async delete(key) {
    return await this.client.del(key);
  }
}
