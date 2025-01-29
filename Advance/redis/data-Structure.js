const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listner

client.on("error", (error) => {
  console.log("Redis client error", error);
});

async function redisDataStructure() {
  try {
    await client.connect();

    //1. Simple set get del inc dec

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

    //2. mSet mGet for string

    await client.mSet([
      "user:email",
      "aqib@gmail.com",
      "user:age",
      "50",
      "user:gender",
      "Male",
    ]);
    const [email, age] = await client.mGet(["user:email", "user:age"]);
    console.log(email);
    console.log(age);

    //3. List
    //  Lpush,Rpush,LRange,Lpop,Rpop

    await client.lPush("notes",['note1','note2','note3']);
    console.log("List",await client.lRange("notes",0,-1));
    console.log("pop element",await client.lPop("notes"));
    console.log("remaning element",await client.lRange("notes",0,-1));

    //4. set
    //sAdd sMembers sIsMember sRem

    await client.sAdd("userName", ["aqib", "faizan", "umar"]);
    console.log(await client.sMembers("userName"));
    console.log(await client.sIsMember("userName", "aqib"));
    console.log(await client.sRem("userName", "faizan"));
    console.log(await client.sMembers("userName"));

    //5. sorted set


    //6. hashes




  } catch (error) {
    console.error("error", error);
  } finally {
    await client.quit();
  }
}

redisDataStructure();
