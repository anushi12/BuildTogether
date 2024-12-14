const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true },
  finished_on: { type: Date, required: true },
});

const History = mongoose.model('History', historySchema);
module.exports = History;