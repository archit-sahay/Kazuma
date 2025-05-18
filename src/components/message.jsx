import React from "react";
import { User, Bot } from 'lucide-react';

function Message({ message, sender, date }) {
    const isBot = sender === 'bot';
    console.log("aSDCVHGFDS", message.sender);

    return (
        <div className={`flex items-start space-x-2 mb-4 ${isBot ? '' : 'justify-end'}`}>
            {isBot && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-white" />
                </div>
            )}

            <div
                className={`max-w-xs sm:max-w-sm md:max-w-md py-2 px-4 rounded-2xl ${
                    isBot
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                }`}
            >
                <p>{message.text}</p>
                <span className="text-xs opacity-70 block text-right">
          {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
            </div>

            {!isBot && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-white" />
                </div>
            )}
        </div>
    );
}

export default Message;