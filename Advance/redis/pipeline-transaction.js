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
    //PipeLine
    //this will execute all the command at once
    // let say you need add multiple recorde and excecute multiple query
    const pipeLine = client.multi();

    pipeLine.set("name", "Aqib");
    pipeLine.set("age", "31");
    pipeLine.get("name");
    pipeLine.get("age");

    const result = await pipeLine.exec();
    console.log(result);

    //Transaction
    //when you wana exceute both command same time
    // like banking transaction like from one account to another like both need to be scessufull

    const transaction = client.multi();
    transaction.decrBy("acc:123", 100);
    transaction.incrBy("acc:001", 100);

    //in this case if anyone will fail both will fail
    transaction.exec();

    //
  } catch (error) {
    console.log(error);
  } finally {
    client.quit();
  }
}
testNewFeature();
