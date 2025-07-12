import React, { useState } from 'react';
import { updateComment, deleteComment, voteComment } from '../services/api';
import QuickAuthModal from './QuickAuthModal';

// Utility to highlight @mentions
function highlightMentions(text) {
  const mentionRegex = /(@[\w]+)/g;
  const parts = text.split(mentionRegex);
  return parts.map((part, i) => {
    if (mentionRegex.test(part)) {
      return <span key={i} className="text-blue-400">{part}</span>;
    }
    return part;
  });
}

const Comment = ({ comment, onUpdate, onDelete, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);

  const handleEdit = async () => {
    if (editContent.trim() === '') return;
    
    try {
      const updatedComment = await updateComment(comment._id, { content: editContent });
      onUpdate(updatedComment);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setIsDeleting(true);
    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      setIsDeleting(false);
    }
  };

  const handleVote = async (voteType) => {
    if (!currentUser) {
      setPendingVote(voteType);
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await voteComment(comment._id, voteType);
      onUpdate({ ...comment, votes: response.data.votes });
    } catch (error) {
      console.error('Error voting on comment:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const handleAuthSuccess = async () => {
    if (pendingVote) {
      try {
        const response = await voteComment(comment._id, pendingVote);
        onUpdate({ ...comment, votes: response.data.votes });
      } catch (error) {
        console.error('Error voting on comment:', error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        }
      }
      setPendingVote(null);
    }
  };

  const canEdit = currentUser && currentUser.id === comment.user._id;
  const canDelete = currentUser && currentUser.id === comment.user._id;

  return (
    <div className="border-l-2 border-gray-600 pl-4 py-2 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white resize-none"
                rows="2"
                maxLength="500"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {editContent.length}/500 characters
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-white text-sm mb-2">{highlightMentions(comment.content)}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleVote(1)}
                      className="hover:text-green-400 transition-colors p-1 rounded"
                      title="Upvote"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l8 8h-6v8h-4v-8H4z"/>
                      </svg>
                    </button>
                    <span className={`text-white ${comment.votes > 0 ? 'text-green-400' : comment.votes < 0 ? 'text-red-400' : ''}`}>
                      {comment.votes}
                    </span>
                    <button
                      onClick={() => handleVote(-1)}
                      className="hover:text-red-400 transition-colors p-1 rounded"
                      title="Downvote"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 20l-8-8h6V4h4v8h6z"/>
                      </svg>
                    </button>
                  </div>
                  <span>by {comment.user.username}</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="text-gray-500">(edited)</span>
                  )}
                </div>
                {(canEdit || canDelete) && (
                  <div className="flex space-x-2">
                    {canEdit && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Auth Modal */}
      <QuickAuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingVote(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Comment; 