const express = require("express");
const { createPost } = require("../controllers/post-controller");
const { authenticationRequest } = require("../middleware/authMiddleware");

const router = express();

router.use(authenticationRequest);

router.post("/create-post", createPost);


module.exports=router;

