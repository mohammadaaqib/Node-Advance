require("dotenv").config();
const express = require("express");
const logger = require("./utils/logger");
const helmet = require("helmet");
const cors = require("cors");
const redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const errorHandler=require("./middleware/errorHandler");
const {validateUser}= require('./middleware/authMiddleware');

const proxy = require("express-http-proxy");

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = new redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());
// limit request in 100 mint
const rateLimitOptions = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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
app.use(rateLimitOptions);

//Log request and body
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

//this will replace v1 to api;
const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error:${err.message}`);
   return res.status(500).json({
      message: `Internal server error`,
      error: err.message,
    });
    next()
  }
};

//setting up proxy for our identity service
app.use('/v1/auth',proxy(process.env.IDENTITY_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        // you can change the method
       // proxyReqOpts.method = 'GET';
        return proxyReqOpts;
      },
      //You can modify the proxy's response before sending it to the client
      userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      logger.info(`Response reived from Identity service:${proxyRes.statusCode}`);

        return proxyResData;
      }
}));

//setting up proxy for our post service
app.use('/v1/post',validateUser,proxy(process.env.POST_SERVICE_URL,{
  ...proxyOptions,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
      // you can change the method
     // proxyReqOpts.method = 'GET';
      return proxyReqOpts;
    },
    //You can modify the proxy's response before sending it to the client
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    logger.info(`Response reived from post service:${proxyRes.statusCode}`);

      return proxyResData;
    }
}));

//setting up proxy for our media service
app.use('/v1/media',validateUser,proxy(process.env.MEDIA_SERVICE_URL,{
  ...proxyOptions,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
      console.log(srcReq.headers['content-type']);
      
//       if(!srcReq.headers['content-type'].startsWith('multipart/form-data')){
// console.log("in error")
//         proxyReqOpts.headers['Content-Type'] = 'application/json';
//       }
      // you can change the method
     // proxyReqOpts.method = 'GET';
      return proxyReqOpts;
    },
    //You can modify the proxy's response before sending it to the client
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    logger.info(`Response reived from media service:${proxyRes.statusCode}`);

      return proxyResData;
    },
    parseReqBody: false,
}));


//setting up proxy for our search service
app.use('/v1/search',validateUser,proxy(process.env.SEARCH_SERVICE_URL,{
  ...proxyOptions,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      // you can update headers
      proxyReqOpts.headers['Content-Type'] = 'application/json';
      proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
      // you can change the method
     // proxyReqOpts.method = 'GET';
      return proxyReqOpts;
    },
    //You can modify the proxy's response before sending it to the client
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    logger.info(`Response reived from search service:${proxyRes.statusCode}`);

      return proxyResData;
    }
}));

app.use(errorHandler);

app.listen(PORT,()=>{
    logger.info(`API Gateway is running on port ${PORT}`)
    logger.info(`Indentity service is running on port ${process.env.IDENTITY_SERVICE_URL}`)
    logger.info(`Post service is running on port ${process.env.POST_SERVICE_URL}`)
    logger.info(`Media service is running on port ${process.env.MEDIA_SERVICE_URL}`)
    logger.info(`Search service is running on port ${process.env.SEARCH_SERVICE_URL}`)
    logger.info(`Redis is running on port ${process.env.REDIS_URL}`)
})

process.on("unhandledRejeciton", (reason, promise) => {
  logger.error("unhandledRejeciton at ", promise, "reason", reason);
});
