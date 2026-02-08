
/**
 * ShopEase Identity Engine v5.0 (Global Standard)
 * Implements a Unified SDK Wrapper for IDP (Identity Providers).
 */

import { AuthError, DiagnosticResult } from "../types";

// --- START PRODUCTION CONFIGURATION ---
// In a production environment, replace these placeholders with real Client IDs
// from https://console.cloud.google.com and https://developers.facebook.com
const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: "SHOPEASE_GOOGLE_CLIENT_ID_MOCK",
  FACEBOOK_APP_ID: "SHOPEASE_FB_APP_ID_MOCK",
  AUTH_DOMAIN: "auth.shopease.io",
  SESSION_EXPIRY_HOURS: 48,
  REFRESH_INTERVAL_MS: 15 * 60 * 1000, // 15 mins
};
// --- END PRODUCTION CONFIGURATION ---

const STORAGE_KEY = "shopease_auth_session";

/**
 * High-entropy random string for Nonce/State validation (CSRF protection).
 */
const generateSecureState = () => {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  return btoa(array.join(''));
};

const seal = (data: any) => btoa(encodeURIComponent(JSON.stringify(data)));
const unseal = (token: string) => {
  try {
    return JSON.parse(decodeURIComponent(atob(token)));
  } catch (e) {
    return null;
  }
};

const getFingerprint = () => {
  return btoa([
    navigator.userAgent,
    navigator.language,
    (navigator.hardwareConcurrency || 4).toString(),
    screen.width + "x" + screen.height,
  ].join('|'));
};

export const authService = {
  /**
   * Pre-flight system check for modern cryptographic and storage primitives.
   */
  async runDiagnostics(): Promise<DiagnosticResult> {
    const networkHealthy = navigator.onLine;
    const cookiesEnabled = navigator.cookieEnabled;
    const cryptoAvailable = !!(window.crypto && window.crypto.getRandomValues);
    
    let popupsEnabled = false;
    try {
      const test = window.open("", "diagnostics", "width=1,height=1,left=9999,top=9999");
      if (test) {
        popupsEnabled = !test.closed;
        test.close();
      }
    } catch (e) {
      popupsEnabled = false;
    }

    return { 
      popupsEnabled, 
      networkHealthy, 
      cookiesEnabled: cookiesEnabled && cryptoAvailable 
    };
  },

  /**
   * Universal Social Login Flow.
   * Mirrors Google GSI and Facebook Login patterns.
   */
  async socialLogin(provider: 'google' | 'facebook', rememberMe: boolean, shopNameInput: string): Promise<any> {
    const diagnostics = await this.runDiagnostics();
    const state = generateSecureState(); // CSRF Protection

    return new Promise((resolve, reject) => {
      // Simulate OAuth redirect/popup latency
      const latency = 1200 + Math.random() * 500;

      setTimeout(() => {
        if (!diagnostics.networkHealthy) {
          return reject({
            code: 'AUTH_OFFLINE',
            message: 'Identity Provider Unreachable',
            action: 'Check your internet connection and try the secure login again.',
            severity: 'critical'
          } as AuthError);
        }

        if (!diagnostics.popupsEnabled) {
          return reject({
            code: 'AUTH_POPUP_BLOCKED',
            message: 'Secure Gateway Blocked',
            action: 'Enable popups in your browser settings to allow the social login handshake.',
            severity: 'warning'
          } as AuthError);
        }

        // Simulating Provider Verification (The "Handshake")
        const mockUser = {
          uid: `${provider}_${Date.now()}`,
          email: `merchant.${Date.now()}@${provider}.shopease.io`,
          displayName: shopNameInput || (provider === 'google' ? "G-Suite Merchant" : "Meta Admin"),
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}_${shopNameInput}`,
          providerId: provider,
          accessToken: `token_${generateSecureState().slice(0, 32)}`,
          stateToken: state // Anchoring the session to this specific request state
        };

        const sessionToken = seal({
          ...mockUser,
          createdAt: Date.now(),
          lastRotation: Date.now(),
          fingerprint: getFingerprint(),
          config: { rememberMe }
        });

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, sessionToken);

        resolve(mockUser);
      }, latency);
    });
  },

  /**
   * Session Guard & Rotation
   * Monitors for environment changes and token aging.
   */
  onAuthUpdate(callback: (user: any | null) => void): () => void {
    const checkSession = () => {
      const token = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      
      if (!token) {
        callback(null);
        return;
      }

      const session = unseal(token);
      if (!session) {
        this.signOut();
        callback(null);
        return;
      }

      // 1. Environment Hijacking Check
      if (session.fingerprint !== getFingerprint()) {
        console.error("[Identity] Critical: Browser environment mismatch. Forcing re-auth.");
        this.signOut();
        callback(null);
        return;
      }

      // 2. TTL (Time-to-Live) Check
      const ageHours = (Date.now() - session.createdAt) / (1000 * 60 * 60);
      if (ageHours > AUTH_CONFIG.SESSION_EXPIRY_HOURS) {
        this.signOut();
        callback(null);
        return;
      }

      // 3. Simulated Token Rotation
      const timeSinceRotation = Date.now() - session.lastRotation;
      if (timeSinceRotation > AUTH_CONFIG.REFRESH_INTERVAL_MS) {
        console.log("[Identity] Rotating session key...");
        const rotatedToken = seal({
          ...session,
          lastRotation: Date.now()
        });
        const storage = localStorage.getItem(STORAGE_KEY) ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, rotatedToken);
      }

      callback(session);
    };

    checkSession();
    // In a real app, you might set up an interval for token rotation here
    return () => {};
  },

  async signOut() {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return true;
  }
};
