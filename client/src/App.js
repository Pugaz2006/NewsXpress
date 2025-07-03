// // import React, { useState, useEffect } from "react";
// // import Navbar from "./components/Navbar";
// // import NewsCard from "./components/NewsCard";
// // import BookmarksPage from "./components/BookmarksPage";
// // import { generateDummyNews } from "./utils/newsGenerator";

// // export default function App() {
// //   const [isDark, setIsDark] = useState(true);
// //   const [articles, setArticles] = useState([]);
// //   const [activeCategory, setActiveCategory] = useState("all");
// //   const [searchText, setSearchText] = useState("");
// //   const [selectedLanguage, setSelectedLanguage] = useState("en");
// //   const [visibleCount, setVisibleCount] = useState(9);
// //   const [page, setPage] = useState("home"); // 🔁 new state

// //   useEffect(() => {
// //     setArticles(generateDummyNews(9));
// //   }, []);

// //   useEffect(() => {
// //     const root = window.document.documentElement;
// //     isDark ? root.classList.add("dark") : root.classList.remove("dark");
// //   }, [isDark]);

// //   const filteredArticles = articles.filter((article) => {
// //     const matchesCategory = activeCategory === "all" || article.category === activeCategory;
// //     const matchesSearch = article.title.toLowerCase().includes(searchText.toLowerCase());
// //     return matchesCategory && matchesSearch;
// //   });

// //   const handleShowMore = () => {
// //     const category = activeCategory === "all" ? null : activeCategory;
// //     const newArticles = generateDummyNews(6, articles.length, category);
// //     setArticles((prev) => [...prev, ...newArticles]);
// //     setVisibleCount((prev) => prev + 6);
// //   };

// //   const showCategory = (category = activeCategory) => {
// //     const selectedCategory = category === "all" ? null : category;
// //     setActiveCategory(category);
// //     setArticles(generateDummyNews(9, 0, selectedCategory));
// //     setVisibleCount(9);
// //   };

// //   return (
// //     <div className="min-h-[100dvh] bg-[#f9f9f9] text-black dark:bg-[#0d1117] dark:text-white">
// //       <Navbar
// //         activeCategory={activeCategory}
// //         showCategory={showCategory}
// //         searchText={searchText}
// //         setSearchText={setSearchText}
// //         selectedLanguage={selectedLanguage}
// //         setSelectedLanguage={setSelectedLanguage}
// //         isDark={isDark}
// //         setIsDark={setIsDark}
// //       />

// //       <div className="flex justify-center gap-4 py-4 text-white">
// //         <button
// //           onClick={() => setPage("home")}
// //           className={`px-4 py-2 rounded ${
// //             page === "home" ? "bg-blue-600 dark:bg-yellow-400 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-black"
// //           }`}
// //         >
// //           Home
// //         </button>
// //         <button
// //           onClick={() => setPage("bookmarks")}
// //           className={`px-4 py-2 rounded ${
// //             page === "bookmarks" ? "bg-blue-600 dark:bg-yellow-400 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-black"
// //           }`}
// //         >
// //           Bookmarks
// //         </button>
// //       </div>

// //       <main className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-0 py-8">
// //         {page === "home" ? (
// //           filteredArticles.length === 0 ? (
// //             <p className="text-center text-gray-500 dark:text-gray-200">No articles found.</p>
// //           ) : (
// //             <>
// //               <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
// //                 {filteredArticles.slice(0, visibleCount).map((article, idx) => (
// //                   <NewsCard key={idx} {...article} />
// //                 ))}
// //               </div>

// //               <div className="text-center mt-6">
// //                 <button
// //                   onClick={handleShowMore}
// //                   className="font-semibold px-6 py-2 rounded shadow transition-all bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500"
// //                 >
// //                   Show More
// //                 </button>
// //               </div>
// //             </>
// //           )
// //         ) : (
// //           <BookmarksPage />
// //         )}
// //       </main>
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import NewsCard from "./components/NewsCard";
// import BookmarksPage from "./components/BookmarksPage";

