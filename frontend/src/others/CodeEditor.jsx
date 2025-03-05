import React, { useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-dark.css';

const CodeEditor = ({ code, setCode }) => {
    
    useEffect(() => {
        Prism.highlightAll(); // Ensure Prism is loaded
    }, []);

    const highlightCode = (code) => {
        if (!code) return ''; // Prevent undefined error
        return Prism.highlight(code, Prism.languages.javascript || Prism.languages.plain, 'javascript');
    };

    return (
        <Editor
            value={code || ''} // Ensure value is always a string
            onValueChange={setCode}
            highlight={highlightCode}
            padding={10}
            style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                backgroundColor: '#282c34',
                color: '#ffffff',
                borderRadius: '5px',
                minHeight: '100%',
                width: '100%',
                outline: 'none',
                border: 'none',
            }}
        />
    );
};

export default CodeEditor;
