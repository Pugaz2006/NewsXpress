// const express = require('express');
// const router = express.Router();
// const { getCombinedNews } = require('../controllers/newsController');

// router.get('/', getCombinedNews);

// module.exports = router;
const express = require("express");
const router = express.Router();
const parseFeeds = require("../utils/rssParser");

router.get("/", async (req, res) => {
  const batch = parseInt(req.query.batch || "0", 10);
  const data = await parseFeeds(batch);
  res.json(data);
});

module.exports = router;
