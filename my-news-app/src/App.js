import { useEffect, useState } from 'react';
import axios from 'axios';

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

function App() {
  const [language, setLanguage] = useState('tamil');
  const [category, setCategory] = useState('general');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentFeed = feedSources[language][category];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(currentFeed)}`
        );
        const items = res.data.items.slice(0, 9);
        setNewsItems(items);
      } catch (err) {
        console.error("Error fetching news:", err);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [language, category]);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-500 to-pink-500" />
      <div className="min-h-screen py-10 px-4">
        <h1 className="text-white text-3xl font-bold mb-4 text-center">
          🗞️ {language === 'tamil' ? 'தமிழ் செய்திகள்' : 'News Headlines'}
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {/* Language */}
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('tamil')}
              className={`px-4 py-2 rounded-full ${
                language === 'tamil' ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-800'
              }`}
            >
              Tamil
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-full ${
                language === 'english' ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-800'
              }`}
            >
              English
            </button>
          </div>

          {/* Category */}
          <div className="flex gap-2">
            {['general', 'sports', 'cinema'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full ${
                  category === cat ? 'bg-white text-pink-600' : 'bg-pink-100 text-pink-800'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <p className="text-white text-center">Loading news...</p>
        ) : newsItems.length === 0 ? (
          <p className="text-white text-center">No messages right now found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, i) => {
              const imgSrc = item.thumbnail || extractImageFromDescription(item.description);
              return (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <img
                    src={imgSrc || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
