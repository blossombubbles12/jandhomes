"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';
import { usePathname, useParams } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const params = useParams();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Determine context
            let context = {};
            if (pathname === '/admin/dashboard') {
                context = { page: 'dashboard' };
            } else if (pathname.startsWith('/admin/assets/') && params.id) {
                context = { page: 'asset', assetId: params.id };
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage], // Send history
                    context
                })
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            const assistantMessage: Message = { role: 'assistant', content: data.content };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">

                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Bot size={20} />
                            <span className="font-medium">Asset Assistant</span>
                        </div>
                        <button onClick={toggleChat} className="hover:bg-blue-700 p-1 rounded transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-10 text-sm">
                                <p>👋 Hi! I'm the Jand Homes Assistant. How can I help with your portfolio?</p>
                                <p className="mt-2 text-xs font-semibold uppercase text-blue-600">Try asking:</p>
                                <ul className="mt-2 space-y-2 text-xs">
                                    <li className="bg-white border border-gray-200 p-2 rounded-lg cursor-pointer hover:border-blue-400" onClick={() => setInput("What is the total value of my portfolio in Naira?")}>
                                        "What is the total value of my portfolio?"
                                    </li>
                                    <li className="bg-white border border-gray-200 p-2 rounded-lg cursor-pointer hover:border-blue-400" onClick={() => setInput("Which properties are currently active in Ajah?")}>
                                        "Which properties are active in Ajah?"
                                    </li>
                                    <li className="bg-white border border-gray-200 p-2 rounded-lg cursor-pointer hover:border-blue-400" onClick={() => setInput("What is my total monthly rental income?")}>
                                        "What is my total monthly rental income?"
                                    </li>
                                </ul>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-lg p-3 rounded-bl-none shadow-sm flex space-x-1 items-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your assets..."
                            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
