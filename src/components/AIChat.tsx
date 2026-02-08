"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';
import { usePathname, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isTyping?: boolean;
}

// Component for typewriter effect
const MessageContent = ({ message, isLast }: { message: Message, isLast: boolean }) => {
    const [displayedContent, setDisplayedContent] = useState(
        message.role === 'assistant' && message.isTyping ? "" : message.content
    );
    const [isDone, setIsDone] = useState(!message.isTyping);

    useEffect(() => {
        if (message.role === 'assistant' && message.isTyping && !isDone) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedContent(message.content.slice(0, i + 1));
                i++;
                if (i >= message.content.length) {
                    clearInterval(interval);
                    setIsDone(true);
                }
            }, 8); // Slightly faster
            return () => clearInterval(interval);
        } else if (!message.isTyping || isDone) {
            setDisplayedContent(message.content);
        }
    }, [message.content, message.role, message.isTyping, isDone]);

    return (
        <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'text-primary-foreground' : 'text-foreground'} break-words dark:prose-invert`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedContent}
            </ReactMarkdown>
        </div>
    );
};

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
            if (pathname === '/admin/dashboard' || pathname === '/dashboard') {
                context = { page: 'dashboard' };
            } else if ((pathname.startsWith('/admin/assets/') || pathname.startsWith('/properties/')) && params.id) {
                context = { page: 'asset', assetId: params.id };
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.content })), // Send history without UI flags
                    context
                })
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.content,
                isTyping: true
            };

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
                <div className="pointer-events-auto bg-card w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-border flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">

                    {/* Header */}
                    <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center shadow-md">
                        <div className="flex items-center space-x-2">
                            <Bot size={20} />
                            <span className="font-semibold tracking-tight">Jand Assistant</span>
                        </div>
                        <button onClick={toggleChat} className="hover:bg-primary-foreground/10 p-1 rounded transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground mt-10 text-sm">
                                <p className="mb-4">👋 Hi! I'm the <span className="font-serif font-bold text-foreground">Jand<span className="text-primary">.</span></span> Homes Assistant.</p>
                                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">Try asking:</p>
                                <ul className="mt-4 space-y-2 text-xs">
                                    <li className="bg-card border border-border p-3 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all" onClick={() => setInput("What is the total value of my portfolio in Naira?")}>
                                        "What is the total value of my portfolio?"
                                    </li>
                                    <li className="bg-card border border-border p-3 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all" onClick={() => setInput("Which properties are currently active in Ajah?")}>
                                        "Which properties are active in Ajah?"
                                    </li>
                                    <li className="bg-card border border-border p-3 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all" onClick={() => setInput("What is my total monthly rental income?")}>
                                        "What is my total monthly rental income?"
                                    </li>
                                </ul>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed shadow-md transition-all duration-300 ${m.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-muted/80 backdrop-blur-sm border border-border text-foreground rounded-bl-none'
                                    }`}>
                                    <MessageContent message={m} isLast={i === messages.length - 1} />
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted border border-border rounded-2xl p-3 rounded-bl-none shadow-sm flex space-x-1 items-center">
                                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-card border-t border-border flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your assets..."
                            className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all text-foreground placeholder:text-muted-foreground"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className="pointer-events-auto bg-primary hover:scale-105 active:scale-95 text-primary-foreground p-4 rounded-full shadow-2xl transition-all flex items-center justify-center ring-4 ring-primary/10"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
