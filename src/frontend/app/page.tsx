import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles, Globe, Shield, Cpu } from 'lucide-react';
import { AnimatedCounter } from '@/components/AnimatedCounter';

export default function HomePage() {
    return (
        <>
            {/* ─── Hero Section ──────────────────────────────── */}
            <section className="relative hero-gradient min-h-screen flex items-center overflow-hidden">
                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }} />
                </div>

                {/* Floating Orbs */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ibm-blue-40/20 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 left-1/6 w-64 h-64 bg-ibm-teal-40/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                    <div className="max-w-4xl">
                        <div className="section-animate">
                            <span className="tag mb-6 inline-block">IBM Consulting</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 section-animate section-animate-delay-1">
                            Transforming Enterprises
                            <br />
                            <span className="bg-gradient-to-r from-ibm-blue-30 to-ibm-teal-40 bg-clip-text text-transparent">
                                with AI & Cloud
                            </span>
                        </h1>

                        <p className="text-xl text-ibm-blue-20/80 max-w-2xl mb-12 leading-relaxed section-animate section-animate-delay-2">
                            We partner with the world&apos;s leading organizations to reimagine their businesses through
                            strategy, technology, and deep industry expertise.
                        </p>

                        <div className="flex flex-wrap gap-4 section-animate section-animate-delay-3">
                            <Link href="/services" className="btn-primary text-base">
                                Explore Our Services <ArrowRight size={18} />
                            </Link>
                            <Link href="/case-studies" className="btn-secondary text-base">
                                View Case Studies
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ──────────────────────────────── */}
            <section className="relative -mt-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-card p-8 md:p-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <AnimatedCounter end={160} suffix="K+" label="Consultants Worldwide" />
                        <AnimatedCounter end={170} suffix="+" label="Countries Served" />
                        <AnimatedCounter end={95} suffix="%" label="Fortune 500 Clients" />
                        <AnimatedCounter end={4} prefix="$" suffix=".4T" label="AI Value Potential" />
                    </div>
                </div>
            </section>

            {/* ─── Capabilities Preview ─────────────────────── */}
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                    <div className="accent-line mb-6" />
                    <h2 className="text-4xl font-bold text-ibm-gray-10 mb-4">
                        What We Do
                    </h2>
                    <p className="text-ibm-gray-50 text-lg max-w-2xl">
                        End-to-end consulting capabilities powered by technology and human expertise.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Sparkles size={24} />, title: 'Strategy', desc: 'Data-driven business transformation and operating model design.' },
                        { icon: <Cpu size={24} />, title: 'AI & Automation', desc: 'Enterprise AI deployment with IBM watsonx at scale.' },
                        { icon: <Globe size={24} />, title: 'Cloud', desc: 'Hybrid cloud migration and modernization on Red Hat OpenShift.' },
                        { icon: <Shield size={24} />, title: 'Security', desc: 'Zero-trust architecture and threat intelligence services.' },
                    ].map((cap, i) => (
                        <div key={cap.title} className={`glass-card p-8 group cursor-pointer section-animate section-animate-delay-${i + 1}`}>
                            <div className="w-12 h-12 rounded-lg bg-ibm-blue-60/10 flex items-center justify-center text-ibm-blue-40 mb-6 group-hover:bg-ibm-blue-60/20 transition-colors">
                                {cap.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-ibm-gray-10 mb-3">{cap.title}</h3>
                            <p className="text-ibm-gray-50 text-sm leading-relaxed">{cap.desc}</p>
                            <div className="mt-6 flex items-center gap-1 text-ibm-blue-40 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Learn more <ArrowUpRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/services" className="btn-secondary">
                        View All Services <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ─── CTA Section ──────────────────────────── */}
            <section className="py-32 border-t border-ibm-gray-80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-ibm-gray-10 mb-6">
                        Ready to transform?
                    </h2>
                    <p className="text-ibm-gray-50 text-lg max-w-xl mx-auto mb-10">
                        Let&apos;s build the future of your enterprise together.
                    </p>
                    <Link href="/contact" className="btn-primary text-lg px-8 py-4">
                        Start a Conversation <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </>
    );
}
