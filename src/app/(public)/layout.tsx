// src/app/(public)/layout.tsx
import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import ClientLoader from '@/components/ClientLoader';

// Utiliser une variable d'environnement pour la flexibilité
const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://aloha-sauvetage.fr';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s | Aloha Secourisme',
    default: 'Aloha Secourisme - Formation aux premiers secours',
  },
  description:
    'Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray et dans le Morbihan. PSC1, PSE1, PSE2, BNSSA, et formations continues.',
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
    'certifié Qualiopi',
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
    url: baseUrl,
    siteName: 'Aloha Secourisme',
    title: 'Aloha Secourisme - Formation aux premiers secours',
    description:
      'Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray et dans le Morbihan.',
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
    description:
      'Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray et dans le Morbihan.',
    images: ['/images/og/social-card.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-google-site-verification',
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0e5399',
  colorScheme: 'light',
  userScalable: true,
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ClientLoader />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 p-4 bg-white rounded shadow-lg z-50 focus:outline-none"
      >
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Aloha Secourisme',
            url: baseUrl,
            logo: `${baseUrl}/images/logos/logo_w_background.png`,
            description:
              'Formation aux premiers secours, sauvetage sportif et formations professionnelles à Auray',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1 Boulevard Anne de Bretagne',
              addressLocality: 'Auray',
              postalCode: '56400',
              addressCountry: 'FR',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+33641543355',
              contactType: 'customer service',
            },
          }),
        }}
      />
    </div>
  );
}