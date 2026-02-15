import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const footerLinks = [
    {
        title: 'Services',
        links: [
            { label: 'Strategy Consulting', href: '/services' },
            { label: 'AI & Automation', href: '/services' },
            { label: 'Cloud Transformation', href: '/services' },
            { label: 'Cybersecurity', href: '/services' },
            { label: 'Data & Analytics', href: '/services' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'Insights', href: '/insights' },
            { label: 'Case Studies', href: '/case-studies' },
            { label: 'Contact Us', href: '/contact' },
        ],
    },
    {
        title: 'Developers',
        links: [
            { label: 'GitHub Repository', href: '#' },
            { label: 'API Documentation', href: '#' },
            { label: 'Contributing Guide', href: '#' },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-ibm-gray-80 bg-ibm-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-ibm-blue-60 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm font-mono">IBM</span>
                            </div>
                            <span className="text-ibm-gray-10 font-semibold">Consulting</span>
                        </div>
                        <p className="text-ibm-gray-50 text-sm leading-relaxed">
                            Transforming enterprises with AI, hybrid cloud, and deep industry expertise.
                        </p>
                    </div>

                    {/* Links */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-ibm-gray-10 font-medium text-sm mb-4">{group.title}</h4>
                            <ul className="space-y-3">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-ibm-gray-50 hover:text-ibm-blue-40 text-sm transition-colors inline-flex items-center gap-1"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-ibm-gray-80 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-ibm-gray-60 text-xs">
                        © {new Date().getFullYear()} IBM. Built with Antigravity SDLC Framework.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-ibm-gray-60 hover:text-ibm-gray-30 text-xs transition-colors">Privacy</Link>
                        <Link href="#" className="text-ibm-gray-60 hover:text-ibm-gray-30 text-xs transition-colors">Terms</Link>
                        <Link href="#" className="text-ibm-gray-60 hover:text-ibm-gray-30 text-xs transition-colors">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
