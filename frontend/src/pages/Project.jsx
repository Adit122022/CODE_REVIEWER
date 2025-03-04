import React, { useState } from "react";
import "remixicon/fonts/remixicon.css";

const Project = () => {
    const [messages, setmessages] = useState([])
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <section className="w-screen  bg-white shadow-lg rounded-2xl p-6 h-screen flex gap-4">
        <div className="conversation bg-blue-100 p-4 rounded-lg shadow-sm flex-1 flex items-end justify-center">
            {/*  sending part */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full max-w-md bg-white">
            <input
              type="text"
              className="flex-1 px-1 py-0 outline-none border-none bg-transparent"
              placeholder="Type a message..."
            />
            <button className="px-3 py-2  text-slate-400 rounded-full  transition flex items-center justify-center">
              <i className="ri-send-plane-fill text-xl"></i>
            </button>
          </div>
        </div>
        <div className="code bg-green-100 p-4 rounded-lg shadow-sm flex-[3] flex items-center justify-center">
          <h2 className="text-lg font-semibold text-green-700">Code</h2>
        </div>
        <div className="review bg-yellow-100 p-4 rounded-lg shadow-sm flex-1 flex items-center justify-center">
          <h2 className="text-lg font-semibold text-yellow-700">Review</h2>
        </div>
      </section>
    </main>
  );
};

export default Project;
