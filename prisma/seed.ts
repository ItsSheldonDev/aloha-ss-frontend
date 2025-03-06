// prisma/seed.ts
import { PrismaClient, EmailType } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

const defaultAdmin = {
 email: 'contact@sheldon-dev.fr',
 nom: 'Admin',
 prenom: 'Super',
 role: 'SUPER_ADMIN' as const,
 password: 'BC1986bc**'
}

const emailTemplates = [
 {
   name: "Confirmation d'inscription",
   subject: "Confirmation de votre inscription à la formation {{formation}}",
   type: EmailType.INSCRIPTION,
   description: "Email envoyé automatiquement après une inscription à une formation",
   content: `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
       </head>
       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #444; max-width: 600px; margin: 0 auto; padding: 20px;">
         <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
           <tr>
             <td style="padding: 20px; text-align: center;">
               <img src="http://localhost:3000/images/logos/aloha_blue.png" alt="Aloha Secourisme" style="width: 200px; height: auto;">
             </td>
           </tr>
           
           <tr>
             <td style="padding: 20px;">
               <h2 style="color: #0e5399; margin-bottom: 20px;">Confirmation d'inscription</h2>
               
               <p>Bonjour {{prenom}} {{nom}},</p>
               
               <p>Nous avons bien reçu votre inscription à la formation <strong>{{formation}}</strong> prévue le {{date}}.</p>
               
               <p>Détails de votre inscription :</p>
               <ul>
                 <li>Formation : {{formation}}</li>
                 <li>Date : {{date}}</li>
                 <li>Lieu : {{lieu}}</li>
                 <li>Durée : {{duree}}</li>
               </ul>
               
               <p>Nous vous contacterons prochainement pour confirmer votre participation et vous communiquer tous les détails pratiques.</p>
               
               <p style="margin-top: 30px;">
                 Si vous avez des questions, n'hésitez pas à nous contacter :
                 <br>Téléphone : 06 41 54 33 55
                 <br>Email : contact@aloha-secourisme.fr
               </p>
               
               <p style="margin-top: 30px;">
                 Cordialement,<br>
                 L'équipe Aloha Secourisme
               </p>
             </td>
           </tr>
           
           <tr>
             <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
               <p style="font-size: 12px; color: #666;">
                 Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br>
                 © {{year}} Aloha Secourisme - Tous droits réservés
               </p>
             </td>
           </tr>
         </table>
       </body>
     </html>
   `,
   active: true
 },
 {
   name: "Confirmation sauvetage sportif",
   subject: "Confirmation de votre inscription au sauvetage sportif",
   type: EmailType.INSCRIPTION,
   description: "Email envoyé après une inscription au sauvetage sportif",
   content: `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
       </head>
       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #444; max-width: 600px; margin: 0 auto; padding: 20px;">
         <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
           <tr>
             <td style="padding: 20px; text-align: center;">
               <img src="http://localhost:3000/images/logos/aloha_blue.png" alt="Aloha Secourisme" style="width: 200px; height: auto;">
             </td>
           </tr>
           
           <tr>
             <td style="padding: 20px;">
               <h2 style="color: #0e5399; margin-bottom: 20px;">Bienvenue au club de sauvetage sportif !</h2>
               
               <p>Bonjour {{prenom}} {{nom}},</p>
               
               <p>Nous avons bien reçu votre inscription au club de sauvetage sportif d'Aloha Secourisme et nous sommes ravis de vous accueillir parmi nous !</p>
               
               <p>Voici les informations principales :</p>
               <ul>
                 <li>Horaires des entraînements : Mardi et Jeudi de 20h à 21h30</li>
                 <li>Lieu : Piscine Alréo, Auray</li>
                 <li>Matériel nécessaire : Maillot de bain, bonnet, lunettes, palmes</li>
               </ul>
               
               <p>Un de nos entraîneurs vous contactera prochainement pour organiser votre première séance d'essai.</p>
               
               <p style="margin-top: 30px;">
                 Pour toute question, vous pouvez nous contacter :
                 <br>Téléphone : 06 41 54 33 55
                 <br>Email : contact@aloha-secourisme.fr
               </p>
               
               <p style="margin-top: 30px;">
                 Sportivement,<br>
                 L'équipe Aloha Secourisme
               </p>
             </td>
           </tr>
           
           <tr>
             <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
               <p style="font-size: 12px; color: #666;">
                 © {{year}} Aloha Secourisme - Tous droits réservés
               </p>
             </td>
           </tr>
         </table>
       </body>
     </html>
   `,
   active: true
 },
 {
   name: "Notification incident",
   subject: "⚠️ Nouveau signalement incident",
   type: EmailType.NOTIFICATION,
   description: "Email envoyé aux administrateurs lors d'un signalement d'incident",
   content: `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
       </head>
       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #444; max-width: 600px; margin: 0 auto; padding: 20px;">
         <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
           <tr>
             <td style="padding: 20px; text-align: center;">
               <img src="http://localhost:3000/images/logos/aloha_blue.png" alt="Aloha Secourisme" style="width: 200px; height: auto;">
             </td>
           </tr>
           
           <tr>
             <td style="padding: 20px; text-align: center; background-color: #0e5399;">
               <h2 style="color: #ffffff; margin: 0; font-size: 24px;">
                 <span style="font-size: 28px;">⚠️</span> 
                 Nouveau signalement
               </h2>
             </td>
           </tr>

           <tr>
             <td style="padding: 30px;">
               <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                 <h3 style="color: #0e5399; margin-top: 0;">Informations du déclarant</h3>
                 <p><strong>Nom complet :</strong> {{prenom}} {{nom}}</p>
                 <p><strong>Email :</strong> {{email}}</p>
                 <p><strong>Téléphone :</strong> {{telephone}}</p>
                 <p><strong>Date de naissance :</strong> {{dateNaissance}}</p>
               </div>

               <div style="background-color: #fff3cd; border-radius: 10px; padding: 20px;">
                 <h3 style="color: #856404; margin-top: 0;">Message du signalement</h3>
                 <p style="white-space: pre-wrap;">{{message}}</p>
               </div>
             </td>
           </tr>

           <tr>
             <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
               <p style="font-size: 12px; color: #666;">
                 Mail envoyé le {{date}} à {{heure}}
               </p>
             </td>
           </tr>
         </table>
       </body>
     </html>
   `,
   active: true
 }
];

