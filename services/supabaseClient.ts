
import { SocialMediaCaptions } from "../types";

/**
 * Social Bridge Service
 * Handles the media upload and status polling from external platform APIs.
 */
export const socialBridge = {
  publishToAll: async (payload: { captions: SocialMediaCaptions, image: string, platforms: string[] }) => {
    console.log("[SocialBridge] Distributing payload to:", payload.platforms);
    
    // Simulate multi-platform API distribution
    return new Promise((resolve, reject) => {
      const successChance = Math.random();
      
      setTimeout(() => {
        if (successChance < 0.05) { 
          reject(new Error("API Connection Timeout. Please try again."));
        } else {
          resolve({
            success: true,
            job_id: `shopease_post_${Date.now()}`
          });
        }
      }, 2500);
    });
  }
};
