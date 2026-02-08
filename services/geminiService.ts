
import { GoogleGenAI, Type } from "@google/genai";
import { SocialMediaCaptions, Product, Order, AIStrategicInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates smart captions for products.
 */
export async function generateSmartCaptions(productName: string, imageBase64?: string | null): Promise<SocialMediaCaptions> {
  const textPart = {
    text: `Act as an expert social media manager for a small business in Bangladesh.
    Product: "${productName}". Identify exactly what is in the image (if provided).
    Generate three distinct, catchy social media captions (Facebook, Instagram, TikTok).
    Use a mix of English and Bengali (Banglish). Facebook: Emotional/Descriptive. Instagram: Aesthetic/Hashtags. TikTok: Script Hook.
    Include emojis and hashtags like #ShopEaseBD #BangladeshSME.`
  };

  const parts: any[] = [textPart];
  if (imageBase64) {
    const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
    if (matches && matches.length === 3) {
      parts.push({ inlineData: { mimeType: matches[1], data: matches[2] } });
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            facebook: { type: Type.STRING },
            instagram: { type: Type.STRING },
            tiktok: { type: Type.STRING }
          },
          required: ["facebook", "instagram", "tiktok"]
        }
      }
    });
    return JSON.parse(response.text) as SocialMediaCaptions;
  } catch (error) {
    console.error("Caption Gen Error:", error);
    return { facebook: "Check out our new collection! ৳ DM to order.", instagram: "New Drop ✨ #ShopEaseBD", tiktok: "Must have! 🔥" };
  }
}

/**
 * Generates AI-powered business insights based on current store state.
 */
export async function getStrategicInsights(products: Product[], orders: Order[]): Promise<AIStrategicInsight[]> {
  const prompt = `
    Context: A small business seller in Bangladesh using "ShopEase".
    Inventory State: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stock, price: p.price })))}
    Recent Orders: ${JSON.stringify(orders.slice(0, 5).map(o => ({ item: o.productName, platform: o.platform })))}
    
    Task: Provide 3 high-impact strategic insights for the merchant.
    One for Marketing, one for Inventory, one for Sales growth. 
    Make them specific to the Bangladeshi market context (e.g., mention F-commerce, delivery trends).
    Return as JSON array of objects with: title, description, actionLabel, impact (high/medium/low), and type (marketing/inventory/sales).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              actionLabel: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["high", "medium", "low"] },
              type: { type: Type.STRING, enum: ["marketing", "inventory", "sales"] }
            },
            required: ["title", "description", "actionLabel", "impact", "type"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Strategic Insight Error:", error);
    return [{
      title: "Boost Social Presence",
      description: "Engagement is high on Facebook. Post more customer testimonials.",
      actionLabel: "Create Post",
      impact: "medium",
      type: "marketing"
    }];
  }
}

/**
 * Generates a lifestyle product image from description.
 */
export async function generateProductPhoto(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `High-quality lifestyle product photography for a brand in Bangladesh: ${prompt}. Clean background, professional lighting, modern aesthetic.`,
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}
