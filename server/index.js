// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const newsRoutes = require('./routes/news');
// // const bookmarkRoutes = require('./routes/bookmarks');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch(err => {
//   console.error('❌ MongoDB connection error:', err);
//   process.exit(1); // Exit if DB connection fails
// });

// // Routes
// app.use('/api/news', newsRoutes);
// // app.use('/api/bookmarks', bookmarkRoutes);

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
// const express = require("express");
// const cors = require("cors");
// const parseFeeds = require("./utils/rssParser"); // ✅ Make sure this path is correct

// const app = express();
// const PORT = 5000;

// app.use(cors());

// // API route to get parsed RSS news
// app.get("/api/rss", async (req, res) => {
//   const batch = parseInt(req.query.batch || "0", 10);
//   console.log("📥 Received request for /api/rss with batch =", batch);

//   try {
//     const newsItems = await parseFeeds(batch);
//     console.log("📦 Returning", newsItems.length, "news items");

//     res.json(newsItems);
//   } catch (err) {
//     console.error("❌ Error in /api/rss:", err.message);
//     res.status(500).json({ error: "Failed to parse RSS feed" });
//   }
// });

// // Default root route (optional)
// app.get("/", (req, res) => {
//   res.send("✅ NewsXpress API is running.");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server started at http://localhost:${PORT}`);
// });

// server/index.js
// const express = require("express");
// const cors = require("cors");
// const parseFeeds = require("./utils/rssParser");


// const app = express();
// const PORT = 5000;
// app.use(cors());

// let cachedGroupedNews = {};
// let lastFetched = 0;

// // Fetch initially and every 10 min
// async function refreshNews() {
//   cachedGroupedNews = await parseFeeds();
//   lastFetched = Date.now();
//   console.log("🔁 Refreshed feeds at", new Date());
// }
// refreshNews();
// setInterval(refreshNews, 10 * 60 * 1000); // every 10 minutes

// app.get("/api/rss", (req, res) => {
//   const lang = req.query.lang || "ta";
//   const batch = parseInt(req.query.batch || "0");
//   console.log(`📥 Received /api/rss batch=${batch}`);

//   if (!cachedGroupedNews || Object.keys(cachedGroupedNews).length === 0) {
//     return res.status(503).json({ error: "Feeds not loaded yet." });
//   }

//   const count = batch === 0 ? 3 : 2;
//   const offset = batch === 0 ? 0 : 3 + (batch - 1) * 2;

//   const result = [];

//   for (const source of ["Daily Thanthi", "Dinamalar", "BBC Tamil"]) {
//     const newsList = cachedGroupedNews[source] || [];
//     result.push(...newsList.slice(offset, offset + count));
//   }

//   res.json(result);
// });


// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const parseFeeds = require("./utils/rssParser");

const app = express();
const PORT = 5000;
app.use(cors());

let cachedGroupedNews = {};
let lastFetched = 0;

// Refresh for all langs
async function refreshNews() {
  const langs = ["ta", "hi", "en","mr", "te"];
  for (const lang of langs) {
    try {
      const grouped = await parseFeeds(lang);
      cachedGroupedNews[lang] = grouped;
    } catch (err) {
      console.error(`❌ Failed to load news for ${lang}:`, err.message);
    }
  }
  lastFetched = Date.now();
  console.log("🔁 Refreshed feeds at", new Date());
}

refreshNews();
setInterval(refreshNews, 10 * 60 * 1000); // every 10 mins

app.get("/api/rss", (req, res) => {
  const lang = req.query.lang || "ta";
  const batch = parseInt(req.query.batch || "0");
  console.log(`📥 Received /api/rss batch=${batch}, lang=${lang}`);

  const group = cachedGroupedNews[lang];
  if (!group) return res.status(503).json({ error: "Feeds not loaded yet." });

  const count = batch === 0 ? 3 : 2;
  const offset = batch === 0 ? 0 : 3 + (batch - 1) * 2;

  const result = [];
  for (const source in group) {
    const newsList = group[source] || [];
    result.push(...newsList.slice(offset, offset + count));
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

