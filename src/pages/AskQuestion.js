import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postQuestion } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import TagInput from '../components/TagInput';
import { Home, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to ask a question');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (tags.length === 0) {
      toast.error('Please add at least one tag');
      return;
    }

    try {
      setLoading(true);
      await postQuestion({ title, description, tags });
      toast.success('Question posted successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#231810] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm mb-6">
              <Link to="/" className="flex items-center text-[#cba990] hover:text-white transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-[#cba990]" />
              <Link to="/" className="text-[#cba990] hover:text-white transition-colors">
                Questions
              </Link>
              <ChevronRight className="w-4 h-4 text-[#cba990]" />
              <span className="text-white">Ask Question</span>
            </nav>

            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Ask a public question
              </p>
            </div>
            
            <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-left">
              Share your knowledge and help others learn
            </p>

            <p className="text-white text-left text-base font-normal leading-relaxed px-4 pb-4">
              Asking a great question helps you get great answers faster. Provide context, share what you've tried, and be as clear as possible — your future self and others will thank you!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2 text-left">Title *</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Be specific and imagine you're asking a question to another person"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#493222] focus:border-none h-14 placeholder:text-[#cba990] p-4 text-base font-normal leading-normal"
                    maxLength={300}
                  />
                  <p className="text-[#cba990] text-sm mt-1 text-left">
                    {title.length}/300 characters
                  </p>
                </label>
              </div>

              {/* Description */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2 text-left">Description *</p>
                  <div className="bg-[#493222] rounded-xl overflow-hidden">
                    <RichTextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Include all the information someone would need to answer your question"
                    />
                  </div>
                </label>
              </div>

              {/* Tags */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2 text-left">Tags *</p>
                  <div className="bg-[#493222] rounded-xl p-4">
                    <TagInput
                      tags={tags}
                      onChange={setTags}
                      placeholder="Add tags like 'react', 'javascript', 'nodejs'..."
                    />
                  </div>
                  <p className="text-[#cba990] text-sm mt-1 text-left">
                    Add up to 5 tags to help others find your question
                  </p>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex px-4 py-3 justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f26c0c] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">
                    {loading ? 'Posting...' : 'Post your question'}
                  </span>
                </button>
              </div>
            </form>

            {/* Guidelines */}
            <div className="mt-8 px-4">
              <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
                Steps to write a good question
              </h3>
              <p className="text-white text-base font-normal leading-normal pb-3 pt-1">
                Your question should be clear, concise, and to the point. It should provide enough context for others to understand the problem without being overly verbose. Use proper grammar and spelling to ensure readability.
              </p>
              <ul className="text-white text-sm space-y-2 mt-4">
                <li className="flex items-start">
                  <span className="text-[#f26c0c] mr-2">•</span>
                  Be specific and provide enough context
                </li>
                <li className="flex items-start">
                  <span className="text-[#f26c0c] mr-2">•</span>
                  Include code examples if relevant
                </li>
                <li className="flex items-start">
                  <span className="text-[#f26c0c] mr-2">•</span>
                  Explain what you've tried and what didn't work
                </li>
                <li className="flex items-start">
                  <span className="text-[#f26c0c] mr-2">•</span>
                  Use clear, descriptive language
                </li>
                <li className="flex items-start">
                  <span className="text-[#f26c0c] mr-2">•</span>
                  Add relevant tags to help others find your question
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion; 