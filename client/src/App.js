import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import NewsCard from "./components/NewsCard";
import { generateDummyNews } from "./utils/newsGenerator";

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
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
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

  const showCategory = (category = activeCategory) => {
    const selectedCategory = category === "all" ? null : category;
    setActiveCategory(category);
    setArticles(generateDummyNews(9, 0, selectedCategory));
    setVisibleCount(9);
  };

  let content;

  try {
    content = (
      <div className="min-h-[100dvh] bg-[#f9f9f9] text-black dark:bg-[#0d1117] dark:text-white">
        <Navbar
          activeCategory={activeCategory}
          showCategory={showCategory}
          searchText={searchText}
          setSearchText={setSearchText}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          isDark={isDark}
          setIsDark={setIsDark}
        />

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
  className="font-semibold px-6 py-2 rounded shadow transition-all bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500"
>
  Show More
</button>

              </div>
            </>
          )}
        </main>
      </div>
    );
  } catch (err) {
    content = (
      <pre className="text-red-600 text-sm px-4 py-2">
        Error: {err.message}
      </pre>
    );
  }

  return content;
}
