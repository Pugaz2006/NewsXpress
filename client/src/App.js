
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import NewsCard from "./components/NewsCard";
import BookmarksPage from "./components/BookmarksPage";

const fetchNews = async (
  batchNo = 0,
  lang = "en",
  setArticles,
  setBatch,
  category = "",
  search = ""
) => {
  try {
    const params = new URLSearchParams();
    params.append("batch", batchNo);
    params.append("lang", lang);
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
console.log("🧠 fetchNews batch:", batchNo, "category:", category);
    const res = await fetch(`http://localhost:5000/api/news?${params.toString()}`);
  //  const res = await fetch(`http://localhost:5000/api/news?lang=${lang}&category=${category}&search=${search}`);
const data = await res.json();

    const formatted = data.map((article) => ({
      title: article.title,
      description: article.description,
      imageUrl: article.image || article.urlToImage || "/default_news.jpg",
      source: article.source?.name || article.source || "",
      url: article.url || article.link,
      pubDate: article.pubDate || article.publishedAt || "",
      category: category || "all",
    }));

    if (batchNo === 0) {
      setArticles(formatted); // reset
      // setBatch(0);
    } else {
      setArticles((prev) => [...prev, ...formatted]);
      setBatch(batchNo);
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
     console.log("📡 useEffect triggered — category:", activeCategory);
    fetchNews(0, selectedLanguage, setArticles, setBatch, activeCategory, searchText);
    fetchBookmarks();
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedLanguage, activeCategory, searchText]);

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
  const resetToHome = () => {
  setActiveCategory("all");
  setSearchText("");
  fetchNews(0, selectedLanguage, setArticles, setBatch);
   window.scrollTo({ top: 0, behavior: "smooth" });
};
  const handleCategoryChange = (cat) => {
    console.log(cat);
    setActiveCategory(cat);
    setSearchText(""); 
    setBatch(0); // optional: clear search when changing category
    setArticles([]); // clear articles so new fetch starts from scratch
  };

  const handleShowMore = () => {
    const nextBatch = batch + 1;
    fetchNews(nextBatch, selectedLanguage, setArticles, setBatch, activeCategory, searchText);
  };

  return (
    <div className="min-h-[100dvh] bg-[#f9f9f9] text-black dark:bg-[#0d1117] dark:text-white">
      <Navbar
        activeCategory={activeCategory}
        showCategory={handleCategoryChange}
        searchText={searchText}
        setSearchText={setSearchText}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setBatch={setBatch}
        isDark={isDark}
        setIsDark={setIsDark}
        resetToHome={resetToHome}
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
          articles.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-200">No articles found.</p>
          ) : (
            <>
              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, idx) => (
                  <NewsCard
                    key={idx}
                    {...article}
                    isBookmarked={bookmarks.some((b) => b.link === article.url)}
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
