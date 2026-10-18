import Redis from "ioredis";
export default class RedisCacheProvider {
  client;
  constructor(config) {
    this.client = new Redis(config.url);
    this.client
      .connect()
      .catch((err) => console.log("connection failed", err.message));
    this.client.on("error", (err) => {
      console.log("Redis error", err);
    });
  }
  set(key, value, ttl) {
    return this.client.set(key, value, "EX", ttl);
  }
  get(key) {
    return this.client.get(key);
  }
  del(...keys) {
    return this.client.del(...keys);
  }

  // sAdd(key, value) {
  //   return this.client.sadd(key, value);
  // }

  // sRem(key, value) {
  //   return this.client.srem(key, value);
  // }

  // sMembers(key) {
  //   return this.client.smembers(key);
  // }

  // expire(key, ttl) {
  //   return this.client.expire(key, ttl);
  // }
}
