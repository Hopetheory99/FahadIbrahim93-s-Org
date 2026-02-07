
import { GoogleGenAI } from "@google/genai";

export async function generateSmartCaption(productName: string, platforms: string[]): Promise<string> {
  // Always use a named parameter and direct process.env.API_KEY for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Write a catchy, engaging social media caption for a small business in Bangladesh selling ${productName}. 
  The platforms are: ${platforms.join(', ')}. 
  Include some Bengali (Banglish) phrases to make it relatable. 
  Add relevant emojis and hashtags like #ShopEaseBD #HandmadeBD. 
  Keep it friendly and professional.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    // Accessing .text as a property, which is correct
    return response.text || "New arrival! Check out our latest collection. DM for orders.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Beautiful new item available now! ৳ Order yours today. DM us!";
  }
}
