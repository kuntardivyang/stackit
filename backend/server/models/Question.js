const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tags: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
