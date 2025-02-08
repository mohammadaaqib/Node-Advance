const logger = require("../utils/logger");
const Search = require("../models/Search");

const searchPostController = async (req, res) => {
  logger.info("Search Post controller");
  try {
    const { query } = req.query;
    console.log( query)
    const result = await Search.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    res.json(result);
  } catch (error) {
    logger.error("Error search   post", error);
    res.status(500).json({
      success: false,
      message: "Error  search  post",
    });
  }
};
module.exports = { searchPostController };
