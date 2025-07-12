// /services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth endpoints
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Question endpoints
export const fetchQuestions = () => API.get('/questions');
export const fetchQuestion = (id) => API.get(`/questions/${id}`);
export const postQuestion = (data) => API.post('/questions', data);
export const updateQuestion = (id, data) => API.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => API.delete(`/questions/${id}`);

// Answer endpoints
export const fetchAnswers = (questionId) => API.get(`/answers/question/${questionId}`);
export const postAnswer = (questionId, data) => API.post(`/answers/${questionId}`, data);
export const updateAnswer = (id, data) => API.put(`/answers/${id}`, data);
export const deleteAnswer = (id) => API.delete(`/answers/${id}`);
export const voteAnswer = (id, voteType) => API.post(`/answers/${id}/vote`, { voteType });
export const acceptAnswer = (id) => API.post(`/answers/${id}/accept`);

// User endpoints
export const fetchUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);

// Tag endpoints
export const fetchTags = () => API.get('/tags');
export const fetchQuestionsByTag = (tag) => API.get(`/tags/${tag}/questions`);
