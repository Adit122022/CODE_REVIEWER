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
    // if (msg.trim() === "") return;

    // // Send message to server
    // socket.emit("message", msg);

    // Append to local messages
   
    setmessages((prevMessages) => [...prevMessages, { content: msg }]); 
    setmsg("");
  };

  useEffect(() => {
    // Initialize Socket.io connection
    const newSocket = io("https://fs73pflc-3000.inc1.devtunnels.ms/", { query:{projectId}});

    newSocket.on('message', msg => {
      console.log("Received message:", msg)
      sendMessage(msg)
  })
    // Save socket instance
    setsocket(newSocket);
   // Cleanup on unmount
  }, []);

  return (
    <main className="flex justify-center items-center  bg-gray-100">
      <section className="w-screen h-[80vh] bg-white shadow-lg rounded-2xl p-6 flex-col  md:flex-row flex gap-4">
        {/* Chat Section */}
        <div className="conversation bg-blue-100 p-4 rounded-lg shadow-sm flex-1 flex flex-col justify-between">
          {/* Messages */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[80%] p-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 self-start"
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full bg-white">
            <input
              type="text"
              value={msg}
              onChange={(e) => setmsg(e.target.value)}
              className="flex-1 px-3 py-2 outline-none border-none bg-transparent"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button

              onClick={()=>{
                socket.emit('message',msg)
                sendMessage();
                setmsg("");
              }}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center"
            >
              <i className="ri-send-plane-fill text-xl"></i>
            </button>
          </div>
        </div>

        {/* Code Section */}
        <div className="code bg-green-100 p-4 rounded-lg shadow-sm flex-[3] flex items-center justify-center">
<CodeEditor  code={code} setCode={setCode}/>
        </div>

        {/* Review Section */}
        <div className="review bg-yellow-100 p-4 rounded-lg shadow-sm flex-1 flex items-center justify-center">
          <h2 className="text-lg font-semibold text-yellow-700">Review</h2>
        </div>
      </section>
    </main>
  );
};

export default Project;
