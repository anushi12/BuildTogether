const mongoose = require("mongoose");


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    enum: [
      "Fiction",
      "Non-Fiction",
      "Mystery",
      "Fantasy",
      "Science Fiction",
      "Biography",
      "Historical",
      "Romance",
      "Horror",
      "Other",
    ], 
    default: "Other",
  },
  published_year: {
    type: Number,
    min: 1450, 
    max: new Date().getFullYear(), 
  },
  pages: {
    type: Number,
    min: 1, 
  },
  finished_on: {
    type: Date,
    default: null, 
  },
  is_read: {
    type: Boolean,
    default: false, 
  },
  rating: {
    type: Number,
    min: 0,
    max: 5, 
    default: null, 
  },
  summary: {
    type: String,
    maxlength: 1000,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now, 
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
