import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import "remixicon/fonts/remixicon.css";
import CodeEditor from "../others/CodeEditor";
import Background from "../Background/Background";
import Conversation from "../others/Conversation";

const Project = () => {
  const { projectId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("");
  const [sizes, setSizes] = useState({
    chat: 1,
    code: 400,
    review: 200
  });
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (msg.trim()) {
      const newMessage = { sender: "user", content: msg };
      setMessages(prev => [...prev, newMessage]);
      socket?.emit("message", msg);
      setMsg("");
    }
  };

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

  return (
    <div className="relative w-screen h-screen">
      <Background />
      
      <main className="relative z-10 w-full h-full p-6 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Project <span className="text-blue-400">#{projectId.slice(0, 6)}</span>
          </h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-all">
              <i className="ri-share-line"></i>
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-all">
              <i className="ri-save-line"></i>
              <span>Save</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section - Fixed Width */}
          <Conversation 
  messages={messages} 
  appendMessage={(msg) => setMessages(prev => [...prev, msg])}
  socket={socket}
/>

          {/* Resizable Code and Review Sections */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Code Editor Section - Resizable */}
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

            {/* Review Section - Resizable */}
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
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <i className="ri-feedback-line text-yellow-400"></i>
                      AI Review
                    </h2>
                    <button className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full flex items-center gap-1">
                      <i className="ri-ai-generate"></i>
                      Generate
                    </button>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 flex-1 scrollbar overflow-y-auto">
                    <div className="text-gray-300 text-sm space-y-3">
                      <p>✨ <span className="text-yellow-400">Code Quality:</span> 8.5/10</p>
                      <p>⚡ <span className="text-blue-400">Performance Suggestions:</span> Consider memoizing component</p>
                      <p>🔍 <span className="text-purple-400">Potential Issues:</span> Line 42 - Unused variable</p>
                      <p>📝 <span className="text-green-400">Documentation:</span> Add JSDoc comments for functions</p>
                    </div>
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