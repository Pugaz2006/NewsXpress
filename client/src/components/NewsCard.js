import React, { useState, useEffect } from "react";

const NewsCard = ({ title, description, imageUrl, source, url }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null); // track Mongo ID for delete

  useEffect(() => {
    // Check if this article is already bookmarked
    fetch("http://localhost:5000/api/bookmarks")
      .then(res => res.json())
      .then(data => {
        const match = data.find(item => item.url === url);
        if (match) {
          setBookmarked(true);
          setBookmarkId(match._id);
        }
      });
  }, [url]);

  const handleBookmarkToggle = async () => {
    if (!bookmarked) {
      // Add to bookmarks
      try {
        const res = await fetch("http://localhost:5000/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, imageUrl, source, url }),
        });
        const data = await res.json();
        setBookmarkId(data._id);
        setBookmarked(true);
      } catch (err) {
        console.error("Bookmark failed:", err);
      }
    } else {
      // Remove from bookmarks
      try {
        await fetch(`http://localhost:5000/api/bookmarks/${bookmarkId}`, {
          method: "DELETE",
        });
        setBookmarked(false);
        setBookmarkId(null);
      } catch (err) {
        console.error("Unbookmark failed:", err);
      }
    }
  };

  return (
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/30 rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
      <img src={imageUrl} alt="news" className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <button
            onClick={handleBookmarkToggle}
            className="text-2xl transition-colors"
            title={bookmarked ? "Remove bookmark" : "Add to bookmarks"}
          >
            <span
              className={`transition-colors ${
                bookmarked ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              ★
            </span>
          </button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{description}</p>
        <div className="text-xs text-gray-500">Source: {source}</div>
      </div>
    </div>
  );
};

export default NewsCard;
