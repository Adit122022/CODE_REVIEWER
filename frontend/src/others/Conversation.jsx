import React, { useState, useEffect, useRef } from "react";

const Conversation = ({ messages, appendMessage }) => {
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send message
  const sendMessage = () => {
    if (msg.trim()) {
      appendMessage({ sender: "user", content: msg });
      setMsg("");
    }
  };

  return (
    <div className="conversation flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Stays at Bottom */}
      <div className="sticky bottom-0 bg-gray-100 p-2 border-t flex items-center w-full">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Press Enter to Send
          className="flex-1 p-3 rounded-full outline-none bg-white border border-gray-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          <i className="ri-send-plane-fill text-xl"></i>
        </button>
      </div>

    </div>
  );
};

export default Conversation;
