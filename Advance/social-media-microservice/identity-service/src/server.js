require("dotenv").config();
const express = require("express");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

const routes = require("./routes/identity-service");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3001;
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

//ddos protection
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, //how many hit
  duration: 1, //in one sec
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      logger.warn("Rate limit exceeded for IP:", req.ip);
      res.status(429).json({
        success: false,
        message: "Too many request",
      });
    });
});

//Ip  base rate limitting for sensitive endpoints

const sensitiveEndpointsLimitting = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeader: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP:${req.ip}`);
    res.status(429).json({ success: false, message: "Too many request" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

app.use("/api/auth/register", sensitiveEndpointsLimitting);

app.use("/api/auth", routes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`identity service running on port ${PORT}`);
});

process.on("unhandledRejeciton", (reason, promise) => {
  logger.error("unhandledRejeciton at ", promise, "reason", reason);
});
