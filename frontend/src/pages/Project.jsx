import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "remixicon/fonts/remixicon.css";
import CodeEditor from "../others/CodeEditor";

const Project = () => {
  const { projectId } = useParams();
  const [socket, setsocket] = useState(null);
  const [messages, setmessages] = useState([]);
  const [msg, setmsg] = useState("");
  const [code, setCode] = useState("");

  const sendMessage = (msg) => {
    setmessages((prevMessages) => [...prevMessages, { content: msg }]); 
    setmsg("");
  };

  useEffect(() => {
    const newSocket = io("https:/localhost:3000", { query:{ projectId } });
    newSocket.on('message', msg => {
      console.log("Received message:", msg);
      sendMessage(msg);
    });
    setsocket(newSocket);
  }, []);

  return (
    <main className="flex justify-center items-center w-screen h-screen bg-gray-100 p-4">
      <section className="w-full  bg-white shadow-xl h-full rounded-xl p-6 flex flex-col md:flex-row gap-6">
        
        {/* Chat Section */}
        <div className="conversation  flex-1 bg-blue-50 rounded-lg shadow-md flex flex-col justify-between">
          {/* Messages */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 self-start"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center w-full gap-2 border-t border-gray-300 p-2">
            <input
              type="text"
              value={msg}
              onChange={(e) => setmsg(e.target.value)}
              className="w-[70%] px-4 py-2 border rounded-md bg-white outline-none focus:border-blue-400"
              placeholder="Type a message..."
            />
            <button
              onClick={() => {
                socket.emit('message', msg);
                sendMessage(msg);
                setmsg("");
              }}
              className="px-3 py-2 bg-gray-500 rounded-full text-white hover:bg-gray-600 transition"
            >
              <i className="ri-send-plane-fill text-lg"></i>
            </button>
          </div>
        </div>

        {/* Code Section */}
        <div className="code flex-[2] bg-green-50 rounded-lg shadow-md flex items-center justify-center p-4">
          <CodeEditor code={code} setCode={setCode} />
        </div>

        {/* Review Section */}
        <div className="review flex-1 bg-yellow-50 rounded-lg shadow-md flex items-center justify-center p-4">
          <h2 className="text-base font-semibold text-yellow-700">Review</h2>
        </div>
      </section>
    </main>
  );
};

export default Project;
