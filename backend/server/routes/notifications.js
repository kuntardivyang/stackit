const express = require("express");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "username")
      .populate("question", "title")
      .populate("answer", "content")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Get unread notifications count
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// Mark notification as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// Mark all notifications as read
router.patch("/mark-all-read", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

// Delete notification
router.delete("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

module.exports = router; 