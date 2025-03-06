// src/lib/gemini.ts
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { getFullPrompt } from './prompts/chatbot';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getChatResponse(message: string) {
  try {
    const chat = model.startChat({
      history: [{
        role: "user",
        parts: [{ text: getFullPrompt() } as Part]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erreur Gemini:', error);
    return "Désolé, je rencontre des difficultés temporaires. Veuillez réessayer.";
  }
}