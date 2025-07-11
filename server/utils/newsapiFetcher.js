
const axios = require('axios');
require('dotenv').config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function fetchFromNewsAPI({ category, search }) {
  let url = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${NEWS_API_KEY}`;
  if (category) url += `&category=${category}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;

    // console.log("📡 NewsAPI URL:", url);
    const response = await axios.get(url);
    return response.data.articles || [];
  
}

module.exports = fetchFromNewsAPI;