// export default function App() {
//   const [isDark, setIsDark] = useState(true);
//   const [articles, setArticles] = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [searchText, setSearchText] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("en");
//   const [visibleCount, setVisibleCount] = useState(9);
//   const [page, setPage] = useState("home");
//   // const [batch, setBatch] = useState(0);
// // const [page, setPage] = useState([]);


//   // Fetch news and bookmarks on load
//   useEffect(() => {
//     fetchNews();
//     fetchBookmarks();
//   }, []);

//   useEffect(() => {
//     const root = window.document.documentElement;
//     isDark ? root.classList.add("dark") : root.classList.remove("dark");
//   }, [isDark]);

//   const fetchNews = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/news");
//       const data = await res.json();
//       // Convert fields for frontend
//       const formatted = data.map(article => ({
//         title: article.title,
//         description: article.description,
//         imageUrl: article.image,
//         source: article.source,
//         url: article.link,
//         pubDate: article.pubDate,
//       }));
//       setArticles(formatted);
//     } catch (err) {
//       console.error("Failed to fetch news:", err);
//     }
//   };

//  const fetchBookmarks = () => {
//   try {
//     const saved = JSON.parse(localStorage.getItem("bookmarkedNews")) || [];
//     setBookmarks(saved);
//   } catch (err) {
//     console.error("Failed to load bookmarks from localStorage:", err);
//   }
// };


//   const refreshBookmarks = () => {
//     fetchBookmarks();
//   };

//   const filteredArticles = articles.filter(article => {
//     const matchesCategory = activeCategory === "all" || article.category === activeCategory;
//     const matchesSearch = article.title?.toLowerCase().includes(searchText.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleShowMore = () => {
//     setVisibleCount(prev => prev + 6);
//   };

//   return (
//     <div className="min-h-[100dvh] bg-[#f9f9f9] text-black dark:bg-[#0d1117] dark:text-white">
//       <Navbar
//         activeCategory={activeCategory}
//         showCategory={setActiveCategory}
//         searchText={searchText}
//         setSearchText={setSearchText}
//         selectedLanguage={selectedLanguage}
//         setSelectedLanguage={setSelectedLanguage}
//         isDark={isDark}
//         setIsDark={setIsDark}
//       />

//       <div className="flex justify-center gap-4 py-4 text-white">
//         <button
//           onClick={() => setPage("home")}
//           className={`px-4 py-2 rounded ${
//             page === "home" ? "bg-blue-600 dark:bg-yellow-400 text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
//           }`}
//         >
//           Home
//         </button>
//         <button
//           onClick={() => {
//             setPage("bookmarks");
//           }}
//           className={`px-4 py-2 rounded ${
//             page === "bookmarks" ? "bg-blue-600 dark:bg-yellow-400 text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
//           }`}
//         >
//           Bookmarks
//         </button>
//       </div>

//       <main className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-0 py-8">
//         {page === "home" ? (
//           filteredArticles.length === 0 ? (
//             <p className="text-center text-gray-500 dark:text-gray-200">No articles found.</p>
//           ) : (
//             <>
//               <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
//                 {filteredArticles.slice(0, visibleCount).map((article, idx) => (
//                   <NewsCard
//                     key={idx}
//                     {...article}
//                     isBookmarked={bookmarks.some(b => b.link === article.url)}
//                     refreshBookmarks={refreshBookmarks}
//                   />
//                 ))}
//               </div>

//               <div className="text-center mt-6">
//                 <button
//                   onClick={handleShowMore}
//                   className="font-semibold px-6 py-2 rounded shadow transition-all bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500"
//                 >
//                   Show More
//                 </button>
//               </div>
//             </>
//           )
//         ) : (
//           <BookmarksPage />
//         )}
//       </main>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import NewsCard from "./components/NewsCard";
// import BookmarksPage from "./components/BookmarksPage";

