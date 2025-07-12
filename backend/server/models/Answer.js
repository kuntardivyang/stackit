const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  votes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Answer", AnswerSchema);
