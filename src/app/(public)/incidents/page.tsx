"use client"

import { useState, useEffect } from 'react';
import { Mail, Phone, Send, AlertCircle, CheckCircle2, MessageSquare, User, Calendar, FileText, Shield, AlertTriangle } from 'lucide-react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Animation de chargement initial
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Détecter le défilement pour les animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen relative bg-gradient-to-b from-blue-50 to-white">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 right-0 w-full h-64 overflow-hidden opacity-10 -z-10">
        <div className="w-full h-full bg-pattern-waves"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
        {/* Overlay gradué */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-blue-700/70" />

        {/* Contenu centré */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <div className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-art-brush mb-6 tracking-wide text-white text-shadow-lg">
              <span className="relative">
                Incidents et Réclamations
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              Signalez un incident ou une réclamation concernant nos services
            </p>
            
            {/* Badge centré */}
            <div className={`mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-xl transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <AlertTriangle className="text-blue-300 w-6 h-6" />
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Traitement prioritaire</div>
                <div className="text-blue-200 text-xs">Réponse sous 48h</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Description et contact */}
        <div className={`max-w-4xl mx-auto mb-12 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 text-blue-700 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-mk-abel">Comment nous contacter</h2>
              </div>
              
              <p className="text-lg font-mk-abel leading-relaxed text-gray-700 mb-8">
                Veuillez utiliser le formulaire ci-dessous pour nous rapporter un incident. 
                Vous pouvez également nous contacter directement via :
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:contact@aloha-sauvetage.fr"
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <Mail className="w-5 h-5" />
                  <span>contact@aloha-sauvetage.fr</span>
                  <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</div>
                </a>
                <a 
                  href="tel:0641543355"
                  className="group flex items-center gap-2 px-6 py-3 bg-white text-blue-700 border border-blue-100 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <Phone className="w-5 h-5 text-blue-500" />
                  <span>06 41 54 33 55</span>
                  <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-500">→</div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet décoratif */}
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-100/30 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 text-blue-700 mb-8">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-mk-abel">Formulaire de signalement</h2>
              </div>

              {submitStatus?.success && (
                <div className="p-4 mb-8 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-green-700">{submitStatus.success}</span>
                </div>
              )}

              {submitStatus?.error && (
                <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-red-700">{submitStatus.error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Grid pour les champs de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label htmlFor="firstname" className="block font-mk-abel text-gray-700 mb-1.5 text-sm">
                      Nom
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="firstname"
                        className="w-full p-2.5 pl-10 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                        value={formData.firstname}
                        onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="name" className="block font-mk-abel text-gray-700 mb-1.5 text-sm">
                      Prénom
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        className="w-full p-2.5 pl-10 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block font-mk-abel text-gray-700 mb-1.5 text-sm">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        className="w-full p-2.5 pl-10 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="phone" className="block font-mk-abel text-gray-700 mb-1.5 text-sm">
                      Téléphone
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full p-2.5 pl-10 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="birthdate" className="block font-mk-abel text-gray-700 mb-1.5 text-sm">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      id="birthdate"
                      className="w-full p-2.5 pl-10 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                      value={formData.birthdate}
                      onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="message" className="block font-mk-abel text-gray-700 mb-1.5 text-sm">
                    Description de l'incident
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-blue-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full p-2.5 pl-10 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors resize-y"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      disabled={isSubmitting}
                      placeholder="Veuillez décrire l'incident ou la réclamation en détail..."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <TurnstileWidget onVerify={setTurnstileToken} />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-1"
                >
                  <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Section d'informations additionnelles */}
        <div className={`max-w-4xl mx-auto mt-16 transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl text-white relative overflow-hidden">
            <div className="p-8 relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/20 rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-mk-abel mb-4">Notre engagement</h3>
              <p className="text-blue-100 font-mk-abel max-w-2xl mx-auto">
                Nous prenons très au sérieux tous les incidents et réclamations. Notre équipe s'engage à vous répondre 
                sous 48 heures et à mettre en place les actions correctives nécessaires pour améliorer continuellement 
                nos services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour les animations et effets */}
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .bg-pattern-waves {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%230e5399' fill-opacity='0.05' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/svg%3E");
        }
        
        /* Vagues CSS pures */
        .waves-bottom {
          position: absolute;
          width: 100%;
          height: 100%;
          bottom: 0;
        }
        
        .waves-bottom .wave {
          position: absolute;
          width: 200%;
          height: 100%;
          background: white;
          opacity: 0.2;
          border-radius: 50% 50% 0 0;
          left: 0;
          bottom: 0;
        }
        
        .waves-bottom .wave:nth-child(1) {
          opacity: 0.2;
          bottom: 0;
          animation: movewave 10s linear infinite;
        }
        
        .waves-bottom .wave:nth-child(2) {
          opacity: 0.15;
          bottom: 5px;
          animation: movewave 15s linear infinite reverse;
        }
        
        .waves-bottom .wave:nth-child(3) {
          opacity: 0.1;
          bottom: 10px;
          animation: movewave 20s linear infinite;
        }
        
        @keyframes movewave {
          0% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-25%) scale(1.5, 0.8); }
          100% { transform: translateX(-50%) scale(1); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}