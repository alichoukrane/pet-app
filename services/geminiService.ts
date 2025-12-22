
import { GoogleGenAI, Type } from "@google/genai";
import { Pet } from "../types";
import i18n from '../i18n/config'; // Direct import to get current language state

// Safety check for API Key
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  /**
   * Generates care advice based on a user query and optional pet context.
   */
  async getCareAdvice(query: string, petContext?: Pet): Promise<string> {
    if (!apiKey) return "Please configure your API Key to use the Assistant.";

    const model = 'gemini-2.5-flash';
    const lang = i18n.language === 'zh-CN' ? 'Simplified Chinese' : 'English';
    
    let contextStr = `You are a professional, friendly veterinary assistant named PetPal. Respond in ${lang}.`;
    if (petContext) {
      contextStr += ` The user is asking about their pet: Name: ${petContext.name}, Species: ${petContext.species}, Breed: ${petContext.breed}, Age: approx ${calculateAge(petContext.dob)}, Weight: ${petContext.weight}kg.`;
    }
    contextStr += " Provide concise, helpful advice. If the question implies a medical emergency, strictly advise seeing a vet immediately.";

    try {
      const response = await ai.models.generateContent({
        model,
        contents: query,
        config: {
          systemInstruction: contextStr,
        }
      });
      return response.text || "I couldn't generate a response at this time.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Sorry, I'm having trouble connecting to the AI service.";
    }
  },

  /**
   * Generates a short daily tip based on weather and pet.
   */
  async getDailyTip(pet: Pet, weather: string): Promise<string> {
    const lang = i18n.language === 'zh-CN' ? 'Simplified Chinese' : 'English';
    if (!apiKey) return i18n.language === 'zh-CN' ? "今天也要给宠物多一点爱哦！" : "Keep your pets hydrated and happy today!";

    const prompt = `Give a single, short (max 15 words) care tip for a ${pet.species} named ${pet.name} in ${lang}. 
    Current weather: ${weather}. 
    Tone: Friendly, helpful, upbeat.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Love your pet every day!";
    } catch (error) {
      return i18n.language === 'zh-CN' ? "确保给你的毛孩子足够的关爱！" : "Make sure to give your furry friend some extra love today!";
    }
  },

  /**
   * Generates a structured suggested schedule for a new pet.
   */
  async getSuggestedSchedule(pet: Pet): Promise<any[]> {
     if (!apiKey) return [];
     const lang = i18n.language === 'zh-CN' ? 'Simplified Chinese' : 'English';

     const prompt = `Generate a recommended list of recurring reminders for a ${pet.species} (${pet.breed}), age ${calculateAge(pet.dob)}, weight ${pet.weight}kg. 
     Respond in ${lang} for titles and notes.
     Return a JSON array of objects with properties: title (string), type (one of: Food, Medication, Vaccination, Grooming, Walk, Vet), recurrence (Daily, Weekly, Monthly), note (short reason).`;

     try {
       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: prompt,
         config: {
           responseMimeType: "application/json",
           responseSchema: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 title: { type: Type.STRING },
                 type: { type: Type.STRING },
                 recurrence: { type: Type.STRING },
                 note: { type: Type.STRING }
               }
             }
           }
         }
       });
       
       return JSON.parse(response.text || "[]");
     } catch (error) {
       console.error("Gemini Schedule Error:", error);
       return [];
     }
  }
};

function calculateAge(dob: string): string {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970) + " years";
}
