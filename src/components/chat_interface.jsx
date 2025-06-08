import React, {useState} from "react";
import { HelpCircle, Send, X} from "lucide-react";
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

    return (
        <div className="flex flex-col h-[700px] w-full max-w-md sm:max-w-xl md:max-w-5xl lg:max-w-7xl xl:max-w-full mx-auto">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-indigo-800 to-purple-900 p-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img src={kazuma} alt="Bot" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <h3 className="ml-2 text-white font-medium text-sm sm:text-base">Archit's Clone</h3>
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
            <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 overflow-y-auto bg-gray-900 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="w-full space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
                    {messages.map((message, index) => (
                        <div key={index} className="w-full">
                            <Message
                                message={message.text}
                                sender={message.sender}
                                date={message.timestamp}
                            />
                        </div>
                    ))}
                </div>

                {isLoading && (
                    <div className="flex space-x-2 justify-center items-center text-indigo-400 py-3 mt-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 w-full">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-700 text-gray-200 placeholder-gray-400 text-sm sm:text-base md:text-base lg:text-lg xl:text-xl transition-all min-w-0"
                        onKeyPress={handleKeyPress}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={`bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6 rounded-lg transition-all flex-shrink-0
                          ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:scale-105'}`}
                    >
                        <Send size={18} className="sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                    </button>
                </div>
            </div>

            {/* Help Modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} darkMode={true} />}
        </div>
    );
}

export default ChatInterface;
