import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Home, ChevronRight, Search, MessageSquare, Clock } from 'lucide-react';
import { fetchAllTags } from '../services/api';
import toast from 'react-hot-toast';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // popular, name, newest

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTags();
      setTags(response.data);
    } catch (error) {
      toast.error('Failed to load tags');
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredAndSortedTags = tags
    .filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.count - a.count;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.lastUsed || 0) - new Date(a.lastUsed || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="border-b border-[#493222] py-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm mb-6">
        <Link to="/" className="flex items-center text-[#cba990] hover:text-white transition-colors">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-[#cba990]" />
        <span className="text-white">Tags</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tags</h1>
        <p className="text-[#cba990]">
          A tag is a keyword or label that categorizes your question with other, similar questions.
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2 flex-1 min-w-64">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#cba990] w-4 h-4" />
            <input
              type="text"
              placeholder="Filter by tag name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#493222] bg-[#493222] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26c0c] placeholder-[#cba990]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-white">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#493222] bg-[#493222] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f26c0c]"
          >
            <option value="popular">Popular</option>
            <option value="name">Name</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTags.map((tag) => (
          <div key={tag.name} className="bg-[#493222] rounded-lg p-6 border border-[#cba990] hover:border-[#f26c0c] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Link
                to={`/?tag=${encodeURIComponent(tag.name)}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f26c0c] text-white hover:bg-[#e55a00] transition-colors"
              >
                <Tag className="w-4 h-4 mr-1" />
                {tag.name}
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#cba990]">Questions:</span>
                <span className="text-white font-semibold">{tag.count}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#cba990]">Last used:</span>
                <span className="text-white">{formatDate(tag.lastUsed)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#cba990]">
              <Link
                to={`/?tag=${encodeURIComponent(tag.name)}`}
                className="text-[#f26c0c] hover:text-white text-sm font-medium transition-colors"
              >
                View questions with this tag →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedTags.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-[#cba990] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchQuery ? 'No tags found' : 'No tags available'}
          </h3>
          <p className="text-[#cba990] mb-4">
            {searchQuery 
              ? `No tags match "${searchQuery}". Try a different search term.`
              : 'Tags will appear here once questions are created with tags.'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#f26c0c] hover:text-white transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      {filteredAndSortedTags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[#493222]">
          <div className="text-center">
            <p className="text-[#cba990]">
              Showing {filteredAndSortedTags.length} of {tags.length} tags
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags; 