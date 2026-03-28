import React, { useState, useEffect } from "react";

function WelcomeScreen ({ name, setName, email, setEmail, handleStartChat, handleKeyDown }) {
    const [emailError, setEmailError] = useState('');
    const [visitorCount, setVisitorCount] = useState(null);

    useEffect(() => {
        fetch('http://localhost:6969/kazuma/count')
            .then(res => res.json())
            .then(data => setVisitorCount(data.count))
            .catch(() => {});
    }, []);

    const validateEmail = (value) => {
        setEmail(value);
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('Please enter a valid email');
        } else {
            setEmailError('');
        }
    };

    const isValid = name.trim() && email.trim() && !emailError;

    return (
        <div className="p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-center mb-6 text-amber-300">Meet my Digital Clone</h2>
            <p className="text-gray-300 mb-6 text-center">
                Please enter your details to start an interactive conversation about my projects and skills
            </p>

            <div className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-gray-700 text-gray-200 placeholder-gray-400"
                    onKeyDown={handleKeyDown}
                />

                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        placeholder="Your Email"
                        className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all bg-gray-700 text-gray-200 placeholder-gray-400 ${
                            emailError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600 focus:ring-amber-500 focus:border-amber-500'
                        }`}
                        onKeyDown={handleKeyDown}
                    />
                    {emailError && (
                        <p className="text-red-400 text-xs mt-1">{emailError}</p>
                    )}
                </div>

                <button
                    onClick={handleStartChat}
                    disabled={!isValid}
                    className={`w-full bg-gradient-to-r from-amber-600 to-orange-700 text-white font-medium py-3 rounded-lg transition-opacity ${
                        isValid ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    Start Chatting
                </button>

                {visitorCount !== null && (
                    <p className="text-center text-xs text-gray-400 mt-2">
                        {visitorCount} visitor{visitorCount !== 1 ? 's' : ''} so far
                    </p>
                )}
            </div>
        </div>
    );
}

export default WelcomeScreen;
