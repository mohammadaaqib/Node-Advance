const express = require("express");
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} = require("../controllers/post-controller");
const { authenticationRequest } = require("../middleware/authMiddleware");

const router = express();

router.use(authenticationRequest);

router.post("/create-post", createPost);
router.get("/allpost", getAllPosts);
router.get("/:id", getPost);
router.delete("/:id", deletePost);

module.exports = router;
