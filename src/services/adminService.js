import { auth, db, isFirebaseConfigured } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Kiểm tra xem UID có quyền admin hay không
 * Document ID trong collection 'admins' phải trùng với UID của tài khoản
 */
export async function verifyAdminStatus(uid) {
  if (!uid) return false;

  if (!isFirebaseConfigured || !db) {
    return true; // Demo fallback
  }

  try {
    const adminDocRef = doc(db, "admins", uid);
    const snap = await getDoc(adminDocRef);
    return snap.exists();
  } catch (error) {
    console.error("Error verifying admin UID in Firestore:", error);
    return false;
  }
}

/**
 * Đăng nhập quản trị viên
 */
export async function loginAdminUser(email, password) {
  // Xóa mọi phiên demo cũ để tránh xung đột
  sessionStorage.removeItem("hcmc_demo_admin");

  if (!isFirebaseConfigured || !auth) {
    // Demo Mode fallback khi không có Firebase
    if (email === "admin@hcmc.vn" && password === "admin123") {
      const demoUser = {
        uid: "demo-admin-uid-12345",
        email: "admin@hcmc.vn",
        displayName: "Demo Admin",
        isDemo: true
      };
      sessionStorage.setItem("hcmc_demo_admin", JSON.stringify(demoUser));
      return { success: true, user: demoUser, isDemo: true };
    }
    throw new Error("Chế độ Demo: Vui lòng nhập email 'admin@hcmc.vn' và mật khẩu 'admin123'");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Kiểm tra quyền trong collection 'admins'
    const isAdmin = await verifyAdminStatus(user.uid);
    if (!isAdmin) {
      await signOut(auth);
      throw new Error(`Tài khoản (${user.email}) chưa được phân quyền trong collection 'admins'. Vui lòng tạo tài liệu với Document ID là '${user.uid}' trong collection 'admins' trên Firebase Console.`);
    }

    return { success: true, user };
  } catch (error) {
    console.error("Admin login failed:", error);
    throw error;
  }
}

/**
 * Đăng xuất
 */
export async function logoutAdminUser() {
  sessionStorage.removeItem("hcmc_demo_admin");
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
 * Lấy user quản trị viên hiện tại
 */
export function getCurrentAdminUser(callback) {
  // Chỉ kiểm tra session demo khi Firebase KHÔNG được cấu hình
  if (!isFirebaseConfigured || !auth) {
    const demoUserJson = sessionStorage.getItem("hcmc_demo_admin");
    if (demoUserJson) {
      try {
        const demoUser = JSON.parse(demoUserJson);
        callback(demoUser);
        return () => {};
      } catch {
        // ignore
      }
    }
    callback(null);
    return () => {};
  }

  // Khi Firebase được cấu hình, xóa session demo tồn dư và dùng onAuthStateChanged
  sessionStorage.removeItem("hcmc_demo_admin");

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isAdmin = await verifyAdminStatus(user.uid);
      if (isAdmin) {
        callback(user);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}
