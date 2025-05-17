import React, {useState} from "react";
import {Bot, HelpCircle, Send} from "lucide-react";
import Message from "./message.jsx";
import HelpModal from "./help.jsx";

function ChatInterface ({
                           messages,
                           inputValue,
                           setInputValue,
                           handleSendMessage,
                           handleKeyPress,
                           isLoading,
                           messagesEndRef
                       }) {
    console.log( messages, inputValue);
    const [showHelp, setShowHelp] = useState(false);

    // console.log(messagesEndRef, messages, inputValue, handleSendMessage, setShowHelp);

    return (
        <div className="flex flex-col h-[500px]">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <Bot size={18} className="text-indigo-600" />
                    </div>
                    <h3 className="ml-2 text-white font-medium">Portfolio AI Assistant</h3>
                </div>

                <button
                    onClick={() => setShowHelp(true)}
                    className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors"
                    title="Help"
                >
                    <HelpCircle size={16} className="text-white" />
                </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((message, index) => (
                    // console.log(message)
                    <Message key={index} message={message.text} />
                )

                )}


                {isLoading && (
                    <div className="flex space-x-2 justify-center items-center text-indigo-600 py-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        onKeyPress={handleKeyPress}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg 
              ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {/* Help Modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </div>
    );
}

export default ChatInterface;