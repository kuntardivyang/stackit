const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  votes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
  // Track individual votes for better vote management
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Answer", AnswerSchema);
