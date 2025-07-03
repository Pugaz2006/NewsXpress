const Bookmark = require('../models/Bookmark');

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ pubDate: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const existing = await Bookmark.findOne({ link: req.body.link });
    if (existing) return res.status(200).json({ message: 'Already bookmarked' });

    const bookmark = new Bookmark(req.body);
    await bookmark.save();

    res.status(201).json({ message: 'Bookmark added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const exists = await Bookmark.findOne({ link: req.body.link });
    if (exists) {
      return res.status(200).json({ message: "Already bookmarked" });
    }

    const bookmark = new Bookmark(req.body);
    await bookmark.save();

    res.status(201).json({ message: 'Bookmark added', _id: bookmark._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
};

