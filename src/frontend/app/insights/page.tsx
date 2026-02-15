import Link from 'next/link';
import { ArrowUpRight, Clock, User } from 'lucide-react';

// In a real app, this would fetch from the API
const insights = [
    {
        id: 'insight-001',
        title: 'The CEO\'s Guide to Generative AI',
        slug: 'ceo-guide-generative-ai',
        category: 'Artificial Intelligence',
        date: '2026-01-15',
        readTime: '12 min read',
        summary: 'Generative AI is redefining how enterprises create value. Leaders who act now will capture an outsized share of the estimated $4.4 trillion in annual productivity gains.',
        author: 'IBM Institute for Business Value',
        featured: true,
    },
    {
        id: 'insight-002',
        title: 'Hybrid Cloud: The Architecture of Resilience',
        slug: 'hybrid-cloud-architecture-resilience',
        category: 'Cloud & Infrastructure',
        date: '2026-01-08',
        readTime: '8 min read',
        summary: 'Organizations that embrace hybrid cloud architectures achieve 2.5x the value of those relying on a single platform or single-vendor approach.',
        author: 'IBM Cloud Advisory',
        featured: true,
    },
    {
        id: 'insight-003',
        title: 'Cybersecurity in the Age of Quantum Computing',
        slug: 'cybersecurity-quantum-computing',
        category: 'Security',
        date: '2025-12-20',
        readTime: '10 min read',
        summary: 'With quantum computing on the horizon, enterprises must begin their transition to quantum-safe cryptography today.',
        author: 'IBM Security Intelligence',
        featured: false,
    },
    {
        id: 'insight-004',
        title: 'Sustainability Transformation: From Ambition to Impact',
        slug: 'sustainability-transformation',
        category: 'Sustainability',
        date: '2025-12-10',
        readTime: '7 min read',
        summary: 'Leading companies are turning sustainability commitments into measurable business outcomes through data-driven ESG platforms.',
        author: 'IBM Sustainability Practice',
        featured: false,
    },
    {
        id: 'insight-005',
        title: 'The Talent Revolution: Reskilling for the AI Economy',
        slug: 'talent-revolution-reskilling',
        category: 'Talent & Organization',
        date: '2025-11-28',
        readTime: '9 min read',
        summary: 'By 2028, 40% of the global workforce will need reskilling. Organizations that invest now will secure a lasting competitive advantage.',
        author: 'IBM Talent Transformation',
        featured: false,
    },
];

export default function InsightsPage() {
    const featured = insights.filter(i => i.featured);
    const latest = insights.filter(i => !i.featured);

    return (
        <>
            {/* ─── Header ────────────────────────────────── */}
            <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="accent-line mb-6" />
                <h1 className="text-5xl md:text-6xl font-bold text-ibm-gray-10 mb-6 section-animate">
                    Insights
                </h1>
                <p className="text-xl text-ibm-gray-50 max-w-3xl leading-relaxed section-animate section-animate-delay-1">
                    Research, analysis, and perspectives from IBM&apos;s global network of consultants and strategists.
                </p>
            </section>

            {/* ─── Featured ──────────────────────────────── */}
            <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-sm font-medium text-ibm-gray-50 uppercase tracking-wider mb-8">Featured</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {featured.map((article, i) => (
                        <div key={article.id} className={`glass-card overflow-hidden group cursor-pointer section-animate section-animate-delay-${i + 1}`}>
                            {/* Gradient Banner */}
                            <div className="h-48 bg-gradient-to-br from-ibm-blue-80 via-ibm-blue-60 to-ibm-teal-50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(69,137,255,0.3),transparent_50%)]" />
                                <div className="absolute bottom-4 left-6">
                                    <span className="tag">{article.category}</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-semibold text-ibm-gray-10 mb-3 group-hover:text-ibm-blue-40 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-ibm-gray-50 text-sm leading-relaxed mb-6">{article.summary}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-ibm-gray-60 text-xs">
                                        <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                                    </div>
                                    <ArrowUpRight size={18} className="text-ibm-blue-40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Latest Articles ────────────────────────── */}
            <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-sm font-medium text-ibm-gray-50 uppercase tracking-wider mb-8 border-t border-ibm-gray-80 pt-8">Latest</h2>
                <div className="space-y-0 divide-y divide-ibm-gray-80">
                    {latest.map((article) => (
                        <div key={article.id} className="py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 group cursor-pointer hover:bg-ibm-gray-90/30 px-4 -mx-4 rounded-lg transition-colors">
                            <span className="tag shrink-0">{article.category}</span>
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold text-ibm-gray-10 group-hover:text-ibm-blue-40 transition-colors mb-1">
                                    {article.title}
                                </h3>
                                <p className="text-ibm-gray-50 text-sm">{article.summary}</p>
                            </div>
                            <div className="flex items-center gap-3 text-ibm-gray-60 text-xs shrink-0">
                                <span>{article.readTime}</span>
                                <ArrowUpRight size={16} className="text-ibm-blue-40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
