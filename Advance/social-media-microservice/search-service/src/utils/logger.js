const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "PROD" ? "debug" : "info",
  //what will be the format of our log
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  //what is the service
  defaultMeta: { service: "post-service" },
  //where we need to print log
  // 1 on console
  // 2 in error than in error file
  // 3 print all the logs
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),

    new winston.transports.File({ filename: "combined.log" }),
  ],
});
module.exports = logger;
