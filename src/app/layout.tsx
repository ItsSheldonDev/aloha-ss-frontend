// src/app/layout.tsx
import '@/styles/globals.css'
import { artBrush, indiePimp, mkAbel } from '@/styles/fonts'

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="fr" 
      className={`${artBrush.variable} ${indiePimp.variable} ${mkAbel.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
      </body>
    </html>
  )
}