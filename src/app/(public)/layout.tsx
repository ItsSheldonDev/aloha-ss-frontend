// src/app/(public)/layout.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import Loader from '@/components/ui/Loader'
import ChatBot from '@/components/ChatBot'
import { Providers } from '@/app/providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://aloha-sauvetage.fr'),
  title: {
    template: '%s | Aloha Secourisme',
    default: 'Aloha Secourisme - Formation aux premiers secours',
  },
  description: 'Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray et dans le Morbihan. PSC1, PSE1, PSE2, BNSSA, et formations continues.',
  keywords: [
    'secourisme',
    'formation',
    'premiers secours',
    'sauvetage sportif',
    'PSC1',
    'PSE1',
    'PSE2',
    'BNSSA',
    'Auray', 
    'Morbihan',
    'formation secourisme',
    'formation sauvetage',
    'poste de secours',
    'sauveteur',
    'certifié Qualiopi'
  ],
  authors: [{ name: 'Aloha Secourisme' }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/icons/favicon.png',
    apple: '/images/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://aloha-sauvetage.fr',
    siteName: 'Aloha Secourisme',
    title: 'Aloha Secourisme - Formation aux premiers secours',
    description: 'Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray et dans le Morbihan.',
    images: [
      {
        url: '/images/og/social-card.jpg',
        width: 1200,
        height: 630,
        alt: 'Aloha Secourisme',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aloha Secourisme - Formation aux premiers secours',
    description: 'Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray et dans le Morbihan.',
    images: ['/images/og/social-card.jpg'],
  },
  verification: {
    google: 'your-google-site-verification',
  },
  category: 'formation',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0e5399',
  colorScheme: 'light',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: RootLayoutProps) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen bg-background">
        <Loader />
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:z-50"
        >
          Aller au contenu principal
        </a>
        
        <Navbar />
        
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        
        <Footer />
        
        <ChatBot />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aloha Secourisme",
              "url": "https://aloha-sauvetage.fr",
              "logo": "https://aloha-sauvetage.fr/images/logos/logo_w_background.png",
              "description": "Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1 Boulevard Anne de Bretagne",
                "addressLocality": "Auray",
                "postalCode": "56400",
                "addressCountry": "FR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "0641543355",
                "contactType": "customer service"
              }
            })
          }}
        />
      </div>
    </Providers>
  )
}