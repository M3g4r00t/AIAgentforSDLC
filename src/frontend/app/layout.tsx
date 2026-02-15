import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
    title: 'IBM Consulting | Strategy, AI & Cloud Transformation',
    description: 'IBM Consulting helps the world\'s leading organizations reimagine and transform their businesses with AI, hybrid cloud, and deep industry expertise.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="bg-ibm-gray-100 text-ibm-gray-10 antialiased">
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
            </body>
        </html>
    )
}
