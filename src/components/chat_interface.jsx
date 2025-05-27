import React, {useState} from "react";
import {Bot, HelpCircle, Send, X} from "lucide-react";
import Message from "./message.jsx";
import HelpModal from "./help.jsx";
import kazuma from "../assets/kazuma.png";

function ChatInterface ({
                            messages,
                            inputValue,
                            setInputValue,
                            handleSendMessage,
                            handleKeyPress,
                            isLoading,
                            messagesEndRef,
                            handleCloseChat
                        }) {
    console.log( messages, inputValue);
    const [showHelp, setShowHelp] = useState(false);

    // console.log(messagesEndRef, messages, inputValue, handleSendMessage, setShowHelp);

    return (
        <div className="flex flex-col h-[600px] ">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-indigo-800 to-purple-900 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img src={kazuma} alt="Bot" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <h3 className="ml-2 text-white font-medium">Archit's Clone</h3>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Dark Mode Toggle */}
                    {/*<button*/}
                    {/*    onClick={toggleDarkMode}*/}
                    {/*    className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors"*/}
                    {/*    title={darkMode ? "Light Mode" : "Dark Mode"}*/}
                    {/*>*/}
                    {/*    {darkMode? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}*/}
                    {/*</button>*/}

                    {/* Close Chat Button */}
                    <button
                        onClick={handleCloseChat}
                        className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                        title="Close Chat"
                    >
                        <X size={16} className="text-gray-300" />
                    </button>

                    <button
                        onClick={() => setShowHelp(true)}
                        className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                        title="Help"
                    >
                        <HelpCircle size={16} className="text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
                {
                    // console.log(messages)
                    messages.map((message, index) => (
                        // console.log(message)
                        <Message key={index} message={message.text} sender={message.sender} date={message.timestamp} />
                    ))
                }


                {isLoading && (
                    <div className="flex space-x-2 justify-center items-center text-indigo-400 py-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-700 text-gray-200 placeholder-gray-400"
                        onKeyPress={handleKeyPress}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={`bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-3 rounded-lg 
                          ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {/* Help Modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} darkMode={true} />}
        </div>
    );
}

export default ChatInterface;
