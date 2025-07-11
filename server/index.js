
// const express = require("express");
// const cors = require("cors");
// const parseFeeds = require("./utils/rssParser");

// const app = express();
// const PORT = 5000;
// app.use(cors());

// let cachedGroupedNews = {};
// let lastFetched = 0;

// // Refresh for all langs
// async function refreshNews() {
//   const langs = ["ta", "hi", "en", "te"];
//   for (const lang of langs) {
//     try {
//       const grouped = await parseFeeds(lang);
//       cachedGroupedNews[lang] = grouped;
//     } catch (err) {
//       console.error(`❌ Failed to load news for ${lang}:`, err.message);
//     }
//   }
//   lastFetched = Date.now();
//   console.log("🔁 Refreshed feeds at", new Date());
// }

// refreshNews();
// setInterval(refreshNews, 10 * 60 * 1000); // every 10 mins

// app.get("/api/news", (req, res) => {
//   const lang = req.query.lang || "ta";
//   const batch = parseInt(req.query.batch || "0");
//   console.log(`📥 Received /api/rss batch=${batch}, lang=${lang}`);

//   const group = cachedGroupedNews[lang];
//   if (!group) return res.status(503).json({ error: "Feeds not loaded yet." });

//   const count = batch === 0 ? 3 : 2;
//   const offset = batch === 0 ? 0 : 3 + (batch - 1) * 2;

//   const result = [];
//   for (const source in group) {
//     const newsList = group[source] || [];
//     result.push(...newsList.slice(offset, offset + count));
//   }

//   res.json(result);
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const newsRouter = require("./routes/news");

const app = express();
app.use(cors());
app.use("/api/news", newsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
