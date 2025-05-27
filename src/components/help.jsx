import React from "react";
import { X } from "lucide-react";

function HelpModal({ onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80"
                onClick={onClose}
            ></div>

            {/* Modal Content - smaller max width and padding */}
            <div className="relative w-full max-w-xl p-6 rounded-xl shadow-xl bg-gray-800 text-gray-100">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-700 text-gray-300"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-indigo-300">How to Use This Chat</h2>

                <div className="space-y-4 text-sm">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Getting Started</h3>
                        <p className="text-gray-300">
                            Ask about Archit’s skills, projects, and interests. The assistant will provide helpful info based on his background.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Example Questions</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-300">
                            <li>What skills does Archit have?</li>
                            <li>Can you tell me about Archit's projects?</li>
                            <li>What kind of work does Archit do?</li>
                            <li>What technologies does Archit use?</li>
                            <li>What are Archit's hobbies?</li>
                            <li>How would you describe Archit's professional style?</li>
                            <li>What interests does Archit have outside of work?</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Tips</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-300">
                            <li>Be specific for better answers.</li>
                            <li>Ask follow-up questions to learn more.</li>
                            <li>Focus on Archit's background, not coding help.</li>
                            <li>Enjoy learning about Archit's interests!</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-2 px-5 rounded-lg hover:opacity-90 transition-opacity text-base font-medium"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HelpModal;
