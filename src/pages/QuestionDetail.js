import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, User, Tag, ThumbsUp, ThumbsDown, CheckCircle, Trash2, Edit } from 'lucide-react';
import { fetchQuestion, postAnswer, voteAnswer, acceptAnswer, deleteQuestion, deleteAnswer } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import toast from 'react-hot-toast';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAnswer, setDeletingAnswer] = useState(null);

  useEffect(() => {
    loadQuestion();
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, [id]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetchQuestion(id);
      setQuestion(response.data);
      setAnswers(response.data.answers || []);
    } catch (error) {
      toast.error('Failed to load question');
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to post an answer');
      navigate('/login');
      return;
    }

    if (!newAnswer.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    try {
      setSubmitting(true);
      const response = await postAnswer(id, { content: newAnswer });
      setAnswers([...answers, response.data]);
      setNewAnswer('');
      toast.success('Answer posted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (answerId, voteType) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      await voteAnswer(answerId, voteType);
      // Reload answers to get updated votes
      loadQuestion();
      toast.success('Vote recorded!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to vote');
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    if (!user || question.user._id !== user._id) {
      toast.error('Only the question owner can accept answers');
      return;
    }

    try {
      await acceptAnswer(answerId);
      loadQuestion();
      toast.success('Answer accepted!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to accept answer');
    }
  };

  const handleDeleteQuestion = async () => {
    if (!user || question.user._id !== user._id) {
      toast.error('Only the question owner can delete it');
      return;
    }

    try {
      await deleteQuestion(id);
      toast.success('Question deleted successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete question');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!user) {
      toast.error('Please log in to delete answers');
      return;
    }

    const answer = answers.find(a => a._id === answerId);
    if (!answer || answer.user._id !== user._id) {
      toast.error('Only the answer author can delete it');
      return;
    }

    try {
      setDeletingAnswer(answerId);
      await deleteAnswer(answerId);
      setAnswers(answers.filter(a => a._id !== answerId));
      toast.success('Answer deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete answer');
    } finally {
      setDeletingAnswer(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const getUserAvatar = (username) => {
    // Generate a simple avatar based on username
    const colors = ['#f26c0c', '#cba990', '#493222', '#8B4513', '#D2691E'];
    const color = colors[username.length % colors.length];
    const initials = username.substring(0, 2).toUpperCase();
    
    return (
      <div 
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0 flex items-center justify-center text-white text-sm font-bold"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#231810] dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="animate-pulse">
                <div className="h-8 bg-[#493222] rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-[#493222] rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-[#493222] rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#231810] dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Question not found</h2>
                <button
                  onClick={() => navigate('/')}
                  className="text-[#f26c0c] hover:text-white"
                >
                  Back to questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#231810] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Question */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                  {question.title}
                </h1>
                
                {/* Question Actions */}
                {user && question.user._id === user._id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit-question/${id}`)}
                      className="p-2 text-[#cba990] hover:text-[#f26c0c] hover:bg-[#493222] rounded-xl transition-colors"
                      title="Edit question"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-2 text-[#cba990] hover:text-red-400 hover:bg-[#493222] rounded-xl transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-[#cba990] text-sm font-normal leading-normal pb-3 pt-1 px-4">
                Asked by {question.user?.username || 'Anonymous'} {formatDate(question.createdAt)}
              </p>

              {/* Tags */}
              <div className="flex gap-3 p-3 flex-wrap pr-4">
                {question.tags?.map((tag, index) => (
                  <div key={index} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#493222] pl-4 pr-4">
                    <p className="text-white text-sm font-medium leading-normal">{tag}</p>
                  </div>
                ))}
              </div>

              <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
                {question.description.replace(/<[^>]*>/g, '')}
              </p>
            </div>

            {/* Answers */}
            <div className="mb-8">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                {answers.length} Answer{answers.length !== 1 ? 's' : ''}
              </h2>

              {answers.length === 0 ? (
                <div className="text-center py-8 text-[#cba990]">
                  <p>No answers yet. Be the first to answer!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {answers.map((answer) => (
                    <div key={answer._id} className="border-b border-[#493222] pb-6">
                      <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
                        {getUserAvatar(answer.user?.username || 'Anonymous')}
                        <div className="flex h-full flex-1 flex-col items-start justify-start">
                          <div className="flex w-full flex-row items-start justify-start gap-x-3">
                            <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">
                              {answer.user?.username || 'Anonymous'}
                            </p>
                            <p className="text-[#cba990] text-sm font-normal leading-normal">
                              {formatDate(answer.createdAt)}
                            </p>
                          </div>
                          <p className="text-white text-sm font-normal leading-normal mt-2">
                            {answer.content.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Voting */}
                      <div className="flex flex-wrap gap-4 px-4 py-2">
                        <div className="flex items-center justify-center gap-2 px-3 py-2">
                          <button
                            onClick={() => handleVote(answer._id, 'up')}
                            className="text-[#cba990] hover:text-[#f26c0c] transition-colors"
                            disabled={!user}
                          >
                            <ThumbsUp className="w-6 h-6" />
                          </button>
                          <p className="text-[#cba990] text-[13px] font-bold leading-normal tracking-[0.015em]">
                            {answer.votes || 0}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 px-3 py-2">
                          <button
                            onClick={() => handleVote(answer._id, 'down')}
                            className="text-[#cba990] hover:text-[#f26c0c] transition-colors"
                            disabled={!user}
                          >
                            <ThumbsDown className="w-6 h-6" />
                          </button>
                          <p className="text-[#cba990] text-[13px] font-bold leading-normal tracking-[0.015em]">
                            {Math.abs(Math.min(answer.votes || 0, 0))}
                          </p>
                        </div>
                        
                        {/* Accept Answer Button */}
                        {user && question.user._id === user._id && !answer.isAccepted && (
                          <button
                            onClick={() => handleAcceptAnswer(answer._id)}
                            className="text-[#f26c0c] hover:text-white text-sm font-medium px-3 py-2 rounded-full hover:bg-[#493222] transition-colors"
                          >
                            Accept Answer
                          </button>
                        )}

                        {/* Delete Answer Button */}
                        {user && answer.user._id === user._id && (
                          <button
                            onClick={() => handleDeleteAnswer(answer._id)}
                            disabled={deletingAnswer === answer._id}
                            className="p-1 text-[#cba990] hover:text-red-400 hover:bg-[#231810] rounded transition-colors"
                            title="Delete answer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Answer */}
            {user ? (
              <div className="border-t border-[#493222] pt-8">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Answer</p>
                </div>
                <form onSubmit={handleSubmitAnswer}>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1">
                      <div className="bg-[#493222] rounded-xl overflow-hidden">
                        <RichTextEditor
                          value={newAnswer}
                          onChange={setNewAnswer}
                          placeholder="Write your answer here..."
                        />
                      </div>
                    </label>
                  </div>
                  <div className="flex justify-stretch">
                    <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#493222] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        <span className="truncate">Cancel</span>
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f26c0c] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="truncate">
                          {submitting ? 'Posting...' : 'Post Your Answer'}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="border-t border-[#493222] pt-8 text-center">
                <p className="text-[#cba990] mb-4">Please log in to post an answer</p>
                <button
                  onClick={() => navigate('/login')}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f26c0c] text-white text-sm font-bold leading-normal tracking-[0.015em] mx-auto"
                >
                  <span className="truncate">Log In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#493222] rounded-xl p-6 max-w-md w-full mx-4 border border-[#cba990]">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Question</h3>
            <p className="text-[#cba990] mb-6">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-[#cba990] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail; 