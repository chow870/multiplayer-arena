import Redis from "ioredis";

// if (!process.env.REDIS_URL) {
//   throw new Error("REDIS_URL environment variable is not set");
// }
const redis = new Redis("rediss://red-d1lvc6p5pdvs73cgud7g:9yntYkJRs5gSMmEvd807pCYo7DoVq7kn@singapore-keyvalue.render.com:6379", {
  retryStrategy() {
    return Math.min(10*50, 2000);
  }
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
  // process.exit(1); // Optionally fail fast
});

redis.on("connect",()=>{
  console.log("connected to the redis cloud");
})

export default redis;
