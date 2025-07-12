const express = require("express");
const Question = require("../models/Question");
const auth = require("../middleware/auth");
const { notifyMentions } = require("../utils/notifications");

const router = express.Router();

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single question
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("user", "username")
      .populate({
        path: "answers",
        populate: { path: "user", select: "username" }
      });
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create question (protected route)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const question = await Question.create({
      title,
      description,
      tags,
      user: req.user.id
    });

    // Check for mentions in the question description
    await notifyMentions(description, req.user.id, question._id);

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update question (protected route)
router.put("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    
    if (question.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Check for mentions in updated description
    if (req.body.description) {
      await notifyMentions(req.body.description, req.user.id, question._id);
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete question (protected route)
router.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    
    if (question.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 