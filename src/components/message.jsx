import React from "react";
import { User } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import botImage from '../assets/kazuma.png'; // your bot image here

// Configure marked for better code highlighting
marked.setOptions({
    highlight: function(code, lang) {
        // Simple syntax highlighting for common languages
        if (lang === 'javascript' || lang === 'js') {
            return `<pre class="language-js"><code class="language-js">${escapeHtml(code)}</code></pre>`;
        } else if (lang === 'python') {
            return `<pre class="language-python"><code class="language-python">${escapeHtml(code)}</code></pre>`;
        } else if (lang === 'html') {
            return `<pre class="language-html"><code class="language-html">${escapeHtml(code)}</code></pre>`;
        } else if (lang === 'css') {
            return `<pre class="language-css"><code class="language-css">${escapeHtml(code)}</code></pre>`;
        }
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
    },
    breaks: true,
    gfm: true
});

// Escape HTML function
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function Message({ message, sender, date }) {
    const isBot = sender === 'bot';

    let messageText = "";
    if (typeof message === 'object') {
        messageText = message.text || "";
    } else {
        messageText = message;
    }

    // Convert markdown to HTML and sanitize it
    const createMarkup = (markdown) => {
        const rawMarkup = marked(markdown);
        const cleanMarkup = DOMPurify.sanitize(rawMarkup);
        return { __html: cleanMarkup };
    };

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
                <div
                    className="text-left markdown-content"
                    dangerouslySetInnerHTML={createMarkup(messageText)}
                />
                <span className="text-xs opacity-70 block text-right text-gray-300 mt-2">
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
