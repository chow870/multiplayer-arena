import Redis from "ioredis";

const redis = new Redis({
  host: "localhost",
  port: 6379,
  retryStrategy() {
    return Math.min(10*50, 2000);
  }
});

export default redis;
