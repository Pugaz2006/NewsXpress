import React, { useState, useEffect } from "react";

const NewsCard = ({ title, description, imageUrl, source, url, pubDate, isBookmarked, refreshBookmarks, hideStar }) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedNews")) || [];
    const exists = saved.some((item) => item.link === url);
    setBookmarked(exists);
  }, [url]);

  const handleBookmarkToggle = (e) => {
  e.preventDefault(); // prevent anchor click

  const saved = JSON.parse(localStorage.getItem("bookmarkedNews")) || [];
  let updated;

  if (!bookmarked) {
    const article = { title, description, image: imageUrl, source, link: url, pubDate };
    // prevent duplicates
    updated = [...saved.filter(n => n.link !== url), article];
    setBookmarked(true);
  } else {
    updated = saved.filter(n => n.link !== url);
    setBookmarked(false);
  }

  localStorage.setItem("bookmarkedNews", JSON.stringify(updated));
  if (refreshBookmarks) refreshBookmarks(); // update App state
};


  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div className="bg-[#e4e4e4] dark:bg-white/10 backdrop-blur-md border border-white/30 rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col">
        {/* Image section */}
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
  src={imageUrl || "/news_img.webp"}
  alt="news"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/news_img.webp";
  }}
  className="w-full h-full object-cover"
/>

        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold line-clamp-2 min-h-[2.75em] text-black dark:text-white">
              {title}
            </h2>
            {!hideStar && (
              <button
                // onClick={handleBookmarkToggle,alert("hi")}
                onClick={(e) => {
                          handleBookmarkToggle(e);
                          if(!bookmarked)alert("Added to bookmark");
                        }}

                className="text-2xl transition-colors"
                title={bookmarked ? "Remove bookmark" : "Add to bookmarks"}
              >
                <span
                  className={`transition-colors ${
                    bookmarked
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-yellow-400"
                  }`}
                >
                  ★
                </span>
              </button>
            )}
          </div>

          {/* PubDate */}
          {pubDate && (
            <div className="text-xs text-gray-400 mb-2">
              🗓️{" "}
              {new Date(pubDate).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3 min-h-[4.5em]">
            {description}
          </p>

          {/* Source */}
          <div className="text-xs text-gray-500 mt-auto">Source: {source}</div>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
