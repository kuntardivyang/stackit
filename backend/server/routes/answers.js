const express = require("express");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const auth = require("../middleware/auth");
const { notifyNewAnswer, notifyAnswerAccepted, notifyMentions } = require("../utils/notifications");

const router = express.Router();

// Get answers for a question
router.get("/question/:questionId", async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate("user", "username")
      .sort({ votes: -1, createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post answer to a question (protected route)
router.post("/:questionId", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.questionId).populate("user", "username");
    if (!question) return res.status(404).json({ error: "Question not found" });

    const answer = await Answer.create({
      content,
      user: req.user.id,
      question: req.params.questionId
    });

    // Add answer to question's answers array
    question.answers.push(answer._id);
    await question.save();

    const populatedAnswer = await Answer.findById(answer._id)
      .populate("user", "username");

    // Create notification for question owner
    if (question.user && question.user._id.toString() !== req.user.id) {
      await notifyNewAnswer(
        question.user._id,
        req.user.id,
        question._id,
        answer._id,
        question.title
      );
    }

    // Check for mentions in the answer content
    await notifyMentions(content, req.user.id, question._id, answer._id);

    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update answer (protected route)
router.put("/:id", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ error: "Answer not found" });
    
    if (answer.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }
    
    const updatedAnswer = await Answer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("user", "username");
    
    // Check for mentions in updated content
    if (req.body.content) {
      await notifyMentions(req.body.content, req.user.id, answer.question, answer._id);
    }
    
    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete answer (protected route)
router.delete("/:id", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ error: "Answer not found" });
    
    if (answer.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }
    
    // Remove answer from question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });
    
    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote on answer (protected route)
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ error: "Answer not found" });
    
    if (answer.user.toString() === req.user.id) {
      return res.status(400).json({ error: "Cannot vote on your own answer" });
    }
    
    if (voteType === 'up') {
      answer.votes += 1;
    } else if (voteType === 'down') {
      answer.votes -= 1;
    }
    
    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept answer (protected route - only question owner)
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate("user", "username");
    if (!answer) return res.status(404).json({ error: "Answer not found" });
    
    const question = await Question.findById(answer.question).populate("user", "username");
    if (!question) return res.status(404).json({ error: "Question not found" });
    
    if (question.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Only question owner can accept answers" });
    }
    
    // Unaccept all other answers for this question
    await Answer.updateMany(
      { question: answer.question },
      { isAccepted: false }
    );
    
    // Accept this answer
    answer.isAccepted = true;
    await answer.save();
    
    // Create notification for answer author
    if (answer.user && answer.user._id.toString() !== req.user.id) {
      await notifyAnswerAccepted(
        answer.user._id,
        req.user.id,
        question._id,
        answer._id,
        question.title
      );
    }
    
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 