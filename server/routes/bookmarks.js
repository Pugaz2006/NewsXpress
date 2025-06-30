const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");

// Get all bookmarks
router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// Add new bookmark
router.post("/", async (req, res) => {
  const { title, description, imageUrl, source, url } = req.body;
  try {
    const existing = await Bookmark.findOne({ url });
    if (existing) return res.json(existing);

    const newBookmark = new Bookmark({ title, description, imageUrl, source, url });
    const saved = await newBookmark.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save bookmark" });
  }
});

// Delete bookmark by ID
router.delete("/:id", async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
});

module.exports = router;
