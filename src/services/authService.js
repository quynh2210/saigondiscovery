import { auth, isFirebaseConfigured } from "../lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

/**
 * Đăng nhập bằng tài khoản Google
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    // Chế độ Demo
    const demoUser = {
      uid: "demo-google-user-123",
      email: "user@gmail.com",
      displayName: "Khách Du Lịch (Google)",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      isDemo: true
    };
    sessionStorage.setItem("hcmc_demo_user", JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
}

/**
 * Đăng nhập bằng Email & Mật khẩu
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    const demoUser = {
      uid: "demo-email-user-456",
      email,
      displayName: email.split("@")[0],
      photoURL: "",
      isDemo: true
    };
    sessionStorage.setItem("hcmc_demo_user", JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Email sign in error:", error);
    throw error;
  }
}

/**
 * Đăng ký tài khoản bằng Email & Mật khẩu
 */
export async function registerWithEmail(email, password, displayName) {
  if (!isFirebaseConfigured || !auth) {
    const demoUser = {
      uid: "demo-email-user-" + Date.now(),
      email,
      displayName: displayName || email.split("@")[0],
      photoURL: "",
      isDemo: true
    };
    sessionStorage.setItem("hcmc_demo_user", JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Email sign up error:", error);
    throw error;
  }
}

/**
 * Đăng xuất
 */
export async function logoutUser() {
  sessionStorage.removeItem("hcmc_demo_user");
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  }
  return true;
}

/**
 * Lắng nghe trạng thái đăng nhập
 */
export function subscribeToAuthChanges(callback) {
  if (!isFirebaseConfigured || !auth) {
    const saved = sessionStorage.getItem("hcmc_demo_user");
    if (saved) {
      try {
        callback(JSON.parse(saved));
        return () => {};
      } catch {
        // ignore
      }
    }
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
