const Notification = require("../models/Notification");

// Create a notification
const createNotification = async (recipientId, senderId, type, content, link, questionId = null, answerId = null) => {
  try {
    // Don't create notification if sender is the same as recipient
    if (senderId.toString() === recipientId.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
      link,
      question: questionId,
      answer: answerId
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Create notification for new answer
const notifyNewAnswer = async (questionOwnerId, answerAuthorId, questionId, answerId, questionTitle) => {
  const content = `answered your question "${questionTitle}"`;
  const link = `/question/${questionId}`;
  
  return await createNotification(
    questionOwnerId,
    answerAuthorId,
    "answer",
    content,
    link,
    questionId,
    answerId
  );
};

// Create notification for answer acceptance
const notifyAnswerAccepted = async (answerAuthorId, questionOwnerId, questionId, answerId, questionTitle) => {
  const content = `accepted your answer on "${questionTitle}"`;
  const link = `/question/${questionId}`;
  
  return await createNotification(
    answerAuthorId,
    questionOwnerId,
    "accept",
    content,
    link,
    questionId,
    answerId
  );
};

// Create notification for mentions (@username)
const notifyMention = async (mentionedUserId, senderId, questionId, answerId, content) => {
  const link = answerId ? `/question/${questionId}` : `/question/${questionId}`;
  
  return await createNotification(
    mentionedUserId,
    senderId,
    "mention",
    `mentioned you: ${content.substring(0, 100)}...`,
    link,
    questionId,
    answerId
  );
};

// Extract mentions from text (@username)
const extractMentions = (text) => {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

// Create notifications for all mentions in text
const notifyMentions = async (text, senderId, questionId, answerId = null) => {
  const mentions = extractMentions(text);
  const User = require("../models/User");
  
  for (const username of mentions) {
    try {
      const mentionedUser = await User.findOne({ username });
      if (mentionedUser) {
        await notifyMention(mentionedUser._id, senderId, questionId, answerId, text);
      }
    } catch (error) {
      console.error(`Error creating mention notification for ${username}:`, error);
    }
  }
};

module.exports = {
  createNotification,
  notifyNewAnswer,
  notifyAnswerAccepted,
  notifyMention,
  extractMentions,
  notifyMentions
}; 