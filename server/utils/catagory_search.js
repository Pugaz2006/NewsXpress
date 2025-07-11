const axios = require('axios');
const { parseStringPromise } = require('xml2js');

async function fetchFromGoogleNewsRSS({ lang, category, search }) {
  let rssUrl = `https://news.google.com/rss`;
  const base = `&hl=${lang}&gl=IN&ceid=IN:${lang}`;

  if (search) {
    rssUrl += `/search?q=${encodeURIComponent(search)}${base}`;
  } else if (category && category.toLowerCase() !== 'all') {
    rssUrl += `/headlines/section/topic/${category.toUpperCase()}?${base}`;
  } else {
    rssUrl += `?${base}`;
  }

  try {
    console.log("📡 Fetching RSS URL:", rssUrl);
    const response = await axios.get(rssUrl);
    let xml = response.data;

    // Fix invalid & characters
    xml = xml.replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;');

    const result = await parseStringPromise(xml, { explicitArray: false });
    const items = result.rss.channel.item || [];

    const cleaned = items.map((item) => {
      const rawDesc = item.description || '';

      // Extract inner text of first <li><a>...</a></li>
      let cleanDesc = '';
      const match = rawDesc.match(/<li><a [^>]+>(.*?)<\/a>/);
      if (match && match[1]) {
        cleanDesc = match[1];
      }

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: cleanDesc,
        source: item.source?._ || '',
      };
    });

    cleaned.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    return cleaned;
  } catch (err) {
    console.error("❌ Error in fetchFromGoogleNewsRSS:", err.message);
    return [];
  }
}

module.exports = fetchFromGoogleNewsRSS;
