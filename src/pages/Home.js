import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Clock, User, Tag, Trash2, Edit } from 'lucide-react';
import { fetchQuestions, deleteQuestion } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('');
  const [user, setUser] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  useEffect(() => {
    loadQuestions();
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetchQuestions();
      setQuestions(response.data);
    } catch (error) {
      toast.error('Failed to load questions');
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!user) {
      toast.error('Please log in to delete questions');
      return;
    }

    const question = questions.find(q => q._id === questionId);
    if (!question || question.user._id !== user._id) {
      toast.error('Only the question owner can delete it');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingQuestion(questionId);
      await deleteQuestion(questionId);
      setQuestions(questions.filter(q => q._id !== questionId));
      toast.success('Question deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete question');
    } finally {
      setDeletingQuestion(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredAndSortedQuestions = questions
    .filter(question => 
      !filterTag || question.tags.includes(filterTag)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostAnswers':
          return (b.answers?.length || 0) - (a.answers?.length || 0);
        case 'mostViewed':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-[#493222] py-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">All Questions</h1>
          <p className="text-white mt-2">
            {filteredAndSortedQuestions.length} questions
          </p>
        </div>
        <Link
          to="/ask"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ask Question
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-white">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#493222] bg-[#493222] text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#cba990]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostAnswers">Most Answers</option>
            <option value="mostViewed">Most Viewed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-white">Filter by tag:</label>
          <input
            type="text"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            placeholder="Enter tag name..."
            className="border border-[#493222] bg-[#493222] text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#cba990]"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredAndSortedQuestions.map((question) => (
          <div key={question._id} className="border-b border-[#493222] pb-6">
            <div className="flex items-start space-x-4">
              {/* Stats */}
              <div className="flex flex-col items-center space-y-1 min-w-[80px]">
                <div className="text-lg font-semibold text-white">
                  {question.answers?.length || 0}
                </div>
                <div className="text-xs text-white">answers</div>
                <div className="text-lg font-semibold text-white">
                  {question.views || 0}
                </div>
                <div className="text-xs text-white">views</div>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    to={`/question/${question._id}`}
                    className="text-xl font-semibold text-white hover:text-[#cba990] transition-colors"
                  >
                    {question.title}
                  </Link>
                  
                  {/* Question Actions */}
                  {user && question.user._id === user._id && (
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/edit-question/${question._id}`}
                        className="p-1 text-white hover:text-[#cba990] hover:bg-[#493222] rounded transition-colors"
                        title="Edit question"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteQuestion(question._id)}
                        disabled={deletingQuestion === question._id}
                        className="p-1 text-white hover:text-red-400 hover:bg-[#493222] rounded transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div 
                  className="mt-2 text-white line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {question.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                      onClick={() => setFilterTag(tag)}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center space-x-4 mt-3 text-sm text-white">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{question.user?.username || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(question.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{question.answers?.length || 0} answers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedQuestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white text-lg">No questions found.</p>
          {filterTag && (
            <button
              onClick={() => setFilterTag('')}
              className="mt-2 text-[#cba990] hover:text-white"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home; 