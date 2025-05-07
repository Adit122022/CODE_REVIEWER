import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import "remixicon/fonts/remixicon.css";
import CodeEditor from "../others/CodeEditor";
import Background from "../Background/Background";
import Conversation from "../others/Conversation";
import CodeReviewDisplay from "../others/CodeReviewDisplay";

const Project = () => {
  const { projectId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [sizes, setSizes] = useState({
    chat: 1,
    code: 400,
    review: 200
  });
  const messagesEndRef = useRef(null);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onResize = (panel, size) => {
    setSizes(prev => ({
      ...prev,
      [panel]: size.height
    }));
  };

  const GenAiReview = async () => {
    if (!code.trim()) {
      setReview({
        error: "Please write some code first before generating a review"
      });
      return;
    }

    setIsGeneratingReview(true);
    try {
      const response = await fetch('http://localhost:3000/v1/api/project/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Changed to json() since your API returns JSON
      setReview({
        ...data, // Spread the entire response data
        raw: data.data // Store the raw text in the raw property
      });
    } catch (error) {
      console.error('Error generating review:', error);
      setReview({
        error: "Failed to generate review. Please try again."
      });
    } finally {
      setIsGeneratingReview(false);
    }
  };

  // Helper functions to parse AI response
  const extractRating = (text, section) => {
    const regex = new RegExp(`${section}:\s*([0-9.]+)`);
    const match = text.match(regex);
    return match ? match[1] : "N/A";
  };

  const extractSection = (text, section) => {
    const regex = new RegExp(`${section}:(.*?)(?=\\n\\d+\\.|\\n\\w+:|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : "No suggestions provided";
  };

  const saveProject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      // Show success feedback
      setMessages(prev => [...prev, {
        sender: "ai",
        content: "Project saved successfully!"
      }]);
    } catch (error) {
      console.error('Error saving project:', error);
      setMessages(prev => [...prev, {
        sender: "ai",
        content: "Failed to save project. Please try again."
      }]);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-x-hidden overflow-y-scroll">
      <Background />
      
      <main className="relative z-10 w-full h-full p-4 md:p-6 flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <Link to="/" className="text-white hover:text-blue-400 transition-colors p-1">
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white ml-2">
              <span className="text-blue-400">Project #{projectId.slice(0, 6)}</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <button 
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white transition-all text-sm sm:text-base"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              <i className="ri-share-line"></i>
              <span>Share</span>
            </button>
            <button 
              onClick={saveProject}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white transition-all text-sm sm:text-base"
            >
              <i className="ri-save-line"></i>
              <span>Save</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 overflow-hidden">
          {/* Chat Section */}
          <div className="h-full">
            <Conversation 
              messages={messages} 
              appendMessage={(msg) => setMessages(prev => [...prev, msg])}
              socket={socket}
            />
          </div>

          {/* Code and Review Sections */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 h-full">
            {/* Code Editor Section */}
            <Resizable
              height={sizes.code}
              width={Infinity}
              onResize={(e, { size }) => onResize('code', size.height)}
              resizeHandles={['s']}
              minConstraints={[Infinity, 150]}
              maxConstraints={[Infinity, window.innerHeight * 0.7]}
            >
              <div 
                className="bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col h-full"
                style={{ height: sizes.code }}
              >
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <i className="ri-file-code-line text-blue-400"></i>
                    <span className="text-sm font-mono text-gray-300">editor.js</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                </div>
                <div className="flex-1">
                  <CodeEditor code={code} setCode={setCode} />
                </div>
              </div>
            </Resizable>

            {/* Review Section */}
            <Resizable
              height={sizes.review}
              width={Infinity}
              onResize={(e, { size }) => onResize('review', size.height)}
              resizeHandles={['s']}
              minConstraints={[Infinity, 120]}
              maxConstraints={[Infinity, window.innerHeight * 0.5]}
            >
              <div 
                className="bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col h-full"
                style={{ height: sizes.review }}
              >
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <i className="ri-feedback-line text-yellow-400"></i>
                    <span className="text-sm font-medium text-white">Code Review</span>
                  </div>
                  <button 
                    onClick={GenAiReview}
                    disabled={isGeneratingReview}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                      isGeneratingReview 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-600/80 hover:bg-yellow-600 text-white'
                    } transition-all`}
                  >
                    <i className={`ri-ai-generate ${isGeneratingReview ? 'animate-pulse' : ''}`}></i>
                    {isGeneratingReview ? 'Generating...' : 'Generate Review'}
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3">
                  {review?.error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <i className="ri-error-warning-line text-red-400 text-3xl mb-3"></i>
                      <p className="text-red-400 font-medium">{review.error}</p>
                      <p className="text-gray-400 text-sm mt-1">Please try again</p>
                    </div>
                  ) : review?.raw ? (
                    <CodeReviewDisplay reviewData={{ success: true, data: review.raw }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="bg-gray-800/50 p-4 rounded-full mb-4">
                        <i className="ri-code-review-line text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-gray-300 font-medium mb-1">No Review Generated</h3>
                      <p className="text-gray-500 text-sm max-w-xs">
                        Click "Generate Review" to get AI feedback on your code
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Resizable>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Project;