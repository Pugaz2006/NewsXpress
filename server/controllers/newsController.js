// const parseFeeds = require('../utils/rssParser');
// const fetchNewsAPI = require('../utils/newsapiFetcher');
// //   'https://feedfry.com/rss/11f057379c441b19bc9f3f48669a9101',
// const rssFeeds = [
// //   'https://rss.app/feeds/aSNzZyjfWhOwF9Zo.xml',
// //   'https://feeds.bbci.co.uk/tamil/rss.xml',
// //   'https://rss.app/feeds/bX4wzpDwgiutfW2h.xml',
// ];  

// exports.getCombinedNews = async (req, res) => {
//   try {
//     // rssFeeds
//     // const rssNews = await parseFeeds();
//     const apiNews = await fetchNewsAPI();
//     console.log(apiNews);
//     // ...rssNews,
//     const combined = [...apiNews];

//     // Sort by pubDate (latest first)
//     combined.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

//     res.json(combined.slice(0, 12)); // send latest 12
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch news' });
//   }
// };
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
