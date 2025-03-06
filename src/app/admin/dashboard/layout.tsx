'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import TopBar from '@/components/admin/TopBar'
import { Toaster } from 'sonner'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // État de chargement
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e5399]"></div>
      </div>
    )
  }

  // Redirection si non authentifié
  if (status === 'unauthenticated') {
    router.push('/admin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <main className="p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  )
}