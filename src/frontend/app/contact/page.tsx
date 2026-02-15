'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, POST to /api/contact
        setSubmitted(true);
    };

    return (
        <>
            {/* ─── Header ────────────────────────────────── */}
            <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="accent-line mb-6" />
                <h1 className="text-5xl md:text-6xl font-bold text-ibm-gray-10 mb-6 section-animate">
                    Let&apos;s Talk
                </h1>
                <p className="text-xl text-ibm-gray-50 max-w-3xl leading-relaxed section-animate section-animate-delay-1">
                    Whether you&apos;re exploring a new initiative or accelerating an existing one, we&apos;re here to help.
                </p>
            </section>

            {/* ─── Form + Info ─────────────────────────────── */}
            <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <div className="glass-card p-8 md:p-12">
                            {submitted ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-full bg-ibm-teal-60/20 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle size={32} className="text-ibm-teal-40" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-ibm-gray-10 mb-3">Thank you!</h3>
                                    <p className="text-ibm-gray-50">We&apos;ll be in touch within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-ibm-gray-30 mb-2">Full Name *</label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-ibm-gray-90 border border-ibm-gray-70 rounded-lg text-ibm-gray-10 placeholder-ibm-gray-60 focus:outline-none focus:border-ibm-blue-60 focus:ring-1 focus:ring-ibm-blue-60 transition-colors"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-ibm-gray-30 mb-2">Email *</label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-ibm-gray-90 border border-ibm-gray-70 rounded-lg text-ibm-gray-10 placeholder-ibm-gray-60 focus:outline-none focus:border-ibm-blue-60 focus:ring-1 focus:ring-ibm-blue-60 transition-colors"
                                                placeholder="jane@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-ibm-gray-30 mb-2">Company</label>
                                        <input
                                            id="company"
                                            type="text"
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            className="w-full px-4 py-3 bg-ibm-gray-90 border border-ibm-gray-70 rounded-lg text-ibm-gray-10 placeholder-ibm-gray-60 focus:outline-none focus:border-ibm-blue-60 focus:ring-1 focus:ring-ibm-blue-60 transition-colors"
                                            placeholder="Acme Corp"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-ibm-gray-30 mb-2">How can we help? *</label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="w-full px-4 py-3 bg-ibm-gray-90 border border-ibm-gray-70 rounded-lg text-ibm-gray-10 placeholder-ibm-gray-60 focus:outline-none focus:border-ibm-blue-60 focus:ring-1 focus:ring-ibm-blue-60 transition-colors resize-none"
                                            placeholder="Tell us about your project or challenge..."
                                        />
                                    </div>

                                    <button type="submit" className="btn-primary w-full justify-center text-base">
                                        Send Message <Send size={16} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-8">
                            <h3 className="text-lg font-semibold text-ibm-gray-10 mb-6">Get in Touch</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-ibm-blue-60/10 flex items-center justify-center text-ibm-blue-40 shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-ibm-gray-10 text-sm font-medium">Headquarters</p>
                                        <p className="text-ibm-gray-50 text-sm">1 New Orchard Rd, Armonk, NY 10504</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-ibm-blue-60/10 flex items-center justify-center text-ibm-blue-40 shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-ibm-gray-10 text-sm font-medium">Phone</p>
                                        <p className="text-ibm-gray-50 text-sm">+1 (800) IBM-7378</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-ibm-blue-60/10 flex items-center justify-center text-ibm-blue-40 shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-ibm-gray-10 text-sm font-medium">Email</p>
                                        <p className="text-ibm-gray-50 text-sm">consulting@ibm.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="text-lg font-semibold text-ibm-gray-10 mb-4">Global Presence</h3>
                            <p className="text-ibm-gray-50 text-sm leading-relaxed">
                                With offices in over 170 countries, our consultants bring local expertise and
                                global scale to every engagement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
