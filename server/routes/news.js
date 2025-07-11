
const express = require('express');
const fetchFromNewsAPI = require('../utils/newsapiFetcher');
const fetchFromGoogleRSS = require('../utils/catagory_search'); // This should support category+search
const parseFeeds = require('../utils/rssParser');

const router = express.Router();

let cachedGroupedNews = {};
let cachedCategoryNews = {}; // { lang: { category: [articles] } }
let lastFetched = 0, lastApiFetch = 0;
const CATEGORIES = ['business', 'sports', 'politics', 'science'];

async function refreshNews() {
  const now = Date.now();
  const langs = ['ta', 'hi', 'en', 'te'];

  for (const lang of langs) {
    try {
      const grouped = await parseFeeds(lang);
      cachedGroupedNews[lang] = grouped;

      for (const category of CATEGORIES) {
        if (!cachedCategoryNews[lang]) cachedCategoryNews[lang] = {};

        if (lang === 'en') {
          const ONE_HOUR = 60 * 60 * 1000;
          const needsUpdate = !cachedCategoryNews[lang][category] || (now - lastApiFetch > ONE_HOUR);

          if (needsUpdate) {
            try {
              const newsapiArticles = await fetchFromNewsAPI({ category, search: '' });
              cachedCategoryNews[lang][category] = newsapiArticles;
              lastApiFetch = now;
              console.log(`📰 [NewsAPI] lang=en cat=${category} count=${newsapiArticles.length}`);
            } catch (error) {
              console.error(`❌ NewsAPI failed, falling back to RSS:`, error.message);

              try {
                const rssArticles = await fetchFromGoogleRSS({ lang, category, search: '' });
                cachedCategoryNews[lang][category] = rssArticles;
                console.log(`🔁 [RSS Fallback] lang=en cat=${category} count=${rssArticles.length}`);
              } catch (rssErr) {
                console.error(`❌ Google RSS Fallback failed: ${rssErr.message}`);
                cachedCategoryNews[lang][category] = [];
              }
            }
          }
        } else {
          const rssArticles = await fetchFromGoogleRSS({ lang, category, search: '' });
          cachedCategoryNews[lang][category] = rssArticles;
          console.log(`✅ [Google RSS] lang=${lang} cat=${category} count=${rssArticles.length}`);
        }
      }
    } catch (err) {
      console.error(`❌ Failed to load language ${lang}: ${err.message}`);
    }
  }

  lastFetched = Date.now();
  console.log('🔁 Feeds refreshed at', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
}

refreshNews();
setInterval(refreshNews, 10 * 60 * 1000); // Refresh every 10 mins

router.get('/', async (req, res) => {
  const { lang = 'en', category = '', search = '', batch = '0' } = req.query;
  const batchNo = parseInt(batch, 10);
  let articles = [];

  try {
    if (category || search) {
      if (category && !search && cachedCategoryNews[lang]?.[category.toLowerCase()]) {
        articles = cachedCategoryNews[lang][category.toLowerCase()];
      } else if (lang === 'en') {
        try {
          articles = await fetchFromNewsAPI({ category, search });
          console.log(`🔍 [NewsAPI Search] lang=${lang} cat=${category} search="${search}" count=${articles.length}`);
        } catch (error) {
          console.error(`❌ NewsAPI search failed:`, error.message);

          try {
            articles = await fetchFromGoogleRSS({ lang, category, search });
            console.log(`🔁 [RSS Search Fallback] lang=${lang} cat=${category} count=${articles.length}`);
          } catch (rssError) {
            console.error(`❌ RSS Search also failed: ${rssError.message}`);
            articles = [];
          }
        }
      } else {
        articles = await fetchFromGoogleRSS({ lang, category, search });
      }
    } else {
      const group = cachedGroupedNews[lang];
      if (!group) return res.status(503).json({ error: 'Feeds not ready yet' });

      const today = new Date();
      const isToday = (dateStr) => {
        const d = new Date(dateStr);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      };

      const sources = Object.values(group).map(arr =>
        arr.sort((a, b) => new Date(b.pubDate || b.publishedAt) - new Date(a.pubDate || a.publishedAt))
      );

      const batchSize = batchNo === 0 ? 9 : 6;
      const offset = batchNo === 0 ? 0 : 9 + (batchNo - 1) * 6;
      let mixed = [];
      let pointers = new Array(sources.length).fill(0);

      while (mixed.length < offset + batchSize) {
        let added = false;
        for (let i = 0; i < sources.length; i++) {
          if (pointers[i] < sources[i].length) {
            mixed.push(sources[i][pointers[i]]);
            pointers[i]++;
            added = true;
            if (mixed.length >= offset + batchSize) break;
          }
        }
        if (!added) break;
      }

      const paged = mixed.slice(offset, offset + batchSize);
      console.log(`📤 Today's Interleaved: lang=${lang} batch=${batchNo} size=${paged.length}`);
      return res.json(paged);
    }

    const start = batchNo === 0 ? 0 : 9 + (batchNo - 1) * 6;
    const end = batchNo === 0 ? 9 : start + 6;
    const paged = articles.slice(start, end);

    console.log(`📤 lang=${lang} cat=${category} batch=${batchNo} size=${paged.length}`);
    res.json(paged);
  } catch (err) {
    console.error(`❌ Fatal /api/news error: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
