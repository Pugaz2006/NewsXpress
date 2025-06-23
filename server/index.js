const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();
app.use(cors());

// Helper: extract image from description
function extractImageFromDescription(html) {
  const match = html.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : null;
}

const feedSources = {
  tamil: {
    general: 'https://feeds.bbci.co.uk/tamil/rss.xml',
    sports: 'https://www.dinamalar.com/rss/sports.asp',
    cinema: 'https://www.dinamalar.com/rss/cinema.asp',
  },
  english: {
    general: 'https://feeds.bbci.co.uk/news/rss.xml',
    sports: 'https://feeds.bbci.co.uk/sport/rss.xml',
    cinema: 'https://feeds.bbci.co.uk/business/rss.xml',
  },
};

app.get('/api/news', async (req, res) => {
  const { language = 'tamil', category = 'general' } = req.query;
  const feedUrl = feedSources[language]?.[category];

  if (!feedUrl) {
    return res.status(400).json({ error: 'Invalid language or category' });
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    const articles = feed.items.slice(0, 9).map((item) => ({
      title: item.title,
      link: item.link,
      description: item.contentSnippet || item.content || '',
      image:
  item.enclosure?.url ||
  extractImageFromDescription(item.content || item.contentSnippet || '') ||
  `https://source.unsplash.com/400x200/?news,breaking`,
      // image: item.enclosure?.url || extractImageFromDescription(item.content || item.contentSnippet || '') || `https://source.unsplash.com/400x200/?${encodeURIComponent(item.title)}`,
      pubDate: item.pubDate,
      source: feed.title,
    }));

    res.json(articles);
  } catch (error) {
    console.error('Failed to fetch RSS:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
