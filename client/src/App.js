import React, { useState, useEffect } from "react";
import NewsCard from "./components/NewsCard";

const categories = ["Sports", "Business", "Politics"];

const generateDummyNews = (count, offset = 0, category = null) => {
  return Array(count)
    .fill(0)
    .map((_, i) => {
      const newsCategory = category ?? categories[Math.floor(Math.random() * categories.length)];

      return {
        title: `News ${i + offset + 1}`,
        description: `This is a ${category} generated news article.`,
        imageUrl: "https://via.placeholder.com/400x200",
        source: "NewsBot",
        category: newsCategory,
      };
    });
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    setArticles(generateDummyNews(9));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShowMore = () => {
    const category = activeCategory === "all" ? null : activeCategory;
    const newArticles = generateDummyNews(6, articles.length, category);
    setArticles((prev) => [...prev, ...newArticles]);
    setVisibleCount((prev) => prev + 6);
  };

  const show = (category = activeCategory) => {
    const selectedCategory = category === "all" ? null : category;
    setActiveCategory(category);
    setArticles(generateDummyNews(9, 0, selectedCategory));
    setVisibleCount(9);
  };

  return (
    <div className="min-h-[100dvh] bg-[#f9f9f9] text-black dark:bg-[#0d1117] dark:text-white">
      <nav className="bg-[#e4e4e4] dark:bg-[#161b22] shadow-md sticky top-0 z-50 border-b border-gray-300 dark:border-gray-800">
        <div className="w-full flex justify-between items-center px-4 py-3 flex-wrap gap-4 ">
          <div
            className="text-4xl px-8 font-bold cursor-pointer"
            onClick={() => show("all")}
          >
            NewsXpress
          </div>

          <ul className="flex gap-4">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => show(cat)}
                className={`cursor-pointer hover:text-yellow-600 capitalize ${
                  activeCategory === cat ? "text-yellow-300 font-semibold" : ""
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <input
              type="text"
              className="px-3 py-1 rounded border border-gray-300"
              placeholder="Search news..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-1 rounded">
              Search
            </button>

            <select
              className="px-2 py-1 rounded-xl border border-gray-300 bg-white text-black shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="mr">मराठी</option>
              <option value="ml">മലയാളം</option>
            </select>

            {/* Toggle Switch */}
            <button
  onClick={() => setIsDark(!isDark)}
  className={`relative w-16 h-9 flex items-center rounded-full p-1 transition-colors duration-300 ${
    isDark ? "bg-gray-800" : "bg-yellow-300"
  }`}
>
  {/* Sun */}
  <span
    className={`absolute left-1 z-10 text-base transition-all duration-300 ${
      isDark ? "text-gray-400" : "text-yellow-500 drop-shadow-[0_0_4px_rgba(255,223,0,0.8)]"
    }`}
  >
    🌞
  </span>

  {/* Moon */}

  <span
    className={`absolute right-0 z-10 px-1 mb-1 text-base transition-all duration-300 ${
      isDark ? "text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]" : "text-gray-400"
    }`}
  >
    🌙
  </span>

  {/* Knob */}
  <div
    className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
      isDark
        ? "translate-x-8 bg-white"
        : "translate-x-0 bg-white"
    }`}
  />
</button>

          </div>
        </div>
      </nav>

      <main className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-0 py-8">
        {filteredArticles.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-200">No articles found.</p>
        ) : (
          <>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.slice(0, visibleCount).map((article, idx) => (
                <NewsCard key={idx} {...article} />
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleShowMore}
                className="bg-[#b4cc2b] text-black font-semibold px-6 py-2 rounded shadow hover:bg-purple-100"
              >
                Show More
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}