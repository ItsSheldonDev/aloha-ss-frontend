// src/lib/email.ts
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import Handlebars from 'handlebars';

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.fr',
  port: 465,
  secure: true,
  auth: {
    user: 'systeme@aloha-secourisme.fr',
    pass: process.env.EMAIL_PASSWORD
  }
});

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export async function sendEmail({ to, subject, template, data }: EmailData) {
  try {
    // Récupérer le template depuis la base de données
    const emailTemplate = await prisma.emailTemplate.findFirst({
      where: {
        type: template as any,
        active: true
      }
    });

    if (!emailTemplate) {
      throw new Error(`Template d'email "${template}" non trouvé`);
    }

    // Compiler le template avec Handlebars
    const compiledSubject = Handlebars.compile(emailTemplate.subject);
    const compiledContent = Handlebars.compile(emailTemplate.content);

    // Rendre le contenu avec les données
    const renderedSubject = compiledSubject(data);
    const renderedContent = compiledContent(data);

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: 'systeme@aloha-secourisme.fr',
      to,
      subject: renderedSubject,
      html: renderedContent
    });

    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}

// Fonction utilitaire pour formater une date
Handlebars.registerHelper('formatDate', function(date: Date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

// Fonction utilitaire pour formater un prix
Handlebars.registerHelper('formatPrice', function(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
});