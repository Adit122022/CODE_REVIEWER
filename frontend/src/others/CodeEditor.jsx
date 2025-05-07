import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { debounce } from 'lodash';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CodeEditor = ({ code, setCode }) => {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",  // Recommended for code completion
    generationConfig: {
      maxOutputTokens: 100,
    }
  });

  const suggestionCache = new Map();
  let lastRequestTime = 0;
  const REQUEST_DELAY = 2000;

  const fetchAISuggestions = debounce(async () => {
    if (!editorRef.current || !monacoRef.current) return { suggestions: [] };

    const editor = editorRef.current;
    const editorModel  = editor.getModel();
    const position = editor.getPosition();
    
    if (!editorModel  || !position) return { suggestions: [] };

    const currentCode = editorModel.getValue();
    const cursorOffset = editorModel.getOffsetAt(position);
    const prefix = currentCode.substring(0, cursorOffset);
    
    if (suggestionCache.has(prefix)) {
      return { suggestions: suggestionCache.get(prefix) };
    }

    const now = Date.now();
    if (now - lastRequestTime < REQUEST_DELAY) {
      return { suggestions: [] };
    }
    lastRequestTime = now;

    try {
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: `Complete this JavaScript code:\n\n${prefix}` }]
        }]
      });
      
      const completion = (await result.response).text();
      const suggestion = {
        label: completion.trim().slice(0, 50),
        kind: monacoRef.current.languages.CompletionItemKind.Snippet,
        insertText: completion.trim(),
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
        detail: 'AI Suggestion'
      };
      
      suggestionCache.set(prefix, [suggestion]);
      setTimeout(() => suggestionCache.delete(prefix), 30000);
      
      return { suggestions: [suggestion] };
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return { suggestions: [] };
    }
  }, 500);

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;

    // Configure JavaScript support
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true
    });

    // Register completion provider
    monaco.languages.registerCompletionItemProvider('javascript', {
      triggerCharacters: ['.', ' ', '\n', '('],
      provideCompletionItems: async () => {
        return await fetchAISuggestions();
      }
    });
  };

  return (
    <div className="w-full h-full rounded-xl flex flex-col bg-[#1e1e1e] text-white font-mono overflow-hidden">
      <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-[#444]">
        <span className="text-sm font-semibold text-gray-200">index.js</span>
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto mt-2">
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
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            suggest: {
              showWords: false,
              showSnippets: true,
              showIcons: false
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true
            }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;