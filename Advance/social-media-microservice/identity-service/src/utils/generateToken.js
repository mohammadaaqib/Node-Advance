const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/RefreshToken");

const generateToken = async (user) => {
  const accesstoken = jwt.sign(
    {
      userId: user._id,
      userName: user.userName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "60m",
    }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); //refresh token expire in sevendays

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  return { accesstoken, refreshToken };
};

module.exports=generateToken;
