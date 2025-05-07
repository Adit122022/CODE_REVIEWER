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
    const newSocket = io("http://localhost:3000", { query: { projectId } });
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
    <div className="relative w-screen h-screen">
      <Background />
      
      <main className="relative z-10 w-full h-full p-6 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            <Link to="/" className="text-white hover:text-blue-400">←</Link>
            <span className="text-blue-400 ml-2">#{projectId.slice(0, 6)}</span>
          </h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-all">
              <i className="ri-share-line"></i>
              <span>Share</span>
            </button>
            <button 
              onClick={saveProject}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-all"
            >
              <i className="ri-save-line"></i>
              <span>Save</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <Conversation 
            messages={messages} 
            appendMessage={(msg) => setMessages(prev => [...prev, msg])}
            socket={socket}
          />

          {/* Resizable Code and Review Sections */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Code Editor Section */}
            <Resizable
              height={sizes.code}
              width={Infinity}
              onResize={(e, { size }) => onResize('code', size.height)}
              resizeHandles={['s']}
              minConstraints={[Infinity, 200]}
              maxConstraints={[Infinity, window.innerHeight * 0.7]}
            >
              <div 
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl overflow-hidden"
                style={{ height: sizes.code }}
              >
                <CodeEditor code={code} setCode={setCode} />
              </div>
            </Resizable>

            {/* Review Section */}
            <Resizable
              height={sizes.review}
              width={Infinity}
              onResize={(e, { size }) => onResize('review', size.height)}
              resizeHandles={['s']}
              minConstraints={[Infinity, 150]}
              maxConstraints={[Infinity, window.innerHeight * 0.5]}
            >
              <div 
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl overflow-hidden"
                style={{ height: sizes.review }}
              >
                <div className="px-6 h-full flex flex-col">
                  <div className="flex items-center justify-between py-3">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <i className="ri-feedback-line text-yellow-400"></i>
                      AI Review
                    </h2>
                    <button 
                      onClick={GenAiReview}
                      disabled={isGeneratingReview}
                      className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                        isGeneratingReview 
                          ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                          : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      }`}
                    >
                      <i className="ri-ai-generate"></i>
                      {isGeneratingReview ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {review?.error ? (
                      <div className="text-red-400 p-4">{review.error}</div>
                    ) : review?.raw ? (
                      <CodeReviewDisplay reviewData={{ success: true, data: review.raw }} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <i className="ri-code-review-line text-4xl text-gray-500 mb-3"></i>
                        <p className="text-gray-400">No review generated yet</p>
                        <p className="text-gray-500 text-sm mt-1">
                          Click "Generate Review" to analyze your code
                        </p>
                      </div>
                    )}
                  </div>
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