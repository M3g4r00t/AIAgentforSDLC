import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { PersonaProvider } from '../context/PersonaContext'
import PersonaSwitcher from '../components/PersonaSwitcher'
import StrategistWidget from '../components/StrategistWidget'

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
            <body className="bg-ibm-gray-100 text-ibm-gray-100 antialiased transition-colors duration-500">
                <PersonaProvider>
                    <Navbar />
                    <main className="min-h-screen relative">
                        {children}
                        <PersonaSwitcher />
                        <StrategistWidget />
                    </main>
                    <Footer />
                </PersonaProvider>
            </body>
        </html>
    )
}
