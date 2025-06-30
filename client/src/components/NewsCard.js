import React from "react";

const NewsCard = ({ title, description, imageUrl, source }) => {
  return (
    <div className=" bg-white/30 backdrop-blur-md border border-white/30
 rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
      <img
        src={imageUrl}
        alt="news"
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-white mb-2">{source}</p>
      <p className="text-white text-sm">{description}</p>
    </div>
  );
};

export default NewsCard;
