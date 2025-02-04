const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
    },
    orignalName: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Media", MediaSchema);
