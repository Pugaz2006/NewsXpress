
import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedNews")) || [];
     if (saved.length > 0) {
    const sizeInBytes = JSON.stringify(saved[0]).length;
    console.log(`First bookmark size: ${sizeInBytes} bytes (${(sizeInBytes/1024).toFixed(2)} KB)`);
  }
    setBookmarks(saved);
  }, []);

  const removeBookmark = (link) => {
    const updated = bookmarks.filter(item => item.link !== link);
    setBookmarks(updated);
    localStorage.setItem("bookmarkedNews", JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔖 Bookmarked News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((item, idx) => (
          <div key={idx} className="relative">
            <NewsCard {...item} hideStar={true} />
            <button
              onClick={() => removeBookmark(item.link)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
              title="Remove Bookmark"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksPage;
