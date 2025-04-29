// src/app/layout.tsx
import '@/styles/globals.css';
import { artBrush, indiePimp, mkAbel } from '@/styles/fonts';
import { Providers } from '@/app/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${artBrush.variable} ${indiePimp.variable} ${mkAbel.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}