async function main() {
 console.log('Début de la seed...');

 // Création du super admin
 try {
   const existingAdmin = await prisma.admin.findUnique({
     where: { email: defaultAdmin.email }
   });

   if (!existingAdmin) {
     const hashedPassword = await hash(defaultAdmin.password, 10);
     
     await prisma.admin.create({
       data: {
         ...defaultAdmin,
         password: hashedPassword
       }
     });

     console.log('Super Admin créé avec succès!');
     console.log('Email:', defaultAdmin.email);
     console.log('Mot de passe par défaut:', defaultAdmin.password);
     console.log('IMPORTANT: Changez le mot de passe après la première connexion!');
   } else {
     console.log('Le Super Admin existe déjà');
   }
 } catch (error) {
   console.error('Erreur lors de la création du Super Admin:', error);
 }

 // Création des templates d'emails
 try {
   for (const template of emailTemplates) {
     await prisma.emailTemplate.create({
       data: template
     });
   }
   console.log('Templates emails ajoutés avec succès');
 } catch (error) {
   console.error('Erreur lors de la création des templates:', error);
 }

 console.log('Seed terminée!');
}

main()
 .catch((e) => {
   console.error('Erreur lors de la seed:', e);
   process.exit(1);
 })
 .finally(async () => {
   await prisma.$disconnect();
 });