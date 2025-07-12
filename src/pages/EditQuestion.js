import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestion, updateQuestion } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import TagInput from '../components/TagInput';
import toast from 'react-hot-toast';

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetchQuestion(id);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setTags(response.data.tags || []);
      } catch (error) {
        toast.error('Failed to load question');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [id, navigate]);

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
      setSubmitting(true);
      await updateQuestion(id, { title, description, tags });
      toast.success('Question updated successfully!');
      navigate(`/question/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update question');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#231810] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white text-left tracking-light text-[32px] font-bold leading-tight min-w-72">
                Edit Question
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-left text-base font-medium leading-normal pb-2">Title *</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Edit your question title"
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
                      placeholder="Edit your question description"
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
                      placeholder="Edit tags like 'react', 'javascript', 'nodejs'..."
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
                  disabled={submitting}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f26c0c] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#493222] text-white text-sm font-bold leading-normal tracking-[0.015em] ml-4"
                >
                  <span className="truncate">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion; 