import { categories } from "../constants/categories";

export const generateDummyNews = (count, offset = 0, category = null) => {
  return Array(count).fill(0).map((_, i) => {
    const newsCategory = category ?? categories[Math.floor(Math.random() * categories.length)];

    return {
      title: `News ${i + offset + 1}`,
      description: `This is a ${newsCategory} generated news article.`,
      imageUrl: "https://via.placeholder.com/400x200",
      source: "NewsBot",
      category: newsCategory,
    };
  });
};
