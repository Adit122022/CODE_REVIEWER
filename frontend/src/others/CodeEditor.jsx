import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode }) => {
  // Handle editor mount to configure Monaco (optional)
  const handleEditorDidMount = (editor, monaco) => {
    // Enable JavaScript IntelliSense
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      allowJs: true,
    });
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
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={setCode}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 14,
            padding: { top: 16, bottom: 16 },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            suggest: {
              showSnippets: true,
              showWords: true,
              showKeywords: true,
            },
            inlineSuggest: { enabled: true },
            formatOnType: true,
            autoClosingBrackets: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;