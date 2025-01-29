const logger = require("../utils/logger");
const { validateRegester } = require("../utils/validation");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

//user register

const registerUser = async (req, res) => {
  logger.info("creating user");
  try {
    const error = validateRegester(req.body);
    if (error) {
      logger.warn("Validation error", error.detail[0].message);
      return res.status(400).json({
        success: false,
        message: error.detail[0].message,
      });
    }

    const { email, userName, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { userName }] });
    if (user) {
      logger.warn("user already exists");
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    user = new User({ userName, email, password });
    await user.save();
    logger.warn("user reated successfully", user._id);

    const { accesstoken, refreshToken } = await generateToken(user);

    res.status(201).json({
      success: true,
      message: "user reated successfully",
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

model.exports = { registerUser };
