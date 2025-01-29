const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listner

client.on("error", (error) => {
  console.log("Redis client error", error);
});

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("Redis connected successfully");
    client.set("name","Aqib");
    const extractValue=await client.get("name");
    console.log(extractValue);
    const delCount=await client.del("name");
    console.log(delCount);
   console.log(await client.get("name"));
   
   client.set("count","100");
   client.incr("count");

   console.log(await client.get("count"));

   client.decr("count");

    console.log(await client.get("count"));
    
  } catch (error) {
    console.error("Redis connection error", error);
  } finally {
    await client.quit();
  }
}
testRedisConnection();
