// src/hooks/useInscriptions.ts
import { useMutation } from '@tanstack/react-query';
import { 
  submitSauvetageSportifInscription, 
  submitContact, 
  submitIncident 
} from '@/lib/api';
import { toast } from 'sonner';

// Hook pour l'inscription au sauvetage sportif
export function useSauvetageSportifMutation() {
  return useMutation({
    mutationFn: (data: {
      firstname: string;
      name: string;
      email: string;
      phone: string;
      birthdate: string;
      observation?: string;
      token: string;
    }) => submitSauvetageSportifInscription(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Votre inscription au sauvetage sportif a été enregistrée avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Une erreur est survenue lors de l\'inscription');
    },
  });
}

// Hook pour envoyer un message de contact
export function useContactMutation() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      subject: string;
      message: string;
      token: string;
    }) => submitContact(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Votre message a été envoyé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Une erreur est survenue lors de l\'envoi du message');
    },
  });
}

// Hook pour envoyer un signalement
export function useIncidentMutation() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      type: string;
      details: string;
      location: string;
      token: string;
    }) => submitIncident(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Votre signalement a été envoyé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Une erreur est survenue lors de l\'envoi du signalement');
    },
  });
}