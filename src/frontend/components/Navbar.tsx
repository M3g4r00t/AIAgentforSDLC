'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'Insights', href: '/insights' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact', href: '/contact' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ibm-gray-80/50 bg-ibm-gray-100/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-ibm-blue-60 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm font-mono">IBM</span>
                        </div>
                        <span className="text-ibm-gray-10 font-semibold text-lg tracking-tight">
                            Consulting
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 text-sm text-ibm-gray-30 hover:text-ibm-gray-10 transition-colors duration-200 rounded-lg hover:bg-ibm-gray-80/50"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="ml-4 btn-primary text-sm"
                        >
                            Let&apos;s Talk <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-ibm-gray-30 hover:text-ibm-gray-10"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-ibm-gray-80 bg-ibm-gray-100/95 backdrop-blur-xl">
                    <div className="px-4 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-3 text-ibm-gray-30 hover:text-ibm-gray-10 hover:bg-ibm-gray-80/50 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
