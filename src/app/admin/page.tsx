// src/app/admin/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Input, Button, Card } from "@nextui-org/react"
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Identifiants invalides')
      } else if (result?.ok) {
        router.push('/admin/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
     <div className="w-full max-w-md px-4">
       <div className="mb-8 flex justify-center">
         <Image
           src="/images/logos/aloha_blue.png"
           alt="Aloha Secourisme"
           width={220}
           height={90}
           priority
           className="animate-fade-in"
         />
       </div>

       <Card className="p-8 shadow-xl border border-blue-100">
         <form onSubmit={handleSubmit} className="space-y-6">
           <div className="text-center mb-8">
             <h1 className="text-2xl font-indie-pimp text-[#0e5399] mb-2">
               Administration
             </h1>
             <p className="text-gray-600 font-mk-abel">
               Connectez-vous pour accéder au dashboard
             </p>
           </div>

           {error && (
             <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-mk-abel animate-fade-in">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500" />
                 {error}
               </div>
             </div>
           )}

           <div className="space-y-4">
             <Input
               type="email"
               label="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
               classNames={{
                 label: "font-mk-abel",
                 input: "font-mk-abel"
               }}
               isRequired
             />

             <Input
               type="password"
               label="Mot de passe"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               startContent={<LockClosedIcon className="w-4 h-4 text-default-400" />}
               classNames={{
                 label: "font-mk-abel",
                 input: "font-mk-abel"
               }}
               isRequired
             />
           </div>

           <Button
             type="submit"
             className="w-full bg-[#0e5399] text-white font-mk-abel
                      hover:bg-blue-700 transition-all duration-300
                      shadow-lg hover:shadow-xl transform hover:-translate-y-1"
             size="lg"
             isLoading={isLoading}
           >
             Se connecter
           </Button>
         </form>
       </Card>
     </div>
   </div>
 )
}