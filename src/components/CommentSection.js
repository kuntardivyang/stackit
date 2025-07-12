import React, { useState, useEffect } from 'react';
import { fetchComments, postComment } from '../services/api';
import Comment from './Comment';

const CommentSection = ({ answerId, questionId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [answerId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetchComments(answerId);
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newComment.length > 500) return;

    setIsSubmitting(true);
    try {
      const response = await postComment({
        content: newComment,
        answerId,
        questionId
      });
      setComments([...comments, response.data]);
      setNewComment('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpdate = (updatedComment) => {
    setComments(comments.map(comment => 
      comment._id === updatedComment._id ? updatedComment : comment
    ));
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  if (!currentUser) {
    return (
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400 text-sm">
          Please <a href="/login" className="text-blue-400 hover:text-blue-300">login</a> to view and add comments.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Comments List */}
      <div className="mb-4">
        <h4 className="text-white font-medium mb-3">
          Comments ({comments.length})
        </h4>
        
        {isLoading ? (
          <div className="text-gray-400 text-sm">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400 text-sm">No comments yet.</div>
        ) : (
          <div className="space-y-2">
            {comments.map(comment => (
              <Comment
                key={comment._id}
                comment={comment}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {!showCommentForm ? (
        <button
          onClick={() => setShowCommentForm(true)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Add a comment
        </button>
      ) : (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white resize-none"
            rows="3"
            maxLength="500"
            required
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {newComment.length}/500 characters
            </span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowCommentForm(false);
                  setNewComment('');
                }}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentSection; 