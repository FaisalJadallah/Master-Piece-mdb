// models/Tournament.js
const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: String,
  date: String,
  players: Number,
  image: String, // Base64 or URL
});

module.exports = mongoose.model("Tournament", tournamentSchema);
