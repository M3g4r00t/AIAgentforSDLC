'use client';

import React from 'react';
import { usePersona, PersonaType } from '../context/PersonaContext';
import { motion } from 'framer-motion';

const PERSONAS: { id: PersonaType; label: string; icon: string }[] = [
    { id: 'default', label: 'Visitor', icon: '👋' },
    { id: 'cfo', label: 'CFO', icon: '📈' },
    { id: 'cto', label: 'CTO', icon: '⚡' },
    { id: 'cmo', label: 'CMO', icon: '🎨' },
];

export default function PersonaSwitcher() {
    const { persona, setPersona } = usePersona();

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="glass-panel p-2 rounded-full flex gap-1 shadow-2xl border border-white/20 bg-black/60 backdrop-blur-md">
                {PERSONAS.map((p) => {
                    const isActive = persona === p.id;
                    return (
                        <button
                            key={p.id}
                            onClick={() => setPersona(p.id)}
                            className={`
                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
              `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activePersona"
                                    className="absolute inset-0 bg-white/20 rounded-full"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <span>{p.icon}</span>
                                <span className={isActive ? 'inline-block' : 'hidden sm:inline-block'}>
                                    {p.label}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="text-right mt-2 mr-2 text-[10px] text-gray-500 uppercase tracking-widest font-mono hidden sm:block">
                Contextual Experience Engine
            </div>
        </div>
    );
}
