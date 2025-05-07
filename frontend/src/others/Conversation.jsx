import React, { useState, useEffect, useRef } from "react";

const Conversation = ({ messages, appendMessage }) => {
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (msg.trim()) {
      appendMessage({ sender: "user", content: msg });
      setMsg("");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-base-100 shadow-xl rounded-xl overflow-hidden border border-base-300">

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${message.sender === "user" ? "chat-end" : "chat-start"}`}
          >
            <div
              className={`chat-bubble text-sm ${
                message.sender === "user" ? "bg-primary text-white" : "bg-base-200 text-black"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-base-200 border-t flex items-center gap-2">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="input input-bordered input-md w-full"
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary rounded-full min-w-fit px-4"
        >
          <i className="ri-send-plane-fill text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Conversation;
