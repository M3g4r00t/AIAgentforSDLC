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
    image?: string;
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
                                            className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform flex flex-col h-full"
                                        >
                                            <div className={`h-48 relative overflow-hidden ${!article.image ? `bg-gradient-to-br ${gradients[i % gradients.length]}` : ''}`}>
                                                {article.image ? (
                                                    <img
                                                        src={article.image}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', ...gradients[i % gradients.length].split(' '));
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="absolute top-4 left-4">
                                                    <span className="text-xs uppercase tracking-wider bg-black/60 text-white px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                                        {article.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-xl font-semibold mb-3 group-hover:text-ibm-blue transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.summary}</p>
                                                <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-gray-500 border-t border-white/5">
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
                                    {latest.map((article, i) => (
                                        <a
                                            key={article.slug}
                                            href={article.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-card rounded-xl p-4 sm:p-6 flex items-start sm:items-center gap-4 sm:gap-6 hover:scale-[1.01] transition-transform group"
                                        >
                                            <div className="hidden sm:block w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-800">
                                                {article.image ? (
                                                    <img
                                                        src={article.image}
                                                        alt=""
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.parentElement?.classList.add('bg-gradient-to-b', 'from-ibm-blue', 'to-ibm-purple');
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-b from-ibm-blue to-ibm-purple" />
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <span className="text-xs text-ibm-blue uppercase tracking-wider block mb-1">{article.category}</span>
                                                <h3 className="text-lg font-semibold group-hover:text-ibm-blue transition-colors line-clamp-2 mb-2">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{article.summary}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="truncate max-w-[100px]">{article.author}</span>
                                                    <span>{article.readTime}</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="hidden sm:block w-5 h-5 text-gray-500 group-hover:text-ibm-blue transition-colors flex-shrink-0" />
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
