const logger = require("../utils/logger");
const { validateRegester } = require("../utils/validation");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

//user register

const registerUser = async (req, res) => {
  logger.info("creating user");
  try {
    const {error} = validateRegester(req.body);
    if (error) {
      logger.warn("here1",error);
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }


    const { email, userName, password } = req.body;
    let user = await User.findOne({ $or: [{ email }, { userName }] });
    if (user) {
      logger.warn("user already exists");
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    user = new User({ userName, email, password });
    await user.save();
    logger.warn("user created successfully", user);

    const { accesstoken, refreshToken } = await generateToken(user);

    res.status(201).json({
      success: true,
      message: "user created successfully",
      accesstoken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Regester user error occure", error);
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};
//user login

//refersh token

//logout

module.exports = { registerUser };
