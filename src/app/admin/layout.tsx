// src/app/admin/layout.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { Providers } from '@/app/providers'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Providers>
        {children}
      </Providers>
    </SessionProvider>
  )
}