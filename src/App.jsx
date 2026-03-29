import {useEffect, useRef, useState, useCallback} from 'react'
import './App.css'
import WelcomeScreen from "./components/welcome_screen.jsx";
import ChatInterface from "./components/chat_interface.jsx";
import { Volume2, VolumeX } from 'lucide-react';
import { io } from 'socket.io-client';

function App() {
    const [chatStarted, setChatStarted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [isMuted, setIsMuted] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const messagesEndRef = useRef(null);
    const streamingRef = useRef(false);

    // Dual-video crossfade state
    const videoRefA = useRef(null);
    const videoRefB = useRef(null);
    const [activeVideo, setActiveVideo] = useState('A'); // which video is currently visible
    const [isShuffling, setIsShuffling] = useState(false);

    const socket = useRef(null);

    const videoList = [
        'autumn_japan.webm',
        'autumn_sunset.mp4',
        'japan_eniac.mp4',
        'japan_street.webm',
        'japan_train.mp4',
        'rain_japan.webm',
        'waterfall_japan.mp4'
    ];

    const [videoSrcA, setVideoSrcA] = useState('');
    const [videoSrcB, setVideoSrcB] = useState('');

    const randomizeVideo = useCallback((excludeSrc) => {
        let newVideo;
        do {
            newVideo = `/assets/videos/${videoList[Math.floor(Math.random() * videoList.length)]}`;
        } while (newVideo === excludeSrc && videoList.length > 1);
        return newVideo;
    }, []);

    // Set initial video on mount
    useEffect(() => {
        const initial = randomizeVideo('');
        setVideoSrcA(initial);
    }, []);

    useEffect(() => {
        if (!chatStarted) return;

        socket.current = io(import.meta.env.VITE_API_URL || "http://localhost:6969", {
            transports: ["websocket"],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        setConnectionStatus('connecting');

        socket.current.on('connect', () => {
            setConnectionStatus('connected');
            socket.current.emit("start", JSON.stringify({ name, email }));
        });

        socket.current.on('disconnect', () => {
            setConnectionStatus('disconnected');
        });

        socket.current.on('reconnect_attempt', () => {
            setConnectionStatus('reconnecting');
        });

        socket.current.on('reconnect_failed', () => {
            setConnectionStatus('disconnected');
            setMessages(prev => [...prev, {
                sender: 'system',
                text: 'Connection lost. Please refresh the page to reconnect.',
                timestamp: new Date()
            }]);
        });

        socket.current.on('message', (msg) => {
            setIsLoading(false);
            setTypingText('');
            streamingRef.current = false;
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: msg, timestamp: new Date() }
            ]);
        });

        socket.current.on('stream', (msg) => {
            setIsLoading(false);
            setTypingText('');
            const chunk = msg?.text || '';
            if (!streamingRef.current) {
                streamingRef.current = true;
                setMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: { text: chunk }, timestamp: new Date(), streaming: true }
                ]);
            } else {
                setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.sender === 'bot' && last.streaming) {
                        const existingText = typeof last.text === 'object' ? last.text.text : last.text;
                        updated[updated.length - 1] = {
                            ...last,
                            text: { text: existingText + chunk }
                        };
                    }
                    return updated;
                });
            }
        });

        socket.current.on('stream_end', () => {
            streamingRef.current = false;
            setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.streaming) {
                    updated[updated.length - 1] = { ...last, streaming: false };
                }
                return updated;
            });
        });

        socket.current.on('typing', (msg) => {
            setTypingText(msg?.text || 'Thinking...');
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [chatStarted, name, email]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleStartChat = () => {
        if (name.trim() && email.trim()) {
            setChatStarted(true);
        }
    };

    const handleCloseChat = () => {
        if (socket.current) {
            socket.current.disconnect();
            socket.current = null;
        }
        setChatStarted(false);
        setMessages([]);
        setInputValue('');
        setConnectionStatus('disconnected');
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const userMessage = {
                sender: 'user',
                text: {"text": inputValue},
                timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);
            setTypingText('');
            generateBotResponse(inputValue);
            setInputValue('');
        }
    };

    const generateBotResponse = (input) => {
        if (socket.current) {
            socket.current.emit("message", JSON.stringify({ text: input }));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatStarted ? handleSendMessage() : handleStartChat();
        }
    };

    const toggleMute = () => {
        const activeRef = activeVideo === 'A' ? videoRefA : videoRefB;
        if (activeRef.current) {
            activeRef.current.muted = !activeRef.current.muted;
            setIsMuted(activeRef.current.muted);
        }
    };

    // Dual-video crossfade shuffle
    const handleShuffle = useCallback(() => {
        if (isShuffling) return;
        setIsShuffling(true);

        const currentSrc = activeVideo === 'A' ? videoSrcA : videoSrcB;
        const newSrc = randomizeVideo(currentSrc);
        const inactiveRef = activeVideo === 'A' ? videoRefB : videoRefA;

        // Load new video on the inactive element
        if (activeVideo === 'A') {
            setVideoSrcB(newSrc);
        } else {
            setVideoSrcA(newSrc);
        }

        // Wait for canplay on the inactive video, then crossfade
        const onReady = () => {
            inactiveRef.current?.removeEventListener('canplay', onReady);
            // Crossfade: show new, hide old
            const newActive = activeVideo === 'A' ? 'B' : 'A';
            setActiveVideo(newActive);

            // After transition, pause the old video
            setTimeout(() => {
                const oldRef = activeVideo === 'A' ? videoRefA : videoRefB;
                if (oldRef.current) {
                    oldRef.current.pause();
                }
                setIsShuffling(false);
            }, 800);
        };

        if (inactiveRef.current) {
            inactiveRef.current.addEventListener('canplay', onReady, { once: true });
            inactiveRef.current.load();
            inactiveRef.current.play().catch(() => {});
        }
    }, [isShuffling, activeVideo, videoSrcA, videoSrcB, randomizeVideo]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative">
            {/* Video Background — Dual video for crossfade */}
            <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
                <video
                    ref={videoRefA}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="absolute inset-0 min-w-full min-h-full object-cover transition-opacity duration-700"
                    style={{ opacity: activeVideo === 'A' ? 1 : 0 }}
                    src={videoSrcA}
                />
                <video
                    ref={videoRefB}
                    loop
                    muted={isMuted}
                    playsInline
                    className="absolute inset-0 min-w-full min-h-full object-cover transition-opacity duration-700"
                    style={{ opacity: activeVideo === 'B' ? 1 : 0 }}
                    src={videoSrcB}
                />

                {/* Video Controls */}
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                    <button
                        onClick={toggleMute}
                        className="bg-gray-800/70 hover:bg-gray-700/90 text-white p-2 rounded-full transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    <button
                        onClick={handleShuffle}
                        disabled={isShuffling}
                        className={`bg-gray-800/70 hover:bg-gray-700/90 text-white p-2 rounded-full transition-colors ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Change Background"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.44-4.5M22 12.5a10 10 0 0 1-18.44 4.5"/>
                        </svg>
                    </button>
                </div>

                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-black/60 z-0"></div>
            </div>

            {/* Chat Interface - Dynamic width based on chat state */}
            <div className={`w-full ${chatStarted ? 'max-w-[90vw] xl:max-w-[85vw] 2xl:max-w-[80vw]' : 'max-w-md'} bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 z-10 transition-all duration-500 ease-in-out`}>
                {!chatStarted ? (
                    <WelcomeScreen
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        handleStartChat={handleStartChat}
                        handleKeyDown={handleKeyDown}
                    />
                ) : (
                    <ChatInterface
                        messages={messages}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage}
                        handleKeyDown={handleKeyDown}
                        isLoading={isLoading}
                        typingText={typingText}
                        messagesEndRef={messagesEndRef}
                        handleCloseChat={handleCloseChat}
                        connectionStatus={connectionStatus}
                    />
                )}

                {/* Footer with Contact and Links */}
                <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-white/10 p-4 flex justify-center space-x-6">
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=dak.archit@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-200 hover:text-white text-sm font-medium transition-all duration-200 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        Contact
                    </a>
                    <a
                        href="https://github.com/archit-sahay"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-200 hover:text-white text-sm font-medium transition-all duration-200 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                            />
                        </svg>
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/archit-sahay-118971219/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-200 hover:text-white text-sm font-medium transition-all duration-200 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                            />
                        </svg>
                        LinkedIn
                    </a>
                </footer>
            </div>
        </div>
    );
}

export default App
