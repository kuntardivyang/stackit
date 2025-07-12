const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["answer", "comment", "mention", "vote", "accept"],
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer"
    },
    content: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema); 