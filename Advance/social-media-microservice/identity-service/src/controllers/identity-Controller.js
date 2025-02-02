const logger = require("../utils/logger");
const { validateRegester, validateLogin } = require("../utils/validation");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const generateToken = require("../utils/generateToken");

//user register

const registerUser = async (req, res) => {
  logger.info("creating user");
  try {
    const { error } = validateRegester(req.body);
    if (error) {
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

//
const loginUser = async (req, res) => {
  logger.info("Login user");
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Invalid credential");
      return res.status(400).json({
        success: false,
        message: "Invalid credential",
      });
    }

    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      logger.warn("Invalid credential");
      return res.status(400).json({
        success: false,
        message: "Invalid credential",
      });
    }
    const { accesstoken, refreshToken } = await generateToken(user);
    res.status(200).json({
      success: true,
      message: "Login successfully",
      accesstoken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Login user error occure", error);
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};

//refersh token
const refreshTokenUser = async (req, res) => {
  logger.info("Refresh token endpoint hit..");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh Token missing");
      res.status(400).json({
        success: false,
        message: "Refresh Token missing",
      });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || storedToken.expireAt < new Date()) {
      logger.warn("Invalid or expire refresh token");
      res.status(401).json({
        success: false,
        message: "Invalid or expire refresh token",
      });
    }

    const user = await User.findById(storedToken.user);

    if (!user) {
      logger.warn("User not found");
      res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const { accesstoken: newAccessToken, refreshToken: newRefreshToken } =
      await generateToken(user);

    //delete previos token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    res.status(200).json({
      accesstoken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("Refresh token error occure", error);
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};

//logout
const logoutUser = async (req, res) => {
  logger.info("logout user  endpoint hit..");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh Token missing");
      res.status(400).json({
        success: false,
        message: "Refresh Token missing",
      });
    }

    await RefreshToken.deleteOne({ token: refreshToken });
    logger.info("RefreshToken is deleted for logout");
    res.json({
      success: true,
      message: "Logged Out successfully",
    });
  } catch (error) {
    logger.error("LogOut  error occure", error);
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};

module.exports = { registerUser, loginUser, refreshTokenUser, logoutUser };
 