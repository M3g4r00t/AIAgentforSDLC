'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${apiUrl}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Submission failed');
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
                    <p className="text-gray-400 mb-6">
                        Your inquiry has been received. An IBM Consulting representative
                        will be in touch within 24 hours.
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-ibm-blue hover:bg-ibm-blue/90 rounded-lg font-semibold transition-all"
                    >
                        Return Home
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <span className="text-sm text-ibm-blue uppercase tracking-wider mb-4 block">Get in Touch</span>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-400">
                        Ready to transform your business? Let&apos;s start a conversation
                        about how IBM Consulting can help.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Jane Doe"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Work Email *</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="jane@company.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                                <input
                                    name="company"
                                    type="text"
                                    placeholder="Acme Corporation"
                                    value={form.company}
                                    onChange={e => setForm({ ...form, company: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent text-white placeholder-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    placeholder="Tell us about your project or challenge..."
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent text-white placeholder-gray-500 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-ibm-blue hover:bg-ibm-blue/90 rounded-lg font-semibold transition-all"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-ibm-blue mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-400">Email</div>
                                        <div>consulting@ibm.com</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-ibm-blue mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-400">Phone</div>
                                        <div>+1 (888) IBM-CALL</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-ibm-blue mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-400">Headquarters</div>
                                        <div>Armonk, New York, USA</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Global Presence</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                                {['Americas', 'Europe', 'Asia Pacific', 'Middle East', 'Africa', '170+ Countries'].map((region, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-ibm-blue" />
                                        {region}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
