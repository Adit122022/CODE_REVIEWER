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
import axiosInstance from "../../axios/axios";

const Project = () => {
  const { projectId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [activeReviewTab, setActiveReviewTab] = useState("quality");
  const [sizes, setSizes] = useState({
    chat: 1,
    code: 600,
    review: 300
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_SOCKET_IO, { query: { projectId } });
    newSocket.on("message", (msg) => {
      setMessages(prev => [...prev, { sender: "ai", content: msg }]);
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [projectId]);

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
      const response = await axiosInstance.post('project/review', { code });
      setReview({
        ...response.data,
        raw: response.data.data
      });
      setShowReviewPanel(true);
    } catch (error) {
      console.error('Error generating review:', error);
      setReview({
        error: "Failed to generate review. Please try again."
      });
    } finally {
      setIsGeneratingReview(false);
    }
  };

  const saveProject = async () => {
    try {
      const response = await axiosInstance.put(`project/${projectId}`, { code });
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
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <Background />
      
      <main className="relative z-10 w-full h-full p-2 sm:p-4 md:p-6 flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-white hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-gray-800/50"
              aria-label="Back to home"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white ml-2">
              <span className="text-blue-400">Project #{projectId.slice(0, 6)}</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              className="flex items-center gap-1 sm:gap-2 bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-white transition-all text-xs sm:text-sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setMessages(prev => [...prev, { sender: "system", content: "Link copied to clipboard!" }]);
              }}
              aria-label="Share project"
            >
              <i className="ri-share-line"></i>
              <span>Share</span>
            </button>
            <button 
              onClick={saveProject}
              className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-white transition-all text-xs sm:text-sm"
              aria-label="Save project"
            >
              <i className="ri-save-line"></i>
              <span>Save</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 overflow-hidden">
          {/* Chat Section */}
          <div className="h-full">
            <Conversation 
              messages={messages} 
              appendMessage={(msg) => setMessages(prev => [...prev, msg])}
              socket={socket}
            />
          </div>

          {/* Code and Review Sections */}
          <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 md:gap-6 h-full relative">
            {/* Floating Generate Button */}
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
              <button 
                onClick={GenAiReview}
                disabled={isGeneratingReview}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${
                  isGeneratingReview 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-600/80 hover:bg-yellow-600 text-white shadow-md'
                } transition-all`}
                aria-label="Generate code review"
              >
                <i className={`ri-ai-generate ${isGeneratingReview ? 'animate-pulse' : ''}`}></i>
                <span className="hidden sm:inline">{isGeneratingReview ? 'Generating...' : 'Generate Review'}</span>
                <span className="sm:hidden">{isGeneratingReview ? '...' : 'Review'}</span>
              </button>
            </div>

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
                className="bg-gray-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col h-full"
                style={{ height: sizes.code }}
              >
                <div className="flex items-center justify-between px-3 sm:px-4 py-1 sm:py-2 bg-gray-700/50 border-b border-gray-600">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <i className="ri-file-code-line text-blue-400 text-sm sm:text-base"></i>
                    <span onClick={setShowReviewPanel(false)} className="text-xs sm:text-sm font-mono text-gray-300">editor.js</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"></span>
                  </div>
                </div>
                <div className="flex-1">
                  <CodeEditor code={code} setCode={setCode} />
                </div>
              </div>
            </Resizable>

            {/* Review Panel - Slides in from right */}
            <div className={`absolute top-0 right-0 h-full w-full lg:w-1/2 xl:w-2/5 bg-gray-800/95 backdrop-blur-md border-l border-gray-600 shadow-xl transition-all duration-300 ease-in-out transform ${
              showReviewPanel ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border-b border-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="ri-feedback-line text-yellow-400"></i>
                    <span className="text-sm font-medium text-white">Code Review</span>
                  </div>
                  <button 
                    onClick={() => setShowReviewPanel(false)}
                    className="text-gray-400 hover:text-white p-1"
                    aria-label="Close review panel"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {review?.error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <i className="ri-error-warning-line text-red-400 text-2xl sm:text-3xl mb-2 sm:mb-3"></i>
                      <p className="text-red-400 font-medium text-sm sm:text-base">{review.error}</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">Please try again</p>
                    </div>
                  ) : review?.raw ? (
                    <div className="h-full flex flex-col">
                      {/* Review Tabs - Mobile optimized */}
                      <div className="flex border-b border-gray-700 bg-gray-700/30 overflow-x-auto">
                        <button
                          onClick={() => setActiveReviewTab("quality")}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                            activeReviewTab === "quality" 
                              ? 'text-yellow-400 border-b-2 border-yellow-400' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Code Quality
                        </button>
                        <button
                          onClick={() => setActiveReviewTab("performance")}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                            activeReviewTab === "performance" 
                              ? 'text-blue-400 border-b-2 border-blue-400' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Performance
                        </button>
                        <button
                          onClick={() => setActiveReviewTab("issues")}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                            activeReviewTab === "issues" 
                              ? 'text-red-400 border-b-2 border-red-400' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Issues
                        </button>
                        <button
                          onClick={() => setActiveReviewTab("suggestions")}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                            activeReviewTab === "suggestions" 
                              ? 'text-green-400 border-b-2 border-green-400' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Suggestions
                        </button>
                      </div>
                      
                      {/* Tab Content */}
                      <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
                        <CodeReviewDisplay 
                          reviewData={{ success: true, data: review.raw }} 
                          activeTab={activeReviewTab}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                        <i className="ri-code-review-line text-2xl sm:text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-gray-300 font-medium text-sm sm:text-base mb-1">Review Panel</h3>
                      <p className="text-gray-500 text-xs sm:text-sm max-w-xs">
                        Your code review will appear here after generation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Project;