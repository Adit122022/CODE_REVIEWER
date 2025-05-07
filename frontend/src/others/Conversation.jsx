import React, { useState, useEffect, useRef } from "react";
import "remixicon/fonts/remixicon.css";

const Conversation = ({ messages, appendMessage, socket }) => {
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (msg.trim()) {
      const newMessage = { sender: "user", content: msg };
      appendMessage(newMessage);
      socket?.emit("message", msg);
      setMsg("");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className="ri-chat-3-line text-blue-400"></i>
          Team Chat
        </h2>
        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
          {messages.length} messages
        </span>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-800/80 text-white rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all"
          >
            <i className="ri-send-plane-fill text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;