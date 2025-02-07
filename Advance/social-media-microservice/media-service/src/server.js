require("dotenv").config();
const express = require("express");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const mediaRoutes = require("./routes/media-routes");
const errorHandler = require("./middleware/errorHandler");
const {connectRabbitMQ,consumeEvent}= require('./utils/rabbitmq');
const{handlePostDeleted}=require('./eventHandler/mediaEventHandlers');

const PORT = process.env.PORT || 3003;
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

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

app.use("/api/media", mediaRoutes);
app.use(errorHandler);
async function startServer() {

  try {
    await connectRabbitMQ();
    await consumeEvent('post.delete',handlePostDeleted)
    app.listen(PORT, () => {
      logger.info(`Media service running on port ${PORT}`);
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
