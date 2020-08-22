var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  lists: [{ title: String, tickers: [] }],
});

module.exports = mongoose.model('User', userSchema);
