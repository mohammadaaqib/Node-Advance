// publish --> send--> channel--> subscriber
const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listner

client.on("error", (error) => {
  console.log("Redis client error", error);
});

async function testNewFeature() {
  try {
    await client.connect();

    const subscriber = client.duplicate(); //create new clien , share same client instance
    await subscriber.connect(); //connect redis server to subscrbe
    subscriber.subscribe("dummy", (message, channel) => {
      console.log(`Recive message from ${channel} that is ${message}`);
    });

    client.publish("dummy", "test message"); //publish message to channel

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await subscriber.unsubscribe("dummy");
    subscriber.quit(); //close subscriver connection
    
  } catch (error) {
    console.log(error);
  } finally {
    client.quit();
  }
}
testNewFeature();
