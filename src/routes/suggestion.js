const express = require("express");
const { userAuth } = require("../middlewares/auth");
const book = require("../models/book");
const historyRouter = require("./history");

const suggestionRouter = express.Router();

suggestionRouter.get("/api/suggest-books", userAuth, async (req, res) => {
  try {
  
    const minRating = parseFloat(req.query.minRating) || 4;

    const suggestedBooks = await book.find({ rating: { $gte: minRating } }).sort({ rating: -1 });

    if (suggestedBooks.length === 0) {
      return res.status(404).json({ message: "No books found with the given rating criteria." });
    }

    res.status(200).json({
      message: "Books suggested based on your rating preference.",
      books: suggestedBooks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching book suggestions." });
  }
});

module.exports = suggestionRouter;
