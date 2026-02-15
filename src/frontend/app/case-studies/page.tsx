import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const caseStudies = [
    {
        id: 'case-001',
        title: 'Global Bank Transforms Customer Experience with AI',
        industry: 'Financial Services',
        challenge: 'A top-10 global bank faced declining customer satisfaction scores and increasing operational costs in its retail banking division.',
        results: [
            { metric: '40%', label: 'Reduction in call center volume' },
            { metric: '$120M', label: 'Annual cost savings' },
            { metric: '35pts', label: 'NPS improvement' },
            { metric: '3.8M', label: 'AI-handled interactions/month' },
        ],
        technologies: ['IBM watsonx', 'Red Hat OpenShift', 'IBM Cloud Pak for Data'],
        gradient: 'from-ibm-blue-80 via-ibm-blue-60 to-ibm-purple-60',
    },
    {
        id: 'case-002',
        title: 'Healthcare Network Achieves Zero-Downtime Migration',
        industry: 'Healthcare',
        challenge: 'A network of 200+ hospitals needed to migrate from legacy on-premises systems to a hybrid cloud infrastructure without disrupting critical patient care systems.',
        results: [
            { metric: '0', label: 'Minutes of downtime' },
            { metric: '60%', label: 'Infrastructure cost reduction' },
            { metric: '200+', label: 'Hospitals migrated' },
            { metric: '99.99%', label: 'Uptime SLA achieved' },
        ],
        technologies: ['Red Hat OpenShift', 'IBM Cloud', 'IBM Instana'],
        gradient: 'from-ibm-teal-60 via-ibm-teal-50 to-ibm-cyan-50',
    },
    {
        id: 'case-003',
        title: 'Automotive Giant Builds AI-Powered Supply Chain',
        industry: 'Automotive & Manufacturing',
        challenge: 'A Fortune 100 automaker suffered $2B in losses from supply chain disruptions and needed predictive visibility across 12,000+ suppliers.',
        results: [
            { metric: '85%', label: 'Disruption prediction accuracy' },
            { metric: '$800M', label: 'Risk exposure mitigated' },
            { metric: '12K+', label: 'Suppliers monitored in real-time' },
            { metric: '50%', label: 'Faster response to disruptions' },
        ],
        technologies: ['IBM Sterling', 'IBM watsonx', 'IBM Cloud Pak for Business Automation'],
        gradient: 'from-ibm-purple-60 via-ibm-blue-60 to-ibm-cyan-50',
    },
];

export default function CaseStudiesPage() {
    return (
        <>
            {/* ─── Header ────────────────────────────────── */}
            <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="accent-line mb-6" />
                <h1 className="text-5xl md:text-6xl font-bold text-ibm-gray-10 mb-6 section-animate">
                    Case Studies
                </h1>
                <p className="text-xl text-ibm-gray-50 max-w-3xl leading-relaxed section-animate section-animate-delay-1">
                    Real results from real transformations. See how we help the world&apos;s leading enterprises
                    solve their most complex challenges.
                </p>
            </section>

            {/* ─── Case Studies ───────────────────────────── */}
            <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {caseStudies.map((study, i) => (
                    <div key={study.id} className={`glass-card overflow-hidden section-animate section-animate-delay-${(i % 4) + 1}`}>
                        {/* Gradient Top Bar */}
                        <div className={`h-2 bg-gradient-to-r ${study.gradient}`} />

                        <div className="p-8 md:p-12">
                            {/* Industry + Title */}
                            <span className="tag mb-4 inline-block">{study.industry}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-ibm-gray-10 mb-6">
                                {study.title}
                            </h2>

                            {/* Challenge */}
                            <div className="mb-10">
                                <h3 className="text-sm font-medium text-ibm-gray-50 uppercase tracking-wider mb-3">The Challenge</h3>
                                <p className="text-ibm-gray-30 text-lg leading-relaxed">{study.challenge}</p>
                            </div>

                            {/* Results Grid */}
                            <div className="mb-10">
                                <h3 className="text-sm font-medium text-ibm-gray-50 uppercase tracking-wider mb-6">Results</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {study.results.map((r) => (
                                        <div key={r.label} className="text-center p-4 rounded-xl bg-ibm-gray-90/50 border border-ibm-gray-80">
                                            <div className="text-3xl md:text-4xl font-bold text-ibm-blue-40 mb-2">{r.metric}</div>
                                            <div className="text-ibm-gray-50 text-xs">{r.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technologies */}
                            <div>
                                <h3 className="text-sm font-medium text-ibm-gray-50 uppercase tracking-wider mb-3">Technologies Used</h3>
                                <div className="flex flex-wrap gap-2">
                                    {study.technologies.map((tech) => (
                                        <span key={tech} className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-ibm-gray-90 text-ibm-teal-40 border border-ibm-gray-80">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ─── CTA ──────────────────────────────────── */}
            <section className="py-24 border-t border-ibm-gray-80 bg-ibm-gray-90/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-ibm-gray-10 mb-4">
                        Your transformation starts here
                    </h2>
                    <p className="text-ibm-gray-50 text-lg mb-8 max-w-xl mx-auto">
                        Let&apos;s discuss how we can deliver similar results for your organization.
                    </p>
                    <Link href="/contact" className="btn-primary text-base">
                        Talk to an Expert <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>
        </>
    );
}
