"use client"

import { useState } from 'react';
import { Mail, Phone, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import TurnstileWidget from '@/components/TurnstileWidget';
import { useTurnstile } from "react-turnstile";

interface FormData {
 firstname: string;
 name: string;
 email: string;
 phone: string;
 birthdate: string;
 message: string;
}

const initialFormData: FormData = {
 firstname: '',
 name: '',
 email: '',
 phone: '',
 birthdate: '',
 message: '',
};

export default function Incidents() {
 const [formData, setFormData] = useState<FormData>(initialFormData);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [submitStatus, setSubmitStatus] = useState<{
   success?: string;
   error?: string;
 } | null>(null);
 const [turnstileToken, setTurnstileToken] = useState<string>('');
 const turnstile = useTurnstile();

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

     const response = await fetch('/api/send-incident', {
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
       success: "Votre signalement a été envoyé avec succès. Nous vous contacterons bientôt."
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
     <div className="max-w-4xl mx-auto">
       {/* En-tête */}
       <div className="text-center mb-16">
         <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
           Incidents et Réclamations
         </h1>
       </div>

       {/* Description et contact */}
       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-12 space-y-6">
         <p className="text-lg font-mk-abel leading-relaxed text-gray-700">
           Veuillez utiliser le formulaire ci-dessous pour nous rapporter un incident. 
           Vous pouvez également nous contacter directement via :
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <a 
             href="mailto:contact@aloha-sauvetage.fr"
             className="inline-flex items-center gap-2 px-6 py-3 bg-[#0e5399] text-white rounded-full
                       hover:bg-blue-700 transition-all duration-300 font-mk-abel
                       transform hover:-translate-y-1 shadow-md hover:shadow-lg"
           >
             <Mail className="w-5 h-5" />
             contact@aloha-sauvetage.fr
           </a>
           <a 
             href="tel:0641543355"
             className="inline-flex items-center gap-2 px-6 py-3 bg-[#0e5399] text-white rounded-full
                       hover:bg-blue-700 transition-all duration-300 font-mk-abel
                       transform hover:-translate-y-1 shadow-md hover:shadow-lg"
           >
             <Phone className="w-5 h-5" />
             06 41 54 33 55
           </a>
         </div>
       </div>

       {/* Formulaire */}
       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
         <h2 className="text-2xl font-mk-abel text-[#0e5399] mb-8">Formulaire de signalement</h2>

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
           {/* Grid pour les champs de base */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label htmlFor="firstname" className="block font-mk-abel text-gray-700 mb-1">
                 Nom
               </label>
               <input
                 type="text"
                 id="firstname"
                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.firstname}
                 onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="name" className="block font-mk-abel text-gray-700 mb-1">
                 Prénom
               </label>
               <input
                 type="text"
                 id="name"
                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="email" className="block font-mk-abel text-gray-700 mb-1">
                 Email
               </label>
               <input
                 type="email"
                 id="email"
                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>

             <div>
               <label htmlFor="phone" className="block font-mk-abel text-gray-700 mb-1">
                 Téléphone
               </label>
               <input
                 type="tel"
                 id="phone"
                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
                 value={formData.phone}
                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 required
                 disabled={isSubmitting}
               />
             </div>
           </div>

           <div>
             <label htmlFor="birthdate" className="block font-mk-abel text-gray-700 mb-1">
               Date de naissance
             </label>
             <input
               type="date"
               id="birthdate"
               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors"
               value={formData.birthdate}
               onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
               required
               disabled={isSubmitting}
             />
           </div>

           <div>
             <label htmlFor="message" className="block font-mk-abel text-gray-700 mb-1">
               Message
             </label>
             <textarea
               id="message"
               rows={4}
               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0e5399] focus:border-[#0e5399] focus:outline-none transition-colors resize-y"
               value={formData.message}
               onChange={(e) => setFormData({...formData, message: e.target.value})}
               required
               disabled={isSubmitting}
             ></textarea>
           </div>

           <div className="mt-6">
             <TurnstileWidget onVerify={setTurnstileToken} />
           </div>

           <button
             type="submit"
             disabled={isSubmitting}
             className="w-full bg-[#0e5399] text-white py-3 px-6 rounded-full 
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