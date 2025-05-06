"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TurnstileWidget from '@/components/TurnstileWidget';
import { 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Waves, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Shield, 
  Award, 
  ArrowRight,
  ExternalLink,
  Users,
  LifeBuoy,
  Bell
} from 'lucide-react';
import { Spinner } from '@nextui-org/react';
import { useNews } from '@/hooks/useNews';
import { useSauvetageSportifMutation } from '@/hooks/useInscriptions';
import { NewsItem } from '@/lib/api';
import { logos } from '@/lib/images'; // Import des logos

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
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'eau-plate' | 'cotier'>('eau-plate');
  
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

  // Animation de chargement initial
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Récupération des actualités
  const { data: newsResponse, isLoading: loadingNews, error: newsError } = useNews();
  
  // Mutation pour l'inscription au sauvetage sportif
  const mutation = useSauvetageSportifMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      return;
    }

    mutation.mutate({
      firstname: formData.firstname,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      birthdate: formData.birthdate,
      observation: formData.observation,
      token: turnstileToken
    }, {
      onSuccess: () => {
        setFormData(initialFormData);
        setTurnstileToken('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  // Extraire les news depuis la réponse
  const newsItems: NewsItem[] = newsResponse?.news || [];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Background Waves Pattern */}
      <div className="absolute top-0 left-0 right-0 w-full h-64 overflow-hidden opacity-10 -z-10">
        <div className="w-full h-full bg-pattern-waves"></div>
      </div>
      
      {/* Hero Section avec parallaxe */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
        {/* Image de fond avec effet parallaxe */}
        <div 
          className="absolute inset-0 bg-center bg-cover transition-transform duration-300"
          style={{ 
            backgroundImage: 'url("/images/content/formations/titless.png")',
            transform: `scale(${scrolled ? 1.05 : 1}) translateY(${scrolled ? '5px' : '0px'})`,
            filter: 'brightness(0.6)'
          }}
        />
        
        {/* Overlay gradué */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-blue-700/70" />
        
        {/* Effet de vagues en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-12 z-10 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              className="fill-white opacity-10"
            ></path>
          </svg>
        </div>

        {/* Contenu centré */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <div 
            className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h1 className="text-5xl md:text-7xl font-art-brush mb-6 tracking-wide text-white text-shadow-lg">
              <span className="relative">
                Sauvetage Sportif
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-mk-abel max-w-3xl mx-auto text-blue-100">
              Rejoignez notre équipe de compétiteurs pour vous entraîner en piscine et en océan
            </p>
            
            {/* Badge centré */}
            <div 
              className={`mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 
                       shadow-xl transition-all duration-1000 delay-500 ease-out
                       ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <Shield className="text-blue-300 w-6 h-6" />
              <div className="text-left">
                <div className="text-white text-sm font-semibold">Club Officiel FFSS</div>
                <div className="text-blue-200 text-xs">Fédération Française de Sauvetage et Secourisme</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Description, Actualités et Formulaire */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonne 1: Description et informations */}
          <div 
            className={`md:col-span-1 space-y-8 transition-all duration-700 delay-100 ease-out 
                      ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Description animée avec effet glassmorphism */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-blue-100 relative overflow-hidden group">
              {/* Effet de vague décoratif */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-blue-100/50 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              
              <h2 className="text-3xl font-mk-abel text-blue-800 mb-6 flex items-center gap-2">
                <Waves className="w-6 h-6 text-blue-600" />
                <span>Le Sauvetage Sportif</span>
              </h2>

              <div className="space-y-4 font-mk-abel text-lg text-gray-700 relative z-10">
                <p className="leading-relaxed">
                  Aloha Sauvetage Secourisme est un club sportif avec une équipe de
                  compétiteurs s'entraînant en piscine et en océan. Nous participons
                  aux compétitions de sauvetage sportif organisées par la FFSS.
                </p>
                
                {/* Tabs pour les disciplines */}
                <div className="mt-6 border-b border-blue-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('eau-plate')}
                      className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-all duration-300 
                                ${activeTab === 'eau-plate' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-blue-100/50 text-blue-700 hover:bg-blue-100'}`}
                    >
                      Eau Plate
                    </button>
                    <button
                      onClick={() => setActiveTab('cotier')}
                      className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-all duration-300
                                ${activeTab === 'cotier' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-blue-100/50 text-blue-700 hover:bg-blue-100'}`}
                    >
                      Côtier
                    </button>
                  </div>
                </div>
                
                {/* Contenu des tabs */}
                <div className="pt-4">
                  {activeTab === 'eau-plate' && (
                    <div className="space-y-3 animate-fade-in">
                      <p>Entrainement en piscine incluant :</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold mt-1">•</span>
                          <span>Obstacles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold mt-1">•</span>
                          <span>Mannequin et remorquage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold mt-1">•</span>
                          <span>Palmes et bouée-tube</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'cotier' && (
                    <div className="space-y-3 animate-fade-in">
                      <p>Entraînement en milieu naturel incluant :</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold mt-1">•</span>
                          <span>Nage en océan et surf</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold mt-1">•</span>
                          <span>Paddleboard et bâtons musicaux</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold mt-1">•</span>
                          <span>Sprint et courses sur sable</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <a
                  href="https://www.ffss.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors group"
                >
                  <span>Plus d'infos sur la FFSS</span>
                  <ExternalLink className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                {/* Nouveau bouton pour les stages */}
                <Link 
                  href="/sauvetage-sportif/stages"
                  className="flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg transform hover:-translate-y-1 group"
                >
                  <span>Découvrir nos stages</span>
                  <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            
            {/* Avantages du sauvetage sportif */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-xl text-white relative overflow-hidden">
              {/* Effet de vague décoratif */}
              <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20">
                <div className="absolute bottom-0 left-0 w-[200%] h-full bg-wave-pattern animate-wave"></div>
              </div>
              
              <h2 className="text-2xl font-mk-abel mb-6 flex items-center gap-2 relative z-10">
                <Award className="w-5 h-5" />
                <span>Pourquoi nous rejoindre</span>
              </h2>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sport complet</h3>
                    <p className="text-sm text-blue-100">Développe endurance, force et agilité</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Esprit d'équipe</h3>
                    <p className="text-sm text-blue-100">Camaraderie et entraide</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="p-2 bg-white/20 rounded-full">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Compétitions</h3>
                    <p className="text-sm text-blue-100">Championnats régionaux et nationaux</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne 2: Formulaire d'inscription */}
          <div 
            className={`md:col-span-1 transition-all duration-700 delay-200 ease-out 
                      ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="sticky top-24 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden">
              {/* Entête avec gradient */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-mk-abel text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>Inscription</span>
                  </h2>
                  <p className="text-blue-100 text-sm">Rejoignez notre équipe sportive</p>
                </div>
                
                {/* Effet vague */}
                <div className="absolute bottom-0 left-0 right-0 h-6 opacity-30">
                  <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M 0 100 Q 200 150 400 100 Q 600 50 800 100 L 800 200 L 0 200 Z" fill="white" />
                  </svg>
                </div>
              </div>

              <div className="p-6">
                {mutation.isSuccess && (
                  <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-green-700">
                      Votre inscription au sauvetage sportif a été enregistrée avec succès. 
                      Nous vous contacterons bientôt.
                    </span>
                  </div>
                )}

                {mutation.isError && (
                  <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700">
                      {mutation.error instanceof Error 
                        ? mutation.error.message 
                        : "Une erreur est survenue lors de l'inscription. Veuillez réessayer."}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-4">
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
                          onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                          required
                          disabled={mutation.isPending}
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
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          disabled={mutation.isPending}
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
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          disabled={mutation.isPending}
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
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          disabled={mutation.isPending}
                        />
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
                          onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                          required
                          disabled={mutation.isPending}
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="observation" className="block font-mk-abel text-gray-700 mb-1.5 text-sm">
                        Observations
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-blue-400">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                          id="observation"
                          rows={3}
                          className="w-full p-2.5 pl-10 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors resize-y"
                          value={formData.observation}
                          onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                          disabled={mutation.isPending}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <TurnstileWidget onVerify={setTurnstileToken} />
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending || !turnstileToken}
                    className="w-full group bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-mk-abel disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-1"
                  >
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    {mutation.isPending ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Colonne 3: Actualités et Logos */}
          <div 
            className={`md:col-span-1 space-y-8 transition-all duration-700 delay-300 ease-out 
                      ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Bloc Actualités */}
            <div className="bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden">
              {/* Entête avec gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-mk-abel text-white flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span>Actualités</span>
                  </h2>
                  <p className="text-blue-100 text-sm">Les dernières nouvelles du club</p>
                </div>
                
                {/* Effet vague */}
                <div className="absolute bottom-0 left-0 right-0 h-6 opacity-30">
                  <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M 0 100 Q 200 150 400 100 Q 600 50 800 100 L 800 200 L 0 200 Z" fill="white" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6">
                {loadingNews ? (
                  <div className="flex justify-center p-4">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : newsError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700">
                      {newsError instanceof Error ? newsError.message : 'Erreur lors du chargement des actualités'}
                    </span>
                  </div>
                ) : newsItems.length > 0 ? (
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {newsItems.map((item: NewsItem, index) => (
                      <div 
                        key={item.id} 
                        className="space-y-2 pb-4 border-b border-blue-100 last:border-0 hover:bg-blue-50 p-3 rounded-lg transition-colors"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-mk-abel text-blue-800">
                            {item.title}
                          </h3>
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-gray-600 font-mk-abel">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-blue-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-mk-abel">
                      Aucune actualité pour le moment
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Revenez bientôt pour découvrir nos prochains événements
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Nouveau bloc pour les logos */}
            <div className="bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-mk-abel text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span>Nos accréditations</span>
                  </h2>
                  <p className="text-blue-100 text-sm">Organismes officiels et certifications</p>
                </div>
                
                {/* Effet vague */}
                <div className="absolute bottom-0 left-0 right-0 h-6 opacity-30">
                  <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M 0 100 Q 200 150 400 100 Q 600 50 800 100 L 800 200 L 0 200 Z" fill="white" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="relative h-32 w-full">
                      <Image 
                        src={logos.ffss}
                        alt="Logo FFSS - Fédération Française de Sauvetage et Secourisme"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <p className="mt-3 text-center text-sm text-gray-600">
                      Fédération Française de Sauvetage et Secourisme
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative h-32 w-full">
                      <Image 
                        src={logos.secucivile}
                        alt="Logo Sécurité Civile"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <p className="mt-3 text-center text-sm text-gray-600">
                      Sécurité Civile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div 
          className={`mt-16 transition-all duration-700 delay-500 ease-out 
                    ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            {/* Effet de vague décoratif */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-100/50 opacity-30"></div>
            
            <h2 className="text-3xl font-mk-abel text-blue-800 mb-8 text-center relative z-10">Questions fréquentes</h2>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="bg-blue-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">À quel âge peut-on commencer ?</h3>
                <p className="text-gray-700">Nos séances sont accessibles à partir de 8 ans, avec des groupes adaptés selon les âges et niveaux.</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Faut-il savoir bien nager ?</h3>
                <p className="text-gray-700">Oui, un bon niveau en natation est requis. Une évaluation est réalisée lors de la première séance.</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Quand ont lieu les entraînements ?</h3>
                <p className="text-gray-700">Nos entraînements ont lieu le mercredi et le samedi, avec des créneaux supplémentaires pour les compétiteurs.</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Faut-il une licence ?</h3>
                <p className="text-gray-700">Oui, l'adhésion au club comprend la licence FFSS obligatoire pour participer aux compétitions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        .animate-wave {
          animation: wave 18s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .bg-pattern-waves {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%230e5399' fill-opacity='0.05' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/svg%3E");
        }
        
        .bg-wave-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' class='shape-fill'%3E%3C/path%3E%3C/svg%3E");
          background-position: center;
          background-repeat: no-repeat;
        }

        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #EFF6FF;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #93C5FD;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #60A5FA;
        }
      `}</style>
    </div>
  );
}