const logger = require("../utils/logger");
const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    logger.info("Create post hit");
    const { content, mediaIds } = req.body;

    const newPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newPost.save();
    logger.info("Post created successfully");
    res.status(200).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    logger.error("Error creating post",error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
    });
  }
};
const getAllPosts = async (req, res) => {
  try {
    logger.info("Get all post hit");
  } catch (error) {
    logger.error("Error getting  post",error);
    res.status(500).json({
      success: false,
      message: "Error getting  post",
    });
  }
};
const getPost = async (req, res) => {
  try {
    logger.info("Get  post hit");
  } catch (error) {
    logger.error("Error singal getting  post",error);
    res.status(500).json({
      success: false,
      message: "Error singal getting  post",
    });
  }
};
const deletePost = async (req, res) => {
  try {
    logger.info("Delete post hit");
  } catch (error) {
    logger.error("Error deleting   post",error);
    res.status(500).json({
      success: false,
      message: "Error  deleting  post",
    });
  }
};

module.exports = { createPost, getAllPosts, getPost, deletePost };
