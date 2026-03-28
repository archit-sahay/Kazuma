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
                            handleKeyDown,
                            isLoading,
                            typingText,
                            messagesEndRef,
                            handleCloseChat,
                            connectionStatus
                        }) {
    const [showHelp, setShowHelp] = useState(false);

    const statusColor = {
        connected: 'bg-green-500',
        connecting: 'bg-yellow-500',
        reconnecting: 'bg-yellow-500 animate-pulse',
        disconnected: 'bg-red-500',
    };

    const statusLabel = {
        connected: 'Online',
        connecting: 'Connecting...',
        reconnecting: 'Reconnecting...',
        disconnected: 'Offline',
    };

    return (
        <div className="flex flex-col h-[700px] w-full mx-auto">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-slate-800/90 to-gray-900/90 p-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img src={kazuma} alt="Bot" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="ml-2 text-white font-medium text-sm sm:text-base">Archit's Clone</h3>
                    {/* Connection status dot */}
                    <div className="ml-2 flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${statusColor[connectionStatus] || 'bg-gray-500'}`}></div>
                        {connectionStatus !== 'connected' && (
                            <span className="text-xs text-gray-400">{statusLabel[connectionStatus]}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
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
            <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 overflow-y-auto bg-gray-900/60 backdrop-blur-sm scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="w-full space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
                    {/* Loading skeleton when chat starts but no messages yet */}
                    {messages.length === 0 && (
                        <div className="flex items-start space-x-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                            <div className="space-y-2 flex-1 max-w-sm">
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    )}

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

                {(isLoading || typingText) && (
                    <div className="flex items-center space-x-2 text-amber-400 py-3 mt-4 ml-12">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        {typingText && (
                            <span className="text-xs text-amber-300 italic">{typingText}</span>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 border-t border-white/10 bg-gray-900/70 rounded-b-lg">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 w-full">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-gray-700 text-gray-200 placeholder-gray-400 text-sm sm:text-base md:text-base lg:text-lg xl:text-xl transition-all min-w-0"
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className={`bg-gradient-to-r from-amber-600 to-orange-700 text-white p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6 rounded-lg transition-all flex-shrink-0
                          ${(!inputValue.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:scale-105'}`}
                    >
                        <Send size={18} className="sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                    </button>
                </div>
            </div>

            {/* Help Modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </div>
    );
}

export default ChatInterface;
