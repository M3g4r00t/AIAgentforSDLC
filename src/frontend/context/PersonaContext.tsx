'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PersonaType = 'default' | 'cfo' | 'cto' | 'cmo';

interface PersonaContextType {
    persona: PersonaType;
    setPersona: (persona: PersonaType) => void;
    theme: {
        primary: string;
        secondary: string;
        accent: string;
        heroGradient: string;
    };
}

const THEMES = {
    default: {
        primary: 'blue-600',
        secondary: 'slate-900',
        accent: 'cyan-400',
        heroGradient: 'from-blue-600 via-purple-600 to-indigo-600',
    },
    cfo: {
        primary: 'emerald-600',
        secondary: 'slate-800',
        accent: 'teal-400',
        heroGradient: 'from-emerald-700 via-teal-600 to-cyan-600',
    },
    cto: {
        primary: 'indigo-500',
        secondary: 'black',
        accent: 'violet-400',
        heroGradient: 'from-violet-600 via-fuchsia-600 to-pink-600', // Cyberpunk vibe
    },
    cmo: {
        primary: 'rose-500',
        secondary: 'zinc-900',
        accent: 'orange-400',
        heroGradient: 'from-orange-500 via-rose-500 to-purple-600', // Vibrant/Creative
    },
};

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
    const [persona, setPersonaState] = useState<PersonaType>('default');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('ibm-persona') as PersonaType;
        if (saved && THEMES[saved]) {
            setPersonaState(saved);
        }
        setMounted(true);
    }, []);

    const setPersona = (p: PersonaType) => {
        setPersonaState(p);
        localStorage.setItem('ibm-persona', p);

        // Update body attribute for global CSS hooks if needed
        document.documentElement.setAttribute('data-theme', p);
    };

    // Prevent hydration mismatch by rendering children only after mount, 
    // or dealing with initial state carefully. For now, simple return.
    // Ideally we'd use a comprehensive theme provider, but this works for MVP.

    return (
        <PersonaContext.Provider value={{ persona, setPersona, theme: THEMES[persona] }}>
            <div data-theme={persona} className="min-h-screen transition-colors duration-500">
                {children}
            </div>
        </PersonaContext.Provider>
    );
}

export function usePersona() {
    const context = useContext(PersonaContext);
    if (context === undefined) {
        throw new Error('usePersona must be used within a PersonaProvider');
    }
    return context;
}
