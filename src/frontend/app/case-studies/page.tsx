'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Award, ExternalLink } from 'lucide-react';

interface CaseStudy {
    slug: string;
    client: string;
    industry: string;
    challenge: string;
    results: { metric: string; value: string }[];
    technologies: string[];
    url?: string;
}

const gradients = [
    'from-ibm-blue to-ibm-purple',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
];

export default function CaseStudiesPage() {
    const [studies, setStudies] = useState<CaseStudy[]>([]);
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        fetch(`${apiUrl}/api/case-studies`)
            .then(r => r.json())
            .then(d => {
                setStudies(d.data || []);
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
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-ibm-blue" />
                        <span className="text-sm text-ibm-blue uppercase tracking-wider">Client Success</span>
                        {source && (
                            <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                                {source === 'live' ? '🟢 Live content' : '📁 Cached content'}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-4">Case Studies</h1>
                    <p className="text-xl text-gray-400">
                        See how IBM Consulting helps the world&apos;s leading organizations
                        transform and thrive with technology.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card rounded-xl h-72 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {studies.map((study, i) => (
                            <article
                                key={study.slug}
                                className="glass-card rounded-xl overflow-hidden hover:scale-[1.02] transition-transform group"
                            >
                                {/* Gradient header */}
                                <div className={`h-3 bg-gradient-to-r ${gradients[i % gradients.length]}`} />

                                <div className="p-6">
                                    {/* Industry tag */}
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                                        {study.industry}
                                    </span>

                                    {/* Client name */}
                                    <h3 className="text-xl font-semibold mt-2 mb-3 group-hover:text-ibm-blue transition-colors line-clamp-2">
                                        {study.client}
                                    </h3>

                                    {/* Challenge */}
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {study.challenge}
                                    </p>

                                    {/* Results */}
                                    {study.results && study.results.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            {study.results.slice(0, 4).map((r, j) => (
                                                <div key={j} className="bg-white/5 rounded-lg p-3">
                                                    <div className="text-lg font-bold text-ibm-blue">{r.value}</div>
                                                    <div className="text-xs text-gray-400">{r.metric}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {study.technologies?.slice(0, 4).map((tech, j) => (
                                            <span
                                                key={j}
                                                className="text-xs bg-ibm-blue/10 text-ibm-blue px-2 py-1 rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Link */}
                                    {study.url && (
                                        <a
                                            href={study.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-ibm-blue hover:text-ibm-blue/80 font-medium"
                                        >
                                            Read Full Story <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
