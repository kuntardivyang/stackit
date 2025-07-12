const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reputation: { type: Number, default: 0 },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    // Track user votes to prevent multiple voting
    answerVotes: [{
      answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
      voteType: { type: String, enum: ['up', 'down'], required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    commentVotes: [{
      comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
      voteType: { type: Number, enum: [1, -1], required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", UserSchema);
