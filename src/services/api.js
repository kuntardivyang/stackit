// /services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// Questions API
export const fetchQuestions = () => api.get('/questions');
export const fetchQuestion = (id) => api.get(`/questions/${id}`);
export const postQuestion = (questionData) => api.post('/questions', questionData);
export const updateQuestion = (id, questionData) => api.put(`/questions/${id}`, questionData);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);
export const fetchAllTags = () => api.get('/questions/tags/all');

// Answers API
export const fetchAnswers = (questionId) => api.get(`/answers/question/${questionId}`);
export const postAnswer = (questionId, answerData) => api.post(`/answers/${questionId}`, answerData);
export const updateAnswer = (id, answerData) => api.put(`/answers/${id}`, answerData);
export const deleteAnswer = (id) => api.delete(`/answers/${id}`);
export const voteAnswer = (id, voteType) => api.post(`/answers/${id}/vote`, { voteType });
export const acceptAnswer = (id) => api.post(`/answers/${id}/accept`);

// Notifications API
export const fetchNotifications = () => api.get('/notifications');
export const fetchUnreadCount = () => api.get('/notifications/unread-count');
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.patch('/notifications/mark-all-read');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// Comments API
export const fetchComments = (answerId) => api.get(`/comments/answer/${answerId}`);
export const postComment = (commentData) => api.post('/comments', commentData);
export const updateComment = (id, commentData) => api.put(`/comments/${id}`, commentData);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
export const voteComment = (id, voteType) => api.post(`/comments/${id}/vote`, { voteType });

export default api;
