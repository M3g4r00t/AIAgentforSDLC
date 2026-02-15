'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Cloud, Shield, BarChart3, Leaf, Lightbulb } from 'lucide-react';

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    url?: string;
    image?: string;
}

const iconMap: Record<string, any> = {
    strategy: Lightbulb,
    ai: Brain,
    cloud: Cloud,
    security: Shield,
    data: BarChart3,
    sustainability: Leaf,
};

const gradientMap: Record<string, string> = {
    strategy: 'from-violet-500 to-purple-600',
    ai: 'from-blue-500 to-indigo-600',
    cloud: 'from-cyan-500 to-blue-600',
    security: 'from-emerald-500 to-teal-600',
    data: 'from-amber-500 to-orange-600',
    sustainability: 'from-green-500 to-emerald-600',
};

const capabilityTags: Record<string, string[]> = {
    strategy: ['Digital Strategy', 'Business Model Innovation', 'M&A Advisory', 'Operating Model Design'],
    ai: ['IBM watsonx', 'Generative AI', 'Intelligent Automation', 'MLOps'],
    cloud: ['Red Hat OpenShift', 'Hybrid Cloud', 'Cloud Migration', 'Kubernetes'],
    security: ['Zero Trust', 'Quantum-Safe', 'Threat Intelligence', 'IAM'],
    data: ['Data Fabric', 'Real-Time Analytics', 'Data Governance', 'AI-Ready Data'],
    sustainability: ['IBM Envizi', 'Carbon Footprint', 'ESG Reporting', 'Circular Economy'],
};

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        fetch(`${apiUrl}/api/services`)
            .then(r => r.json())
            .then(d => {
                setServices(d.data || []);
                setSource(d.source || 'unknown');
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <span className="text-sm text-ibm-blue uppercase tracking-wider mb-4 block">Our Expertise</span>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-4">Services & Capabilities</h1>
                    <p className="text-xl text-gray-400">
                        End-to-end consulting that combines deep industry expertise with
                        IBM&apos;s technology leadership to drive transformational outcomes.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="glass-card rounded-xl h-72 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => {
                            const Icon = iconMap[service.icon] || iconMap[service.id] || Lightbulb;
                            const gradient = gradientMap[service.icon] || gradientMap[service.id] || 'from-ibm-blue to-ibm-purple';
                            const tags = capabilityTags[service.icon] || capabilityTags[service.id] || [];

                            return (
                                <div
                                    key={service.id}
                                    className="glass-card rounded-xl overflow-hidden hover:scale-[1.03] transition-transform group flex flex-col h-full"
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        {service.image ? (
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                                        )}
                                        <div className="absolute top-4 left-4 w-12 h-12 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-semibold mb-3 group-hover:text-ibm-blue transition-colors">
                                            {service.title}
                                        </h3>

                                        <p className="text-gray-400 mb-6 line-clamp-3">
                                            {service.description}
                                        </p>

                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                                {tags.map((tag, j) => (
                                                    <span key={j} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {service.url && (
                                            <a
                                                href={service.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-ibm-blue text-sm font-medium flex items-center gap-1 mt-auto pt-4 border-t border-white/5"
                                            >
                                                Learn More <ArrowRight className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-20 glass-card rounded-2xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 animated-gradient opacity-10" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
                        <p className="text-gray-400 max-w-xl mx-auto mb-8">
                            Our consulting teams tailor solutions to your unique business challenges.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-ibm-blue hover:bg-ibm-blue/90 rounded-lg font-semibold transition-all"
                        >
                            Start a Conversation <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
