
const parseFeeds = require('../utils/rssParser');

const getCombinedNews = async (req, res) => {
  try {
    const news = await parseFeeds();
    res.json(news);
  } catch (err) {
    console.error('❌ Error fetching combined news:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

module.exports = { getCombinedNews };
