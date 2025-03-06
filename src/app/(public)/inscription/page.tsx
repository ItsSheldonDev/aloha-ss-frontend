"use client"

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Divider,
  Chip,
} from "@nextui-org/react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Users, Mail, Phone, ArrowRight, Clock, MapPin } from 'lucide-react';
import TurnstileWidget from '@/components/TurnstileWidget';
import { toast } from 'sonner';

interface Formation {
  id: string;
  titre: string;
  type: string;
  date: string;
  duree: string;
  placesTotal: number;
  placesDisponibles: number;
  prix: number;
  lieu: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  message?: string;
  formationId: string;
}

const initialFormData: FormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  dateNaissance: '',
  message: '',
  formationId: ''
};

export default function InscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    const loadFormations = async () => {
      try {
        const response = await fetch('/api/formations');
        if (!response.ok) throw new Error('Erreur chargement formations');
        const data = await response.json();
        setFormations(data);

        // Si une formation est spécifiée dans l'URL
        const formationType = searchParams.get('formation');
        const formationDate = searchParams.get('date');
        
        if (formationType && formationDate) {
          const formation = data.find((f: Formation) => 
            f.type.toLowerCase() === formationType.toLowerCase() && 
            f.date === formationDate
          );
          if (formation) {
            setSelectedFormation(formation);
            setFormData(prev => ({ ...prev, formationId: formation.id }));
          }
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des formations");
      }
    };

    loadFormations();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast.error("Veuillez valider le captcha");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          token: turnstileToken
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      toast.success("Votre inscription a été enregistrée avec succès");
      router.push('/agenda');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Inscription
          </h1>
          <p className="text-xl font-mk-abel text-gray-600 max-w-2xl mx-auto">
            {selectedFormation 
              ? `Inscrivez-vous à la formation ${selectedFormation.titre}`
              : "Choisissez une formation et inscrivez-vous en ligne"
            }
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sélection de la formation */}
          <Card>
            <CardBody className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0e5399]" />
                Formation sélectionnée
              </h2>

              {!selectedFormation ? (
                <Select
                  label="Choisir une formation"
                  value={formData.formationId}
                  onChange={(e) => {
                    const formation = formations.find(f => f.id === e.target.value);
                    setSelectedFormation(formation || null);
                    setFormData(prev => ({ ...prev, formationId: e.target.value }));
                  }}
                  required
                >
                  {formations.map((formation) => (
                    <SelectItem 
                      key={formation.id} 
                      value={formation.id}
                      textValue={`${formation.titre} - ${new Date(formation.date).toLocaleDateString('fr-FR')}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-small">{formation.titre}</span>
                        <span className="text-tiny text-default-500">
                          {new Date(formation.date).toLocaleDateString('fr-FR')} - {formation.lieu}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedFormation.titre}</h3>
                      <p className="text-small text-default-500">{selectedFormation.type}</p>
                    </div>
                    <Button
                      variant="light"
                      color="primary"
                      onPress={() => {
                        setSelectedFormation(null);
                        setFormData(prev => ({ ...prev, formationId: '' }));
                      }}
                    >
                      Changer
                    </Button>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-default-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-small">Date</span>
                      </div>
                      <p className="font-medium">
                        {new Date(selectedFormation.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-default-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-small">Durée</span>
                      </div>
                      <p className="font-medium">{selectedFormation.duree}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-default-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-small">Lieu</span>
                      </div>
                      <p className="font-medium">{selectedFormation.lieu}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-default-500">
                        <Users className="w-4 h-4" />
                        <span className="text-small">Places</span>
                      </div>
                      <p className="font-medium">
                        {selectedFormation.placesDisponibles}/{selectedFormation.placesTotal}
                      </p>
                    </div>
                  </div>

                  <Divider />

                  <div className="text-center">
                    <span className="text-2xl font-bold text-[#0e5399]">
                      {selectedFormation.prix}€
                    </span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Informations personnelles */}
          <Card>
            <CardBody className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0e5399]" />
                Informations personnelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
                <Input
                  label="Prénom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  startContent={<Mail className="w-4 h-4 text-default-400" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  type="tel"
                  label="Téléphone"
                  startContent={<Phone className="w-4 h-4 text-default-400" />}
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  label="Date de naissance"
                  value={formData.dateNaissance}
                  onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                  required
                />
              </div>

              <Textarea
                label="Message (facultatif)"
                placeholder="Si vous avez des informations complémentaires à nous communiquer"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                minRows={3}
              />
            </CardBody>
          </Card>

          {/* Validation */}
          <Card>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <TurnstileWidget onVerify={setTurnstileToken} />

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  startContent={!isLoading && <ArrowRight className="w-4 h-4" />}
                  isDisabled={!formData.formationId || !turnstileToken}
                >
                  {isLoading ? "Envoi en cours..." : "Confirmer l'inscription"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </div>
  );
}