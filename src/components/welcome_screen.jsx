import React from "react";

function WelcomeScreen ({ name, setName, email, setEmail, handleStartChat, handleKeyPress }) {
    return (
        <div className="p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-center mb-6 text-indigo-300">Meet my Digital Clone</h2>
            <p className="text-gray-300 mb-6 text-center">
                Please enter your details to start an interactive conversation about my projects and skills
            </p>

            <div className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-700 text-gray-200 placeholder-gray-400"
                    onKeyPress={handleKeyPress}
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-700 text-gray-200 placeholder-gray-400"
                    onKeyPress={handleKeyPress}
                />

                <button
                    onClick={handleStartChat}
                    className="w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Start Chatting
                </button>
            </div>
        </div>
    );
}

export default WelcomeScreen;
