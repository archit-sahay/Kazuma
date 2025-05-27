import React from "react";
import { User } from 'lucide-react';
import botImage from '../assets/kazuma.png'; // your bot image here

function Message({ message, sender, date }) {
    const isBot = sender === 'bot';

    let messageText = "";
    if (typeof message === 'object') {
        messageText = message.text || "";
    } else {
        messageText = message;
    }

    return (
        <div className={`flex items-start space-x-2 mb-4 ${isBot ? '' : 'justify-end'}`}>
            {isBot && (
                <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={botImage} alt="Bot" className="w-full h-full object-cover" />
                </div>
            )}

            <div
                className={`max-w-xs sm:max-w-sm md:max-w-md py-2 px-4 rounded-2xl ${
                    isBot
                        ? 'bg-gradient-to-r from-indigo-800 to-purple-900 text-gray-200'
                        : 'bg-gray-700 text-gray-200'
                }`}
            >
                <p className="text-left">{messageText}</p>
                <span className="text-xs opacity-70 block text-right text-gray-300">
                    {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {!isBot && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-gray-200" />
                </div>
            )}
        </div>
    );
}

export default Message;
