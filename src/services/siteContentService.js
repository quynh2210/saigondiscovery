import { db, isFirebaseConfigured } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DEMO_SITE_CONTENT } from "../data/demoData";

const COLLECTION_NAME = "siteContent";
const DOC_ID = "general";

let localContent = { ...DEMO_SITE_CONTENT };

/**
 * Lấy nội dung giới thiệu chung của website
 */
export async function getSiteContent() {
  if (!isFirebaseConfigured || !db) {
    return localContent;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return DEMO_SITE_CONTENT;
  } catch (error) {
    console.error("Error reading site content:", error);
    return DEMO_SITE_CONTENT;
  }
}

/**
 * Lưu chỉnh sửa nội dung website
 */
export async function saveSiteContent(content) {
  const updated = {
    ...content,
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hcmc:site-content-updated", { detail: updated }));
  }

  if (!isFirebaseConfigured || !db) {
    localContent = updated;
    return { success: true, isDemo: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(docRef, updated, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving site content:", error);
    throw error;
  }
}

/**
 * Seed nội dung mẫu lên Firestore
 */
export async function seedSiteContent() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase chưa cấu hình");
  }
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  await setDoc(docRef, DEMO_SITE_CONTENT, { merge: true });
  return true;
}
