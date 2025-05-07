import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

const CodeEditor = ({ code, setCode }) => {
  const highlight = (code) => {
    if (!Prism.languages.javascript) {
      console.warn('PrismJS JavaScript language definition not loaded');
      return code;
    }
    return Prism.highlight(code, Prism.languages.javascript, 'javascript');
  };

  return (
    <div className="w-full h-full rounded-xl flex flex-col bg-[#1e1e1e] text-white font-mono overflow-hidden">
      {/* Top Toolbar (like VS Code tab) */}
      <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-[#444]">
        <span className="text-sm font-semibold text-gray-200">index.js</span>
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto text-sm leading-relaxed">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={highlight}
          padding={16}
          className="outline-none min-h-full whitespace-pre"
          style={{
            fontFamily: '"Fira Code", monospace',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;