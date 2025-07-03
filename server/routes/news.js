
const express = require("express");
const router = express.Router();
const parseFeeds = require("../utils/rssParser");

router.get("/", async (req, res) => {
  const batch = parseInt(req.query.batch || "0", 10);
  const data = await parseFeeds(batch);
  res.json(data);
});

module.exports = router;
