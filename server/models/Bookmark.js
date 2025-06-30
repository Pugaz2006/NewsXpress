const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  source: String,
  url: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("Bookmark", BookmarkSchema);
