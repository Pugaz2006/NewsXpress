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

const sourceTitlesByLang = {
  ta: {
    "bbc": "பி.பி.சி தமிழ்",
    "dinamani": "தினமணி",
    "oneindia": "ஒன்று இந்தியா",
  },
  hi: {
    "bbc": "बीबीसी हिंदी",
    "news18": "न्यूज़18 हिंदी",
    "ndtv": "एनडीटीवी",
  },
  en: {
    "indianexpress": "Indian Express",
    "timesofindia": "Times of India",
    "hindustantimes": "Hindustan Times",
  },
  mr: {
    "marathi.indiatimes": "महाराष्ट्र टाइम्स",
    "esakal": "सकाळ",
    "lokmat": " लोकमत",
  },
  te: {
    "oneindia": "వన్‌ఇండియా తెలుగు",
    "hindustantimes": "హిందుస్తాన్ టైమ్స్ తెలుగు",
    "sakshi": "సాక్షి",
  }
};

const feedUrlsByLang = {
  ta: [
    "https://beta.dinamani.com/api/v1/collections/latest-news.rss",
    "https://feeds.bbci.co.uk/tamil/rss.xml",
    "https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml",
  ],
  hi: [
    "https://feeds.feedburner.com/ndtvkhabar-latest",
    "https://feeds.bbci.co.uk/hindi/rss.xml",
    "https://hindi.news18.com/rss/khabar/nation/nation.xml",
  ],
  en: [
    "https://indianexpress.com/feed/",
    "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
    "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
  ],
  te: [
    "https://telugu.oneindia.com/rss/feeds/oneindia-telugu-fb.xml",
    "https://telugu.hindustantimes.com/rss/andhra-pradesh",
  ]
};

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

function extractImageFromContent(content) {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

function getImage(item) {
  // console.log(item.StoryImage);
  return (
    item.enclosure?.url ||
    item["media:content"]?.url ||
    item["media:content"]?.$?.url ||
    item["media:thumbnail"]?.url ||
    item["media:thumbnail"]?.$?.url ||
    // item.StoryImage?.[0]?.trim() ||
    extractImageFromContent(item.content || item["content:encoded"]) ||
    null
  );
}

function detectSource(link, lang) {
  if (!link) return "Unknown";
  const map = sourceTitlesByLang[lang] || {};
  for (const key in map) {
    if (link.includes(key)) return map[key];
  }
  return "Other Source";
}


// const fallback = "https://tse2.mm.bing.net/th/id/OIP.sujvaw9jN9QLxiubmM0MTQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3";

// 🗓️ Only today’s news
function isToday(pubDateStr) {
  const pubDate = new Date(pubDateStr);
  const today = new Date();
  return (
    pubDate.getFullYear() === today.getFullYear() &&
    pubDate.getMonth() === today.getMonth() &&
    pubDate.getDate() === today.getDate()
  );
}
function resolveImageUrl(originalImageUrl) {
  if (!originalImageUrl) return null;

  try {
    const url = new URL(originalImageUrl);
const domain = url.hostname.toLowerCase();

// ✅ Skip ImageKit if image is from NDTV or Hindustan Times
if (
  domain.includes("ndtv.com") || 
  domain.includes("ndtvimg.com") || 
  domain.includes("hindustantimes.com")
) {
  return originalImageUrl;
}


    const encoded = encodeURIComponent(originalImageUrl);
    const imageKitBase = "https://ik.imagekit.io/iqmavgtmx/tr:w-400,h-270,fo-auto/";
    return `${imageKitBase}${encoded}`;
  } catch (err) {
    console.error("ImageKit URL resolution failed:", err.message);
    return originalImageUrl;
  }
}





// 📊 Main function
async function parseFeeds(lang = "en") {
  const allItems = [];
  const urls = feedUrlsByLang[lang] || [];
  if (urls.length === 0) return {};

  for (const url of urls) {
    try {
      const feed = await fetchWithRetry(url);
      console.log(`✅ Parsed ${feed.items.length} items from ${url}`);

      feed.items.forEach(async (item) => {
        const pubDate = item.pubDate || feed.lastBuildDate;
        if (!isToday(pubDate)) return; // ⛔ Skip old news

        let description = item.contentSnippet || item.summary || item.description || "";
        let title = item.title;
        if (lang === "ta") {
          const parts = title.split(" | ");
          if (parts.length > 1) {
            title = parts[1].trim();
          }
        }

        let originalImageUrl = getImage(item);
        let imageUrl =  resolveImageUrl(originalImageUrl);
        // console.log(imageUrl);

        // if(lang === "hi") console.log(image);

        allItems.push({
          title,
          description,
          link: item.link,
          pubDate,
          image:imageUrl,
          source: detectSource(item.link, lang),
        });
      });
    } catch (err) {
      console.error(`❌ Failed to fetch feed from ${url}:`, err.message);
    }
  }

  const grouped = {};
  for (const item of allItems) {
    if (!grouped[item.source]) grouped[item.source] = [];
    grouped[item.source].push(item);
  }

  return grouped;
}

// 🧪 CLI test
if (require.main === module) {
  parseFeeds("en").then((grouped) => {
    const allItems = Object.values(grouped).flat();
    console.log("✅ Total Today’s News:", allItems.length);
  });
}

module.exports = parseFeeds;
