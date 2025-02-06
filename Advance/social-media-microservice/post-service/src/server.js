require("dotenv").config();
const express = require("express");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const redis = require("ioredis");
const { connectRabbitMQ } = require("./utils/rabbitmq");

const postRoutes = require("./routes/post-routes");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3002;
const app = express();

//connect to db
mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    logger.info("Connected to mongodb");
  })
  .catch((err) => {
    logger.console.error("Mongo connnection error", err);
  });

const redisClient = new redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

app.use(
  "/api/post",
  (req, res, next) => {
    console.log("here");
    req.redisClient = redisClient;
    next();
  },
  postRoutes
);
app.use(errorHandler);

async function startServer() {
  try {
    await connectRabbitMQ();
    app.listen(PORT, () => {
      logger.info(`post service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to server", error);
    process.exit(1);
  }
}

startServer();
process.on("unhandledRejeciton", (reason, promise) => {
  logger.error("unhandledRejeciton at ", promise, "reason", reason);
});
