import Redis from "ioredis";

export class RedisCacheProvider {
  client;
  constructor(config) {
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      lazyConnect: true,
      maxLoadingRetryTime: 3,
    });
    this.client.on("error", (err) =>
      console.log("redis server error", err.message),
    );
    this.client
      .connect()
      .catch((error) =>
        console.log("failed to log to redis server", error.message),
      );
  }
  async set(key, value, ttl) {
    this.client.set(key, value, "EX", ttl);
  }
  async get(key) {
    this.client.get(key);
  }
  async delete(key) {
    this.client.del(key);
  }
}
