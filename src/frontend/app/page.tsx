'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Brain, Cloud, Shield, Globe, Zap } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { usePersona } from '@/context/PersonaContext';

// ─── Animated Counter Component (inline for homepage) ───────
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let frame: number;
        const start = performance.now();
        const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * end));
            if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [started, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Stats Data ─────────────────────────────────────────────
const stats = [
    { value: 160000, suffix: '+', label: 'Consultants Worldwide' },
    { value: 170, suffix: '+', label: 'Countries Served' },
    { value: 95, suffix: '%', label: 'Fortune 500 Clients' },
    { value: 40, suffix: '+', label: 'Years of Innovation' },
];

const capabilities = [
    { icon: Brain, title: 'AI & Automation', desc: 'Deploy enterprise AI at scale with IBM watsonx.', color: 'from-blue-500 to-purple-600' },
    { icon: Cloud, title: 'Cloud Transformation', desc: 'Modernize with hybrid cloud on Red Hat OpenShift.', color: 'from-cyan-500 to-blue-600' },
    { icon: Shield, title: 'Cybersecurity', desc: 'Zero-trust architecture and quantum-safe security.', color: 'from-emerald-500 to-teal-600' },
    { icon: BarChart3, title: 'Data & Analytics', desc: 'Unlock value with modern data platforms.', color: 'from-amber-500 to-orange-600' },
];

const PERSONA_CONTENT = {
    default: {
        headline: <>Orchestrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-ibm-blue to-ibm-purple">AI at Scale</span></>,
        subhead: "IBM Consulting® is where trusted expertise meets powerful technology. We advise, design, build, and operate business innovation that matters.",
    },
    cfo: {
        headline: <>Maximize Value. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Minimize Risk.</span></>,
        subhead: "Transform finance operations with AI-driven insights. Reduce costs, optimize cash flow, and drive profitable growth with IBM Consulting.",
    },
    cto: {
        headline: <>Build the Future. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Scale with AI.</span></>,
        subhead: "Modernize your architecture with hybrid cloud and generative AI. Secure, scalable, and built for the next generation of business.",
    },
    cmo: {
        headline: <>Captivate Audiences. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Drive Growth.</span></>,
        subhead: "Reimagine customer experiences (iX) with data and design. Create personalized journeys that convert and retain.",
    }
};

export default function HomePage() {
    const { persona } = usePersona(); // Hook from context
    const [insights, setInsights] = useState<any[]>([]);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        fetch(`${apiUrl}/api/insights?featured=true`)
            .then(r => r.json())
            .then(d => setInsights(d.data?.slice(0, 3) || []))
            .catch(() => { });
    }, []);

    const content = PERSONA_CONTENT[persona] || PERSONA_CONTENT.default;

    // Reorder capabilities based on persona
    const getSortedCapabilities = () => {
        const caps = [...capabilities];
        if (persona === 'cfo') return caps.sort((a, b) => (a.title.includes('Data') ? -1 : 1));
        if (persona === 'cto') return caps.sort((a, b) => (a.title.includes('Cloud') || a.title.includes('Cyber') ? -1 : 1));
        if (persona === 'cmo') return caps.sort((a, b) => (a.title.includes('AI') ? -1 : 1)); // AI is key for personalization
        return caps;
    };

    const displayCapabilities = getSortedCapabilities();

    return (
        <main className="min-h-screen">
            {/* ─── Hero Section ────────────────────────────── */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden transition-colors duration-700">
                <div className="absolute inset-0 animated-gradient opacity-30" />
                {/* Dynamic colored blobs based on theme are handled by globals.css vars if we used them, 
                    but here we can also use conditional classes if desired. For now, sticking to the standard ones 
                    but they could be 'bg-hero-dynamic' for more effect. */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-ibm-blue/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-ibm-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

                <div className="relative z-10 container mx-auto px-6 lg:px-12">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                            <Zap className="w-4 h-4 text-ibm-blue" />
                            <span className="text-sm text-gray-300">Powered by IBM watsonx</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                            {content.headline}
                        </h1>

                        <p className="text-xl lg:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
                            {content.subhead}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/services" className="group inline-flex items-center gap-2 px-8 py-4 bg-ibm-blue hover:bg-ibm-blue/90 rounded-lg font-semibold transition-all">
                                Explore Services
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/5 rounded-lg font-semibold transition-all">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ───────────────────────────────── */}
            <section className="border-y border-white/10 bg-black/30 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-ibm-blue mb-2">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Capabilities Preview ────────────────────── */}
            <section className="container mx-auto px-6 lg:px-12 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Capabilities</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        End-to-end consulting powered by IBM&apos;s technology leadership
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayCapabilities.map((cap, i) => (
                        <div key={i} className="glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300 group">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cap.color} flex items-center justify-center mb-4`}>
                                <cap.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{cap.title}</h3>
                            <p className="text-gray-400 text-sm">{cap.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/services" className="group inline-flex items-center gap-2 text-ibm-blue hover:text-ibm-blue/80 font-semibold">
                        View All Services
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* ─── Featured Insights ───────────────────────── */}
            {insights.length > 0 && (
                <section className="container mx-auto px-6 lg:px-12 py-24 border-t border-white/10">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-2">Latest Insights</h2>
                            <p className="text-gray-400">Thought leadership from IBM experts</p>
                        </div>
                        <Link href="/insights" className="text-ibm-blue hover:text-ibm-blue/80 font-semibold flex items-center gap-1">
                            All Insights <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {insights.map((insight: any, i: number) => (
                            <article key={i} className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
                                <div className={`h-2 bg-gradient-to-r ${i === 0 ? 'from-ibm-blue to-ibm-purple' : i === 1 ? 'from-cyan-500 to-blue-600' : 'from-emerald-500 to-teal-600'}`} />
                                <div className="p-6">
                                    <span className="text-xs text-ibm-blue uppercase tracking-wider">{insight.category}</span>
                                    <h3 className="text-lg font-semibold mt-2 mb-3 line-clamp-2">{insight.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">{insight.summary}</p>
                                    <div className="mt-4 text-xs text-gray-500">{insight.author} · {insight.readTime}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── CTA Section ─────────────────────────────── */}
            <section className="container mx-auto px-6 lg:px-12 py-24">
                <div className="glass-card rounded-2xl p-12 lg:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 animated-gradient opacity-10" />
                    <div className="relative z-10">
                        <Globe className="w-12 h-12 text-ibm-blue mx-auto mb-6" />
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
                            Let&apos;s discuss how IBM Consulting can help you unlock new opportunities.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-ibm-blue hover:bg-ibm-blue/90 rounded-lg font-semibold transition-all">
                            Start a Conversation
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
