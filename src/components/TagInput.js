import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ tags, onChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="tag-input">
      <div className="flex flex-wrap gap-2 p-2 border border-transparent rounded-xl focus-within:border-[#f26c0c] focus-within:ring-1 focus-within:ring-[#f26c0c]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#f26c0c] text-white"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-white hover:bg-white hover:text-[#f26c0c] focus:outline-none transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-0 outline-none text-sm bg-transparent text-white placeholder:text-[#cba990]"
        />
      </div>
      <p className="mt-1 text-xs text-[#cba990]">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
};

export default TagInput; 