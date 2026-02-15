import { Sparkles, Cpu, Globe, Shield, BarChart3, Leaf, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const services = [
    {
        icon: <Sparkles size={28} />,
        title: 'Strategy Consulting',
        description: 'Transform your business model with data-driven strategy, operating model design, and AI-powered decision frameworks that deliver measurable outcomes.',
        capabilities: ['Business Transformation', 'Operating Model Design', 'M&A Integration', 'Digital Strategy'],
        color: 'from-ibm-blue-60 to-ibm-blue-40',
    },
    {
        icon: <Cpu size={28} />,
        title: 'AI & Automation',
        description: 'Deploy enterprise AI at scale with IBM watsonx, intelligent automation platforms, and custom ML models tailored to your industry.',
        capabilities: ['IBM watsonx Deployment', 'Intelligent Workflows', 'NLP & Computer Vision', 'MLOps & AI Governance'],
        color: 'from-ibm-purple-60 to-ibm-purple-50',
    },
    {
        icon: <Globe size={28} />,
        title: 'Cloud Transformation',
        description: 'Modernize your infrastructure with hybrid cloud architectures using Red Hat OpenShift, IBM Cloud, and multi-cloud strategies.',
        capabilities: ['Cloud Migration', 'Application Modernization', 'Kubernetes & Containers', 'Multi-Cloud Management'],
        color: 'from-ibm-cyan-50 to-ibm-cyan-40',
    },
    {
        icon: <Shield size={28} />,
        title: 'Cybersecurity Services',
        description: 'Protect your enterprise with zero-trust architecture, quantum-safe security, and 24/7 managed detection and response.',
        capabilities: ['Zero Trust Architecture', 'Threat Intelligence', 'Incident Response', 'Quantum-Safe Cryptography'],
        color: 'from-ibm-teal-50 to-ibm-teal-40',
    },
    {
        icon: <BarChart3 size={28} />,
        title: 'Data & Analytics',
        description: 'Unlock the value of your data with modern data platforms, governance frameworks, and real-time analytics solutions.',
        capabilities: ['Data Platform Modernization', 'Data Governance', 'Real-Time Analytics', 'Data Mesh Architecture'],
        color: 'from-ibm-blue-50 to-ibm-teal-40',
    },
    {
        icon: <Leaf size={28} />,
        title: 'Sustainability',
        description: 'Accelerate your ESG goals with IBM Envizi and end-to-end sustainability transformation, turning commitments into measurable outcomes.',
        capabilities: ['ESG Reporting & Analytics', 'Carbon Footprint Reduction', 'Sustainable Supply Chain', 'Green IT Strategy'],
        color: 'from-ibm-teal-60 to-ibm-teal-40',
    },
];

export default function ServicesPage() {
    return (
        <>
            {/* ─── Header ──────────────────────────────── */}
            <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="accent-line mb-6" />
                <h1 className="text-5xl md:text-6xl font-bold text-ibm-gray-10 mb-6 section-animate">
                    Our Services
                </h1>
                <p className="text-xl text-ibm-gray-50 max-w-3xl leading-relaxed section-animate section-animate-delay-1">
                    From strategy to execution, we bring the expertise, technology, and
                    industry knowledge to transform your most complex challenges into competitive advantages.
                </p>
            </section>

            {/* ─── Services Grid ───────────────────────── */}
            <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <div key={service.title} className={`glass-card p-8 flex flex-col section-animate section-animate-delay-${(i % 4) + 1}`}>
                            {/* Icon with gradient background */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-6`}>
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-semibold text-ibm-gray-10 mb-4">{service.title}</h3>
                            <p className="text-ibm-gray-50 text-sm leading-relaxed mb-6 flex-grow">{service.description}</p>

                            {/* Capabilities */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {service.capabilities.map((cap) => (
                                    <span key={cap} className="tag">{cap}</span>
                                ))}
                            </div>

                            <div className="flex items-center gap-1 text-ibm-blue-40 text-sm font-medium cursor-pointer group">
                                Learn More
                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────── */}
            <section className="py-24 border-t border-ibm-gray-80 bg-ibm-gray-90/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-ibm-gray-10 mb-4">
                        Need a tailored solution?
                    </h2>
                    <p className="text-ibm-gray-50 text-lg mb-8 max-w-xl mx-auto">
                        Our consultants combine deep industry expertise with cutting-edge technology.
                    </p>
                    <Link href="/contact" className="btn-primary text-base">
                        Contact Our Team <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </>
    );
}
