import React from 'react'

const Conversation = ({}) => {
  return (
    <div className="conversation bg-blue-100 p-4 rounded-lg shadow-sm flex-1 flex flex-col justify-between">
          {/* Messages Part */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[80%] p-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message max-w-xs px-4 py-2 rounded-lg ${
      message.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          {/* Sending Part */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full bg-gray-200">
            <input
              type="text"
              value={msg}
              onChange={(e) => setmsg(e.target.value)}
              className="flex-1 px-3 py-2 outline-none border-none bg-transparent"
              placeholder="Type a message..."
            />
            <button
              onClick={() => {
                appendMeassage(msg);
                setmsg('');
              }}
              className="p-2  text-slate-500 rounded-full  transition flex items-center justify-center"
            >
              <i className="ri-send-plane-fill text-xl"></i>
            </button>
          </div>
        </div>
  )
}

export default Conversation