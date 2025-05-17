import React from "react";
import {X} from 'lucide-react';

function HelpModal({ onClose }){
    const questions = [
        "What projects have you worked on?",
        "What are your technical skills?",
        "Tell me about your experience with AI and machine learning",
        "What's your educational background?",
        "Can you share your GitHub profile?",
        "What frameworks do you use for front-end development?",
        "Do you have experience with cloud platforms?",
        "What's your most challenging project?",
        "Are you available for freelance work?",
        "How can I contact you directly?"
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-md p-6 relative max-h-[80vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl text-center font-bold text-indigo-800 mb-4">Suggested Questions</h3>

                <ul className="space-y-2">
                    {questions.map((question, idx) => (
                        <li key={idx} className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer">
                            {question}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HelpModal;
