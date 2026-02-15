'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePersona } from '../context/PersonaContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, MessageSquare, Bot } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'strategist';
    sources?: { title: string; url: string }[];
}

export default function StrategistWidget() {
    const { persona, theme } = usePersona();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: `Hello! I'm The Strategist. As a ${persona === 'default' ? 'visitor' : persona.toUpperCase()}, what strategic insights are you looking for today?`, sender: 'strategist' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Update welcome message when persona changes
    useEffect(() => {
        if (messages.length === 1) {
            setMessages([{ id: '1', text: `Hello! I'm The Strategist. As a ${persona === 'default' ? 'visitor' : persona.toUpperCase()}, what strategic insights are you looking for today?`, sender: 'strategist' }]);
        }
    }, [persona]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: query, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${apiUrl}/api/strategist/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.text, persona })
            });
            const data = await res.json();

            const strategistMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.answer,
                sender: 'strategist',
                sources: data.sources
            };
            setMessages(prev => [...prev, strategistMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: 'err', text: "I'm having trouble connecting to the strategy database.", sender: 'strategist' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 sm:w-96 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className={`p-4 bg-gradient-to-r ${theme.heroGradient} flex justify-between items-center`}>
                            <div className="flex items-center gap-2 text-white">
                                <Sparkles size={18} />
                                <span className="font-bold text-sm tracking-wider">THE STRATEGIST</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.sender === 'user'
                                        ? 'bg-ibm-blue text-white rounded-br-none'
                                        : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                                        }`}>
                                        <p>{msg.text}</p>
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-white/10">
                                                <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Sources</p>
                                                <ul className="space-y-1">
                                                    {msg.sources.map((s, i) => (
                                                        <li key={i}>
                                                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ibm-blue-40 text-xs hover:underline flex items-center gap-1">
                                                                Running • {s.title}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-2xl p-3 rounded-bl-none flex gap-1">
                                        <div className="w-2 h-2 bg-ibm-blue rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-ibm-blue rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-ibm-blue rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask for strategic insights..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-ibm-blue"
                                />
                                <button
                                    type="submit"
                                    disabled={!query.trim() || isLoading}
                                    className="bg-ibm-blue hover:bg-ibm-blue/90 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group ${isOpen ? 'bg-white text-black' : `bg-gradient-to-br ${theme.heroGradient} text-white`
                    }`}
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Ask The Strategist
                </span>
            </button>
        </div>
    );
}
