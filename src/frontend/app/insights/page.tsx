'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react';

interface Insight {
    slug: string;
    title: string;
    summary: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    featured: boolean;
    url?: string;
}

const gradients = [
    'from-ibm-blue to-ibm-purple',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
];

export default function InsightsPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        fetch(`${apiUrl}/api/insights`)
            .then(r => r.json())
            .then(d => {
                setInsights(d.data || []);
                setSource(d.source || 'unknown');
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const featured = insights.filter(i => i.featured);
    const latest = insights.filter(i => !i.featured);

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-ibm-blue" />
                        <span className="text-sm text-ibm-blue uppercase tracking-wider">Thought Leadership</span>
                        {source && (
                            <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                                {source === 'live' ? '🟢 Live content' : '📁 Cached content'}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-4">Insights & Research</h1>
                    <p className="text-xl text-gray-400">
                        Expert perspectives on AI, cloud, cybersecurity, and digital transformation
                        from IBM consultants and thought leaders.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card rounded-xl h-64 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Featured Articles */}
                        {featured.length > 0 && (
                            <section className="mb-16">
                                <h2 className="text-2xl font-bold mb-8">Featured</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {featured.map((article, i) => (
                                        <a
                                            key={article.slug}
                                            href={article.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform"
                                        >
                                            <div className={`h-48 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-end p-6`}>
                                                <span className="text-xs uppercase tracking-wider bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                                    {article.category}
                                                </span>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold mb-3 group-hover:text-ibm-blue transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.summary}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Latest Articles */}
                        {latest.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
                                <div className="space-y-4">
                                    {latest.map((article) => (
                                        <a
                                            key={article.slug}
                                            href={article.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-card rounded-xl p-6 flex items-center gap-6 hover:scale-[1.01] transition-transform group"
                                        >
                                            <div className="hidden md:block w-2 h-16 rounded-full bg-gradient-to-b from-ibm-blue to-ibm-purple flex-shrink-0" />
                                            <div className="flex-grow">
                                                <span className="text-xs text-ibm-blue uppercase tracking-wider">{article.category}</span>
                                                <h3 className="text-lg font-semibold mt-1 group-hover:text-ibm-blue transition-colors line-clamp-1">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1 line-clamp-1">{article.summary}</p>
                                            </div>
                                            <div className="hidden lg:flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                                                <span>{article.author}</span>
                                                <span>{article.readTime}</span>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-ibm-blue transition-colors flex-shrink-0" />
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
