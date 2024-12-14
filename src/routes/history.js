const express = require("express");
const { userAuth } = require("../middlewares/auth");
const History = require('../models/history'); 

const historyRouter = express.Router();

historyRouter.post('/books', userAuth, async (req, res) => {
  const { userId } = req.user;
  const { title, author, rating, finished_on } = req.body;

  if (!title || !author || !rating || !finished_on) {
    return res.status(400).json({ error: "Missing required fields: title, author, rating, and finished_on" });
  }

  try {
    const newBook = new History({
      user: userId,
      title,
      author,
      rating,
      finished_on,
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book", details: error.message });
  }
});

historyRouter.get('/books', userAuth, async (req, res) => {
  const { userId } = req.user; 

  try {
    const userHistory = await History.find({ user: userId });
    res.status(200).json(userHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history", details: error.message });
  }
});


historyRouter.get('/books/:title', userAuth, async (req, res) => {
  const { userId } = req.user;
  const { title } = req.params;

  try {
    const book = await History.findOne({
      user: userId,
      title: { $regex: new RegExp(`^${title}$`, 'i') },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book", details: error.message });
  }
});

historyRouter.put('/books/:title', userAuth, async (req, res) => {
  const { userId } = req.user;
  const { title } = req.params;
  const { rating, finished_on } = req.body;

  try {
    const book = await History.findOneAndUpdate(
      { user: userId, title: { $regex: new RegExp(`^${title}$`, 'i') } },
      { rating, finished_on },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ error: "Failed to update book", details: error.message });
  }
});

module.exports = historyRouter;