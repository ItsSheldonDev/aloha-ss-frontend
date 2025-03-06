// src/app/sauvetage-sportif/page.tsx 
"use client"

import { useState } from 'react';
import Image from 'next/image';
import TurnstileWidget from '@/components/TurnstileWidget';
import { useTurnstile } from "react-turnstile";
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Spinner } from "@nextui-org/react";
import { useNews } from '@/hooks/useNews';

interface FormData {
 firstname: string;
 name: string;
 email: string;
 phone: string;
 birthdate: string;
 observation: string;
}

const initialFormData: FormData = {
 firstname: '',
 name: '',
 email: '',
 phone: '',
 birthdate: '',
 observation: '',
};

export default function SauvetageSportif() {
 const [formData, setFormData] = useState<FormData>(initialFormData);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [submitStatus, setSubmitStatus] = useState<{
   success?: string;
   error?: string;
 } | null>(null);
 const [turnstileToken, setTurnstileToken] = useState<string>('');
 const turnstile = useTurnstile();
 const { news, isLoading: loadingNews } = useNews();

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (isSubmitting) return;

   setIsSubmitting(true);
   setSubmitStatus(null);

   try {
     if (!turnstileToken) {
       setSubmitStatus({ error: "Veuillez valider le captcha" });
       return;
     }

     const response = await fetch('/api/send-email', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         ...formData,
         token: turnstileToken
       })
     });

     const data = await response.json();

     if (!response.ok) {
       throw new Error(data.error || 'Une erreur est survenue');
     }

     setFormData(initialFormData);
     setTurnstileToken('');
     turnstile.reset();
     
     setSubmitStatus({
       success: "Votre inscription a été envoyée avec succès. Nous vous contacterons bientôt."
     });
     
     window.scrollTo({ top: 0, behavior: 'smooth' });

   } catch (error) {
     console.error('Erreur lors de la soumission:', error);
     setSubmitStatus({
       error: "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer."
     });
   } finally {
     setIsSubmitting(false);
   }
 };

 return (
   <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
     {/* En-tête avec image */}
     <div className="max-w-5xl mx-auto mb-16">
       <h1 className="text-6xl font-art-brush text-[#0e5399] text-center mb-6">
         Sauvetage Sportif
       </h1>
       <Image
         src="/images/content/formations/titless.png" 
         alt="Sauvetage Sportif"
         width={1200}
         height={200}
         className="w-full h-auto rounded-xl shadow-lg"
         priority
       />
     </div>

     {/* Description, Actualités et Formulaire */}
     <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
       {/* Colonne gauche: Description + Actualités */}
       <div className="space-y-8">
         {/* Description - version réduite */}
         <div className="bg-white p-8 rounded-xl shadow-lg">
           <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-6">Description</h2>
           <div className="space-y-4 font-mk-abel text-lg text-gray-700">
             <p className="leading-relaxed">
               Aloha Sauvetage Secourisme est un club sportif avec une équipe de 
               compétiteurs s'entraînant en piscine et en océan. Nous participons 
               aux compétitions de sauvetage sportif organisées par la FFSS.
             </p>
             <ul className="space-y-2 pl-6">
               <li className="flex items-start gap-2">
                 <span className="text-[#0e5399] font-bold">•</span>
                 <span>Eau Plate : obstacles, sauvetage, palmes, bouée-tubes</span>
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-[#0e5399] font-bold">•</span>
                 <span>Côtier : océan, paddleboard, course sur sable</span>
               </li>
             </ul>
             <p>
               Plus d'infos sur{' '}
               <a 
                 href="https://www.ffss.fr" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[#0e5399] hover:text-blue-700 underline font-semibold"
               >
                 www.ffss.fr
               </a>
             </p>
           </div>
         </div>

         {/* Actualités */}
         <div className="bg-white p-8 rounded-xl shadow-lg">
           <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-6">Actualités</h2>
           {loadingNews ? (
             <div className="flex justify-center p-4">
               <Spinner size="lg" />
             </div>
           ) : news && news.length > 0 ? (
             <div className="space-y-6">
               {news.map((item) => (
                 <div key={item.id} className="space-y-2 pb-4 border-b last:border-0">
                   <h3 className="text-xl font-mk-abel text-gray-800">
                     {item.title}
                   </h3>
                   <p className="text-gray-600 font-mk-abel">
                     {item.content}
                   </p>
                   <p className="text-sm text-gray-500">
                     {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                   </p>
                 </div>
               ))}
             </div>
           ) : (
             <p className="text-gray-500 text-center">
               Aucune actualité pour le moment
             </p>
           )}
         </div>
       </div>

       {/* Formulaire d'inscription */}
       <div className="bg-white p-8 rounded-xl shadow-lg">
         <h2 className="text-4xl font-mk-abel text-[#0e5399] mb-8">Inscription</h2>

         {submitStatus?.success && (
           <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
             <span className="text-green-700">{submitStatus.success}</span>
           </div>
         )}

         {submitStatus?.error && (
           <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
             <span className="text-red-700">{submitStatus.error}</span>
           </div>
         )}
         
         <form onSubmit={handleSubmit} className="space-y-6" noValidate>
           <div className="space-y-4">
             <div>
               <label htmlFor="firstname" className="block font-mk-abel text-gray-700 mb-2">
                 Nom
               </label>
               <input
                 type="text"
                 id="firstname"
                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.firstname}
                 onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="name" className="block font-mk-abel text-gray-700 mb-2">
                 Prénom
               </label>
               <input
                 type="text"
                 id="name"
                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="email" className="block font-mk-abel text-gray-700 mb-2">
                 Email
               </label>
               <input
                 type="email"
                 id="email"
                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="phone" className="block font-mk-abel text-gray-700 mb-2">
                 Téléphone
               </label>
               <input
                 type="tel"
                 id="phone"
                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.phone}
                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="birthdate" className="block font-mk-abel text-gray-700 mb-2">
                 Date de naissance
               </label>
               <input
                 type="date"
                 id="birthdate"
                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.birthdate}
                 onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="observation" className="block font-mk-abel text-gray-700 mb-2">
                 Observations
               </label>
               <textarea
                 id="observation"
                 rows={4}
                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors resize-y"
                 value={formData.observation}
                 onChange={(e) => setFormData({...formData, observation: e.target.value})}
                 disabled={isSubmitting}
               />
             </div>
           </div>

           <div className="mt-6">
             <TurnstileWidget onVerify={setTurnstileToken} />
           </div>

           <button
             type="submit"
             disabled={isSubmitting}
             className="w-full bg-[#0e5399] text-white py-4 px-6 rounded-full 
                      hover:bg-blue-700 transition-all duration-300 font-mk-abel
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2 shadow-lg
                      transform hover:-translate-y-1"
           >
             <Send className="w-5 h-5" />
             {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
           </button>
         </form>
       </div>
     </div>
   </div>
 );
}