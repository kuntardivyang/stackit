import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['emoji'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image',
    'emoji'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[200px]"
      />
      <style jsx>{`
        .rich-text-editor .ql-editor {
          min-height: 200px;
          font-size: 14px;
          line-height: 1.6;
          background-color: #493222;
          color: white;
          border: none;
          border-radius: 0 0 12px 12px;
        }
        .rich-text-editor .ql-toolbar {
          background-color: #493222;
          border: none;
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid #cba990;
        }
        .rich-text-editor .ql-container {
          border: none;
          border-radius: 0 0 12px 12px;
        }
        .rich-text-editor .ql-editor:focus {
          border-color: #f26c0c;
          box-shadow: 0 0 0 3px rgba(242, 108, 12, 0.1);
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #cba990;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #cba990;
        }
        .rich-text-editor .ql-toolbar .ql-picker {
          color: #cba990;
        }
        .rich-text-editor .ql-toolbar .ql-picker-options {
          background-color: #493222;
          border: 1px solid #cba990;
          color: white;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: #f26c0c;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: #f26c0c;
        }
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #f26c0c;
        }
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #f26c0c;
        }
        .rich-text-editor .ql-editor::placeholder {
          color: #cba990;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 