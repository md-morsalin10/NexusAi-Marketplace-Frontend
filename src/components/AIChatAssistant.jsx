"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineXMark, HiOutlinePaperAirplane, HiOutlineSparkles, HiOutlineTrash } from 'react-icons/hi2';
import Link from 'next/link';

const INITIAL_MESSAGE = {
    role: 'model',
    text: "Hi there! I'm your NexusAI Marketplace Assistant. How can I help you find the perfect AI gadget today?",
    products: []
};

const AIChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Load history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('ai_chat_history');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history");
                setMessages([INITIAL_MESSAGE]);
            }
        } else {
            setMessages([INITIAL_MESSAGE]);
        }
    }, []);

    // Save history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('ai_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const clearChat = () => {
        localStorage.removeItem('ai_chat_history');
        setMessages([INITIAL_MESSAGE]);
    };

    const suggestedPrompts = [
        "Show me cheap AI gadgets",
        "Best wearable devices",
        "How do I become a seller?",
    ];

    const handleSend = async (textOverride = null) => {
        const userText = textOverride || input;
        if (!userText.trim()) return;

        const newMsg = { role: 'user', text: userText };
        const updatedMessages = [...messages, newMsg];

        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            // Format history for backend
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history, message: userText })
            });

            const data = await res.json();

            if (data.error) {
                setMessages([...updatedMessages, { role: 'model', text: `Error: ${data.error}` }]);
            } else {
                setMessages([...updatedMessages, {
                    role: 'model',
                    text: data.text,
                    products: data.products || []
                }]);
            }
        } catch (err) {
            setMessages([...updatedMessages, { role: 'model', text: "Sorry, I couldn't connect to the server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[#0b0f19]/95 backdrop-blur-xl border border-cyan-900/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-cyan-950/60 bg-[#030712]/50 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <HiOutlineSparkles className="text-cyan-400 w-5 h-5" />
                                <h3 className="text-white font-bold text-sm">NexusAI Assistant</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearChat}
                                    title="Clear chat"
                                    className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-900/20"
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                >
                                    <HiOutlineXMark className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 w-full">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm overflow-hidden ${
                                        msg.role === 'user'
                                            ? 'bg-cyan-600 text-white rounded-br-sm'
                                            : 'bg-[#030712] border border-cyan-950/60 text-gray-300 rounded-bl-sm'
                                    }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.text}</p>
                                    </div>

                                    {/* Product Cards Rendering */}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="mt-3 w-full space-y-2 overflow-x-hidden">
                                            {msg.products.map(p => (
                                                <div key={p._id} className="flex gap-3 bg-[#030712] border border-cyan-900/30 p-2.5 rounded-xl hover:border-cyan-700/50 transition-colors w-full overflow-hidden">
                                                    <div className="w-16 h-16 rounded-lg bg-cyan-950/30 overflow-hidden flex-shrink-0">
                                                        <img src={p.image || 'https://placehold.co/64'} alt={p.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                        <div>
                                                            <p className="text-xs font-bold text-white truncate">{p.title}</p>
                                                            <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">${p.price}</p>
                                                        </div>
                                                        <Link href="/all-products" className="text-[10px] text-gray-400 hover:text-cyan-400 flex items-center gap-1 mt-1">
                                                            View in Store &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start">
                                    <div className="bg-[#030712] border border-cyan-950/60 text-gray-300 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-[#030712]/50 border-t border-cyan-950/60 flex-shrink-0">
                            {/* Suggested Prompts */}
                            {messages.length <= 2 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {suggestedPrompts.map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(prompt)}
                                            className="whitespace-nowrap text-[10px] font-medium px-3 py-1.5 rounded-full bg-cyan-950/30 text-cyan-400 border border-cyan-900/40 hover:bg-cyan-900/50 transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask the AI Assistant..."
                                    className="w-full bg-[#0b0f19] border border-cyan-900/40 text-sm text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-600"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-2 p-1.5 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
                                >
                                    <HiOutlinePaperAirplane className="w-5 h-5 -rotate-45" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-[#030712] border border-cyan-900/50 text-cyan-400' : 'bg-cyan-500 text-[#030712]'
                }`}
            >
                {isOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineSparkles className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};

export default AIChatAssistant;
