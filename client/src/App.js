import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import NewsCard from "./components/NewsCard";
import BookmarksPage from "./components/BookmarksPage";

// ✅ Moved outside App to fix eslint warning
const fetchNews = async (batchNo = 0, lang = "en", setArticles, setBatch) => {
  try {
    const res = await fetch(`http://localhost:5000/api/rss?batch=${batchNo}&lang=${lang}`);
    const data = await res.json();
    const formatted = data.map(article => ({
      title: article.title,
      description: article.description,
      imageUrl: article.image,
      source: article.source,
      url: article.link,
      pubDate: article.pubDate,
    }));

    if (batchNo === 0) {
      setArticles(formatted); // reset
      setBatch(0);
    } else {
      setArticles(prev => [...prev, ...formatted]);
    }
  } catch (err) {
    console.error("Failed to fetch news:", err);
  }
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [page, setPage] = useState("home");
  const [batch, setBatch] = useState(0);

  useEffect(() => {
    console.log("times");
    fetchNews(0, selectedLanguage, setArticles, setBatch);
    fetchBookmarks();
  }, [selectedLanguage]);

  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDark]);

  const fetchBookmarks = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("bookmarkedNews")) || [];
      setBookmarks(saved);
    } catch (err) {
      console.error("Failed to load bookmarks from localStorage:", err);
    }
  };

  const refreshBookmarks = () => {
    fetchBookmarks();
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const matchesSearch = article.title?.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShowMore = () => {
    const nextBatch = batch + 1;
    fetchNews(nextBatch, selectedLanguage, setArticles, setBatch);
  };

  return (
    <div className="min-h-[100dvh] bg-[#f9f9f9] text-black dark:bg-[#0d1117] dark:text-white">
      <Navbar
        activeCategory={activeCategory}
        showCategory={setActiveCategory}
        searchText={searchText}
        setSearchText={setSearchText}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <div className="flex justify-center gap-4 py-4 text-white">
        <button
          onClick={() => setPage("home")}
          className={`px-4 py-2 rounded ${
            page === "home"
              ? "bg-blue-600 dark:bg-yellow-400 text-white dark:text-black"
              : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setPage("bookmarks")}
          className={`px-4 py-2 rounded ${
            page === "bookmarks"
              ? "bg-blue-600 dark:bg-yellow-400 text-white dark:text-black"
              : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          }`}
        >
          Bookmarks
        </button>
      </div>

      <main className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-0 py-8">
        {page === "home" ? (
          filteredArticles.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-200">No articles found.</p>
          ) : (
            <>
              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article, idx) => (
                  <NewsCard
                    key={idx}
                    {...article}
                    isBookmarked={bookmarks.some(b => b.link === article.url)}
                    refreshBookmarks={refreshBookmarks}
                  />
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
          )
        ) : (
          <BookmarksPage />
        )}
      </main>
    </div>
  );
}

