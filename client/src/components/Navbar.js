import React from "react";
import { categories } from "../constants/categories";
// import { Bookmark } from "./Bookmark";
const Navbar = ({
  activeCategory,
  showCategory,
  searchText,
  setSearchText,
  selectedLanguage,
  setSelectedLanguage,
  isDark,
  setIsDark
}) => {
  return (
    <nav className="bg-[#e4e4e4] dark:bg-[#161b22] shadow-md sticky top-0 z-50 border-b border-gray-300 dark:border-gray-800">
      <div className="w-full flex justify-between items-center px-4 py-3 flex-wrap gap-4">
        <div className="text-4xl px-8 font-bold cursor-pointer" onClick={() => showCategory("all")}>
          NewsXpress
        </div>

        <ul className="flex gap-4">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => showCategory(cat)}
              className={`cursor-pointer capitalize transition-colors ${
                activeCategory === cat
                  ? "text-blue-700 font-semibold dark:text-yellow-300 font-semibold"
                  : "hover:text-blue-600 text-black dark:text-white dark:hover:text-yellow-600"
              }`}
            >
              {cat}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <input
            type="text"
            className="px-3 py-1 rounded border border-gray-300 text-black dark:text-white bg-white dark:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
            placeholder="Search news..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
  className="font-medium px-4 py-1 rounded transition-all bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500"
>
  Search
</button>
          <div className="flex justify-center">
          <select
            className=" text-center w-32 font-medium px-0 py-1 rounded-xl border-collapse border-gray-300  text-white shadow-sm bg-blue-500 dark:bg-yellow-400 dark:text-black"
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
          </div>
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isDark ? "bg-gray-800" : "bg-blue-500"
            }`}
          >
            <span className={`absolute left-1 z-10 text-base ${isDark ? "text-gray-400" : "text-yellow-500 drop-shadow-[0_0_4px_rgba(255,223,0,0.8)]"}`}>
              🌞
            </span>
            <span className={`absolute right-0 z-10 px-1 mb-1 text-base ${isDark ? "text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]" : "text-gray-400"}`}>
              🌙
            </span>
            <div className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
              isDark ? "translate-x-8 bg-white" : "translate-x-0 bg-white"
            }`} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
