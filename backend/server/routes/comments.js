const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Answer = require("../models/Answer");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { createNotification, notifyMentions } = require("../utils/notifications");

// Get comments for an answer
router.get("/answer/:answerId", async (req, res) => {
  try {
    const comments = await Comment.find({ answer: req.params.answerId })
      .populate("user", "username avatar")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

// Create a new comment
router.post("/", auth, async (req, res) => {
  try {
    const { content, answerId, questionId } = req.body;

    if (!content || !answerId || !questionId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: "Comment cannot exceed 500 characters" });
    }

    const comment = new Comment({
      content,
      user: req.user._id,
      answer: answerId,
      question: questionId
    });

    await comment.save();

    // Populate user info for response
    await comment.populate("user", "username avatar");

    // Create notification for answer author
    const answer = await Answer.findById(answerId).populate("user");
    if (answer && answer.user._id.toString() !== req.user._id.toString()) {
      await createNotification(
        answer.user._id,
        req.user._id,
        "comment",
        `${req.user.username} commented on your answer`,
        `/question/${questionId}`,
        questionId,
        answerId
      );
    }

    // Notify mentioned users in the comment
    await notifyMentions(content, req.user._id, questionId, answerId);

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment" });
  }
});

// Update a comment
router.put("/:id", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: "Comment cannot exceed 500 characters" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.content = content;
    comment.updatedAt = Date.now();

    await comment.save();
    await comment.populate("user", "username avatar");

    res.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
});

// Delete a comment
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
});

// Vote on a comment
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 1 for upvote, -1 for downvote

    if (![1, -1].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot vote on your own comment" });
    }

    const userId = req.user._id;
    const hasUpvoted = comment.upvotes.includes(userId);
    const hasDownvoted = comment.downvotes.includes(userId);

    // Remove existing votes first
    if (hasUpvoted) {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
      comment.votes -= 1;
    }
    if (hasDownvoted) {
      comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId.toString());
      comment.votes += 1;
    }

    // Add new vote
    if (voteType === 1) {
      if (!hasUpvoted) {
        comment.upvotes.push(userId);
        comment.votes += 1;
      }
    } else if (voteType === -1) {
      if (!hasDownvoted) {
        comment.downvotes.push(userId);
        comment.votes -= 1;
      }
    }

    await comment.save();

    // Update user's vote tracking
    await User.findByIdAndUpdate(userId, {
      $pull: { commentVotes: { comment: comment._id } }
    });

    await User.findByIdAndUpdate(userId, {
      $push: { commentVotes: { comment: comment._id, voteType } }
    });

    res.json({ votes: comment.votes });
  } catch (error) {
    console.error("Error voting on comment:", error);
    res.status(500).json({ message: "Error voting on comment" });
  }
});

module.exports = router; 