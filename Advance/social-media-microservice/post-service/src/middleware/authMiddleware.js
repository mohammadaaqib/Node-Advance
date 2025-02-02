const logger = require("../utils/logger");

const authenticationRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!user) {
    logger.warn("Access attempted without user ID");
    res.status(401).json({
      success: false,
      message: "Access attempted without user ID",
    });
  }

  req.user = { userId };
  next();
};
module.exports = { authenticationRequest };
