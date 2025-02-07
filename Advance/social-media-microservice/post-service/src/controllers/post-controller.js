const logger = require("../utils/logger");
const Post = require("../models/Post");
const { validatePost } = require("../utils/validation");

const {publishEvent} =require('../utils/rabbitmq');

async function invalidatePostCache(req) {
  const keys = await req.redisClient.keys("post:*");

  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}

const createPost = async (req, res) => {
  try {
    logger.info("Create post hit");
    const { error } = validatePost(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { content, mediaIds } = req.body;

    const newPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newPost.save();
    await invalidatePostCache(req);
    logger.info("Post created successfully");
    res.status(200).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    logger.error("Error creating post", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
    });
  }
};
const getAllPosts = async (req, res) => {
  try {
    logger.info("Get all post hit");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    //create cache key and check if it present or not if present return
    const cacheKey = `post:${page}:${limit}`;

    const cachedPost = await req.redisClient.get(cacheKey);
    if (cachedPost) {
      logger.info("Data from cache redis");
      return res.json(JSON.parse(cachedPost));
    }
    // getting post from db
    const post = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // get total number of  document

    const totalNumberOfPost = await Post.countDocuments();

    const result = {
      post,
      currentpage: page,
      totalpage: Math.ceil(totalNumberOfPost / limit),
      totalpost: totalNumberOfPost,
    };

    //now save post in redis client

    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    logger.info("Data from db");
    res.json(result);
  } catch (error) {
    logger.error("Error getting  post", error);
    res.status(500).json({
      success: false,
      message: "Error getting  post",
    });
  }
};
const getPost = async (req, res) => {
  try {
    logger.info("Get  post hit");
    const id = req.params.id;
    const cacheKey = `post:${id}`;
    const cachedPost = await req.redisClient.get(cacheKey);
    if (cachedPost) {
      logger.info("Data from cache");
      return res.json(JSON.parse(cachedPost));
    }

    const post = await Post.findById(id);
    if (!post) {
      logger.warn("No post found by this id");
      return res.status(404).json({
        success: false,
        message: "No post found by this id",
      });
    }
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(post));
    return res.status(200).json(post);
  } catch (error) {
    logger.error("Error singal getting  post", error);
    res.status(500).json({
      success: false,
      message: "Error singal getting  post",
    });
  }
};
const deletePost = async (req, res) => {
  try {
    logger.info("Delete post hit");
    const id = req.params.id;
    const cacheKey = `post:${id}`;

    const post = await Post.findByIdAndDelete(id);
    //publish post delete event

    await publishEvent("post.delete", {
      postId: post._id,
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    });

    invalidatePostCache(req);
    await res.status(200).json({ success: true, message: "post deleted" });
  } catch (error) {
    logger.error("Error deleting   post", error);
    res.status(500).json({
      success: false,
      message: "Error  deleting  post",
    });
  }
};

module.exports = { createPost, getAllPosts, getPost, deletePost };
