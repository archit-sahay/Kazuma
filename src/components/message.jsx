import React, { useState } from "react";
import { User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import botImage from '../assets/kazuma.png';

function Message({ message, sender, date }) {
    const isBot = sender === 'bot';
    const isSystem = sender === 'system';
    const [copied, setCopied] = useState(false);

    let messageText = "";
    if (typeof message === 'object') {
        messageText = message.text || "";
    } else {
        messageText = message;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(messageText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // System messages (connection events, errors)
    if (isSystem) {
        return (
            <div className="flex justify-center my-2">
                <span className="text-xs text-gray-400 bg-gray-800/60 px-3 py-1 rounded-full">
                    {messageText}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex items-start space-x-3 md:space-x-4 mb-6 md:mb-8 group ${isBot ? 'mr-4 md:mr-8' : 'justify-end ml-4 md:ml-8'}`}>
            {isBot && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={botImage} alt="Bot" className="w-full h-full object-cover" />
                </div>
            )}

            <div className={`relative ${isBot ? 'max-w-[80%]' : 'max-w-[70%]'}`}>
                <div
                    className={`inline-block py-3 px-4 md:py-4 md:px-6 rounded-2xl ${
                        isBot
                            ? 'bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-gray-200'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                >
                    <div className="text-left markdown-content text-sm md:text-base">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{ borderRadius: '0.5rem', fontSize: '0.85rem' }}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className="bg-gray-700 px-1.5 py-0.5 rounded text-amber-300 text-sm" {...props}>{children}</code>
                                    );
                                },
                                a({ href, children }) {
                                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">{children}</a>;
                                },
                                table({ children }) {
                                    return <div className="overflow-x-auto my-2"><table className="border-collapse border border-gray-600 text-sm w-full">{children}</table></div>;
                                },
                                th({ children }) {
                                    return <th className="border border-gray-600 px-3 py-1 bg-gray-700 text-left">{children}</th>;
                                },
                                td({ children }) {
                                    return <td className="border border-gray-600 px-3 py-1">{children}</td>;
                                }
                            }}
                        >
                            {messageText}
                        </ReactMarkdown>
                    </div>
                    <span className="text-xs opacity-70 block text-right text-gray-300 mt-2">
                        {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Copy button for bot messages */}
                {isBot && (
                    <button
                        onClick={handleCopy}
                        className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-gray-200 flex items-center space-x-1"
                        title="Copy message"
                    >
                        {copied ? (
                            <><Check size={12} /><span>Copied!</span></>
                        ) : (
                            <><Copy size={12} /><span>Copy</span></>
                        )}
                    </button>
                )}
            </div>

            {!isBot && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="md:w-6 md:h-6 text-gray-200" />
                </div>
            )}
        </div>
    );
}

export default Message;
