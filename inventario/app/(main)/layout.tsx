import { Metadata } from 'next';
import type { Viewport } from 'next'
import { SessionProvider } from "next-auth/react"

import Layout from '@/layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}



export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#000000',

    // Also supported but less commonly used
    // interactiveWidget: 'resizes-visual',

    

}

export const metadata: Metadata = {
    title: 'Rosal Motos',
    description: 'Taller de motocicletas',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    openGraph: {
        title: 'Rosal Motos',
        description: 'Taller de motocicletas',
        url: 'https://www.example.com/taller',
        siteName: 'Taller de motocicletas',
        images: [
            {
                url: '/favicon.ico',
                width: 800,
                height: 600,
                alt: 'Taller de motocicletas',
            },
        ],
        locale: 'es-ES',
        type: 'website',
    },
};




export default function AppLayout({ children }: AppLayoutProps) {
    return <SessionProvider>
    <Layout>{children}</Layout>
    </SessionProvider>
}
