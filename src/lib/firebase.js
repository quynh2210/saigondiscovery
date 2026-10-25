/**
 * Khởi tạo Firebase SDK (Modular API)
 * Đọc cấu hình từ biến môi trường VITE_ hoặc sử dụng cấu hình dự án hcmc-11594.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC0MFm6OwJ5iHMhd2tqOiPw2u-unst23WU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hcmc-11594.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hcmc-11594",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hcmc-11594.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "880205902221",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:880205902221:web:013a39a6d8f167855b8dc4"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

let app = null;
let db = null;
let auth = null;
let appCheck = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  console.info("Firebase initialized successfully with Project ID:", firebaseConfig.projectId);

  // Cấu hình Firebase App Check (bảo vệ ứng dụng và API)
  if (typeof window !== "undefined") {
    if (import.meta.env.DEV) {
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    if (import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN) {
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
    }

    const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (recaptchaKey && recaptchaKey !== "YOUR_RECAPTCHA_SITE_KEY") {
      try {
        const provider = import.meta.env.VITE_RECAPTCHA_ENTERPRISE === "true"
          ? new ReCaptchaEnterpriseProvider(recaptchaKey)
          : new ReCaptchaV3Provider(recaptchaKey);

        appCheck = initializeAppCheck(app, {
          provider,
          isTokenAutoRefreshEnabled: true
        });
        console.info("Firebase App Check initialized successfully.");
      } catch (appCheckErr) {
        console.warn("App Check initialization note:", appCheckErr.message);
      }
    }
  }
} catch (error) {
  console.warn("Failed to initialize Firebase with provided credentials:", error);
}

export { app, db, auth, appCheck };
