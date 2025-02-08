const mongoose = require("mongoose");

const Search = new mongoose.Schema(
  {
    postId: {
      type: String,
      require: true,
      unique: true,
    },
    userId: {
      type: String,
      require: true,
      index: true,
    },
    content: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      require: true,
    },
  },
  { timestamp: true }
);

Search.index({ content: "text" });
Search.index({ createdAt: -1 });
module.exports = new mongoose.model("Search", Search);
