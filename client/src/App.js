import { useState, useEffect } from 'react';

const languages = ['tamil', 'english'];
const categories = ['general', 'sports', 'cinema'];

function App() {
  const [language, setLanguage] = useState('tamil');
  const [category, setCategory] = useState('general');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/news?language=${language}&category=${category}`);
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  fetchNews();
}, [language, category]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 text-white px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6 drop-shadow-lg">📰 NewsXpress</h1>

      {/* Language and Category Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              language === lang
                ? 'bg-white text-purple-700 shadow-md'
                : 'bg-purple-100 text-purple-800 hover:bg-white hover:text-purple-700'
            }`}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              category === cat
                ? 'bg-white text-pink-600 shadow-md'
                : 'bg-pink-100 text-pink-800 hover:bg-white hover:text-pink-600'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {loading ? (
        <p className="text-center text-white">Loading news...</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-white">No news found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
            >
              <img
                src={item.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt="news"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h2>
                <p className="text-sm text-gray-700 line-clamp-3 mb-2">{item.description}</p>
                <p className="text-xs text-gray-500">{item.source}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
