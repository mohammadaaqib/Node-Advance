const express = require("express");
const { searchPostController } = require("../controllers/search-controller");

const { authenticationRequest } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticationRequest);

router.get("/posts", searchPostController);

module.exports = router;