// export default function App() {
//   const [isDark, setIsDark] = useState(true);
//   const [articles, setArticles] = useState([]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [searchText, setSearchText] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("en");
//   const [page, setPage] = useState("home");
//   const [batch, setBatch] = useState(0);

//   // Fetch news and bookmarks on load
//   useEffect(() => {
//     console.log("Calling fetchNews(0)");
//     fetchNews(0,selectedLanguage);
//     fetchBookmarks();
//   }, [selectedLanguage]);

//   useEffect(() => {
//     const root = window.document.documentElement;
//     isDark ? root.classList.add("dark") : root.classList.remove("dark");
//   }, [isDark]);

//  const fetchNews = async (batchNo = 0, lang = selectedLanguage) => {
//   try {
//     const res = await fetch(`http://localhost:5000/api/rss?batch=${batchNo}&lang=${lang}`);
//     const data = await res.json();
//     const formatted = data.map(article => ({
//       title: article.title,
//       description: article.description,
//       imageUrl: article.image,
//       source: article.source,
//       url: article.link,
//       pubDate: article.pubDate,
//     }));

//     if (batchNo === 0) {
//       setArticles(formatted); // reset
//     } else {
//       setArticles(prev => [...prev, ...formatted]);
//     }
//   } catch (err) {
//     console.error("Failed to fetch news:", err);
//   }
// };


//   const fetchBookmarks = () => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("bookmarkedNews")) || [];
//       setBookmarks(saved);
//     } catch (err) {
//       console.error("Failed to load bookmarks from localStorage:", err);
//     }
//   };

//   const refreshBookmarks = () => {
//     fetchBookmarks();
//   };

//   const filteredArticles = articles.filter(article => {
//     const matchesCategory = activeCategory === "all" || article.category === activeCategory;
//     const matchesSearch = article.title?.toLowerCase().includes(searchText.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleShowMore = () => {
//     const nextBatch = batch + 1;
//     fetchNews(nextBatch);
//     setBatch(nextBatch);
//   };

//   return (
//     <div className="min-h-[100dvh] bg-[#f9f9f9] text-black dark:bg-[#0d1117] dark:text-white">
//       <Navbar
//         activeCategory={activeCategory}
//         showCategory={setActiveCategory}
//         searchText={searchText}
//         setSearchText={setSearchText}
//         selectedLanguage={selectedLanguage}
//         setSelectedLanguage={setSelectedLanguage}
//         isDark={isDark}
//         setIsDark={setIsDark}
//       />

//       <div className="flex justify-center gap-4 py-4 text-white">
//         <button
//           onClick={() => setPage("home")}
//           className={`px-4 py-2 rounded ${
//             page === "home" ? "bg-blue-600 dark:bg-yellow-400 text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
//           }`}
//         >
//           Home
//         </button>
//         <button
//           onClick={() => {
//             setPage("bookmarks");
//           }}
//           className={`px-4 py-2 rounded ${
//             page === "bookmarks" ? "bg-blue-600 dark:bg-yellow-400 text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
//           }`}
//         >
//           Bookmarks
//         </button>
//       </div>

//       <main className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-0 py-8">
//         {page === "home" ? (
//           filteredArticles.length === 0 ? (
//             <p className="text-center text-gray-500 dark:text-gray-200">No articles found.</p>
//           ) : (
//             <>
//               <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
//                 {filteredArticles.map((article, idx) => (
//                   <NewsCard
//                     key={idx}
//                     {...article}
//                     isBookmarked={bookmarks.some(b => b.link === article.url)}
//                     refreshBookmarks={refreshBookmarks}
//                   />
//                 ))}
//               </div>

//               <div className="text-center mt-6">
//                 <button
//                   onClick={handleShowMore}
//                   className="font-semibold px-6 py-2 rounded shadow transition-all bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500"
//                 >
//                   Show More
//                 </button>
//               </div>
//             </>
//           )
//         ) : (
//           <BookmarksPage />
//         )}
//       </main>
//     </div>
//   );
// }
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

