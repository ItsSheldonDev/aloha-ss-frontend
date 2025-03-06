import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Fonction de validation du token Turnstile
async function verifyTurnstileToken(token: string) {
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: '0x4AAAAAAA5wkU6q2PWgfc00PIn2TwIeSPg',
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success;
  } catch {
    return false;
  }
}

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.fr',
  port: 465,
  secure: true,
  auth: {
    user: 'systeme@aloha-secourisme.fr',
    pass: 'tEqckCdAyEPyD@5M'
  }
});

export async function POST(request: Request) {
  try {
    // Vérifier l'origine de la requête
    const origin = request.headers.get('origin');
    if (!origin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const { firstname, name, email, phone, birthdate, message, token } = data;

    // Vérifier le token Turnstile
    const isValidToken = await verifyTurnstileToken(token);
    if (!isValidToken) {
      return NextResponse.json({ error: 'Invalid captcha' }, { status: 400 });
    }

    await transporter.sendMail({
      from: 'systeme@aloha-secourisme.fr',
      to: 'contact@aloha-secourisme.fr',
      subject: '⚠️ Nouveau signalement - Aloha Secourisme',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouveau signalement</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <img src="http://185.229.202.65:3000/_next/image?url=%2Fimages%2Flogos%2Faloha_blue.png&w=640&q=75" alt="Aloha Secourisme" style="width: 200px; height: auto;">
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #0e5399;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                    <span style="font-size: 28px;">⚠️</span> 
                    Nouveau signalement
                  </h1>
                </td>
              </tr>
 
              <tr>
                <td style="padding: 30px;">
                  <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                    <h2 style="color: #0e5399; margin-top: 0;">Informations du déclarant</h2>
                    <table width="100%" cellpadding="5">
                      <tr>
                        <td style="font-weight: bold; width: 150px; color: #444;">Nom complet :</td>
                        <td style="color: #666;">${firstname} ${name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #444;">Email :</td>
                        <td style="color: #666;">
                          <a href="mailto:${email}" style="color: #0e5399; text-decoration: none;">
                            ${email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #444;">Téléphone :</td>
                        <td style="color: #666;">
                          <a href="tel:${phone}" style="color: #0e5399; text-decoration: none;">
                            ${phone}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #444;">Date de naissance :</td>
                        <td style="color: #666;">${birthdate}</td>
                      </tr>
                    </table>
                  </div>
 
                  <div style="background-color: #fff3cd; border-radius: 10px; padding: 20px;">
                    <h2 style="color: #856404; margin-top: 0;">Message du signalement</h2>
                    <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                  </div>
                </td>
              </tr>
 
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #f4f4f4; color: #666;">
                  <p style="margin: 0; font-size: 12px;">
                    Ce message a été envoyé depuis le formulaire de signalement du site Aloha Secourisme.<br>
                    Date d'envoi : ${new Date().toLocaleString('fr-FR')}
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    });
 
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending incident:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du signalement' },
      { status: 500 }
    );
  }
 }