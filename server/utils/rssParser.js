
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const Parser = require("rss-parser");
const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (NewsXpress RSS Reader)",
  },
  customFields: {
    item: [
      ["media:thumbnail", "media:thumbnail"],
      ["media:content", "media:content"],
    ],
  },
});

// 🔤 Source titles by language
const sourceTitlesByLang = {
  ta: {
    "bbc": "பி.பி.சி தமிழ்",
    "dailythanthi": "தினத்தந்தி",
    "dinamalar": "தினமலர்",
  },
  hi: {
    "bbc": "बीबीसी हिंदी",
    "amarujala": "अमर उजाला",
    "ndtv": "NDTV",
  },
  en: {
    "bbc": "BBC NEWS",
    "timesofindia": "Times of India",
    "hindustantimes": "Hindustan Times",
  },
  mr: {
    "marati.indiatimes" : "महाराष्ट्र टाइम्स",
    "esakal" : "सकाळ",
    "lokmat" : " लोकमत",
  },
  te: {
    "oneindia" : "వన్‌ఇండియా తెలుగు",
    "hindustantimes": "హిందుస్తాన్ టైమ్స్ తెలుగు",
    "sakshi" : "సాక్షి",
  }
};

// 🔗 RSS Feeds by language
const feedUrlsByLang = {
  ta: [
    "https://rss.app/feeds/aSNzZyjfWhOwF9Zo.xml",
    "https://rss.app/feeds/19D7vp0QsDiMETjr.xml",
    "https://feeds.bbci.co.uk/tamil/rss.xml", // ❗ no trailing space
  ],
  hi: [
    "https://rss.app/feeds/rMxSoDZPeLbaea2p.xml",
    "https://feeds.bbci.co.uk/hindi/rss.xml",
    "https://rss.app/feeds/h1ckrSLxqpkVALlD.xml",
  ],
  en: [
    "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",
    "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
    "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
  ],
  mr: [
    "https://rss.app/feeds/Iq40IzDvlCzaixe5.xml",
    "https://rss.app/feeds/rjcbJHTINnXymyCC.xml",
    "https://rss.app/feeds/WT9dk78mnf3xbY8i.xml",
  ],
  te: [
    "https://telugu.oneindia.com/rss/feeds/oneindia-telugu-fb.xml",
    "https://telugu.hindustantimes.com/rss/andhra-pradesh",
    "https://rss.app/feeds/SQy3tqry4w5ixkIh.xml",
  ]
};

// 🛠 Retry + Timeout
function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));
}

async function fetchWithRetry(url, retries = 3, delay = 1000, timeoutMs = 7000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await Promise.race([
        parser.parseURL(url),
        timeout(timeoutMs),
      ]);
    } catch (err) {
      console.warn(`🔁 Retry ${i + 1} for ${url} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// 🖼️ Image extractor
function extractImageFromContent(content) {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

function getImage(item) {
  return (
    item.enclosure?.url ||
    item["media:content"]?.url ||
    item["media:content"]?.$?.url ||
    item["media:thumbnail"]?.url ||
    item["media:thumbnail"]?.$?.url ||
    extractImageFromContent(item.content || item["content:encoded"]) ||
    null
  );
}

// 📛 Detect source
function detectSource(link, lang) {
  if (!link) return "Unknown";
  const map = sourceTitlesByLang[lang] || {};
  for (const key in map) {
    if (link.includes(key)) return map[key];
  }
  return "Other Source";
}

// 🈲 Tamil detection
function isTamil(text) {
  return /[\u0B80-\u0BFF]/.test(text);
}

// 📊 Main function
async function parseFeeds(lang = "ta") {
  console.log(lang);
  const allItems = [];
  const urls = feedUrlsByLang[lang] || [];
  if (urls.length === 0) return {};

  for (const url of urls) {
    try {
      const feed = await fetchWithRetry(url);
      console.log(`✅ Parsed ${feed.items.length} items from ${url}`);

      feed.items.forEach((item) => {
        const description = item.contentSnippet || item.summary || item.description || "";
        if (lang === "ta" && !isTamil(description)) return;

        allItems.push({
          title: item.title,
          description,
          link: item.link,
          pubDate: item.pubDate,
          image: getImage(item),
          source: detectSource(item.link, lang),
        });
      });
    } catch (err) {
      console.error(`❌ Failed to fetch feed from ${url}:`, err.message);
    }
  }

  // 🔁 Group dynamically
  const grouped = {};
  for (const item of allItems) {
    if (!grouped[item.source]) grouped[item.source] = [];
    grouped[item.source].push(item);
  }

  return grouped;
}

// 🧪 CLI test
if (require.main === module) {
  parseFeeds("te").then((grouped) => {
    const allItems = Object.values(grouped).flat();
    console.log("✅ Total News:", allItems.length);
    // allItems.forEach((item, i) => {
    //   console.log(`[${i + 1}] ${item.source}: ${item.title}`);
    // });
  });
}

module.exports = parseFeeds;




