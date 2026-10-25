import { db, isFirebaseConfigured } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import { DEMO_PLACES } from "../data/demoData";

const COLLECTION_NAME = "places";
const DELETED_META_COLLECTION = "_metadata";
const DELETED_TOMBSTONE_ID = "tombstones";

// Bộ nhớ đệm cục bộ khi ở chế độ Demo
let localPlaces = [...DEMO_PLACES];

// Bộ nhớ cache các ID địa điểm đã bị xóa để ngăn demoData tự động nạp lại
const memoryDeletedIds = new Set();
try {
  const stored = localStorage.getItem("hcmc_deleted_place_ids");
  if (stored) {
    JSON.parse(stored).forEach((id) => memoryDeletedIds.add(id));
  }
} catch {
  // ignore
}

/**
 * Lấy danh sách các ID địa điểm đã xóa từ Firestore hoặc bộ nhớ đệm
 */
export async function getDeletedPlaceIds() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, DELETED_META_COLLECTION, DELETED_TOMBSTONE_ID));
      if (snap.exists() && Array.isArray(snap.data().deletedPlaceIds)) {
        snap.data().deletedPlaceIds.forEach((id) => memoryDeletedIds.add(id));
      }
    } catch (e) {
      // Có thể chưa có tài liệu _metadata/tombstones, bỏ qua lỗi
    }
  }
  return memoryDeletedIds;
}

/**
 * Lấy danh sách các địa điểm đã xuất bản (cho khách du lịch)
 */
export async function getPublishedPlaces() {
  const deletedIds = await getDeletedPlaceIds();

  if (!isFirebaseConfigured || !db) {
    return localPlaces.filter(
      (p) => p.published !== false && !deletedIds.has(p.id) && !p.deleted
    );
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), where("published", "==", true));
    const snapshot = await getDocs(q);
    const places = [];
    snapshot.forEach((docSnap) => {
      const p = { id: docSnap.id, ...docSnap.data() };
      if (!deletedIds.has(p.id) && !p.deleted) {
        places.push(p);
      }
    });

    if (places.length === 0 && snapshot.empty) {
      console.warn("Firestore 'places' collection is empty. Falling back to Demo Places.");
      return DEMO_PLACES.filter((dp) => !deletedIds.has(dp.id));
    }

    // Merge với DEMO_PLACES nếu chưa có trong Firestore và chưa bị xóa
    const resultPlaces = [...places];
    DEMO_PLACES.forEach((dp) => {
      if (deletedIds.has(dp.id)) return; // Không nạp lại địa điểm đã xóa!
      const exists = resultPlaces.some(
        (p) => p.id === dp.id || (p.id === "place-1792160140411" && dp.id === "thpt-le-quy-don")
      );
      if (!exists) {
        resultPlaces.push(dp);
      }
    });

    return resultPlaces.filter((p) => !deletedIds.has(p.id) && p.published !== false);
  } catch (error) {
    console.error("Error reading places from Firestore:", error);
    return DEMO_PLACES.filter((dp) => !deletedIds.has(dp.id));
  }
}

/**
 * Lấy toàn bộ địa điểm (kể cả bản nháp) cho trang quản trị
 */
export async function getAllPlacesAdmin() {
  const deletedIds = await getDeletedPlaceIds();

  if (!isFirebaseConfigured || !db) {
    return localPlaces.filter((p) => !deletedIds.has(p.id) && !p.deleted);
  }

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const places = [];
    snapshot.forEach((docSnap) => {
      const p = { id: docSnap.id, ...docSnap.data() };
      if (!deletedIds.has(p.id) && !p.deleted) {
        places.push(p);
      }
    });

    const resultPlaces = places.length > 0 ? places : [];
    
    // Nếu rỗng, dùng demo places
    if (resultPlaces.length === 0 && snapshot.empty) {
      return DEMO_PLACES.filter((dp) => !deletedIds.has(dp.id));
    }

    // Đảm bảo không nạp lại địa điểm đã bị quản trị viên xóa
    DEMO_PLACES.forEach((dp) => {
      if (deletedIds.has(dp.id)) return;
      const exists = resultPlaces.some(
        (p) => p.id === dp.id || (p.id === "place-1792160140411" && dp.id === "thpt-le-quy-don")
      );
      if (!exists) {
        resultPlaces.push(dp);
      }
    });

    return resultPlaces.filter((p) => !deletedIds.has(p.id));
  } catch (error) {
    console.error("Error reading all places for admin:", error);
    return localPlaces.filter((p) => !deletedIds.has(p.id));
  }
}

/**
 * Lấy chi tiết một địa điểm theo ID
 */
export async function getPlaceById(id) {
  if (!id) return null;

  const deletedIds = await getDeletedPlaceIds();
  if (deletedIds.has(id)) {
    return null;
  }

  const isLeQuyDonId = id === "place-1792160140411" || id === "thpt-le-quy-don";

  let place = null;
  if (!isFirebaseConfigured || !db) {
    place = localPlaces.find((p) => p.id === id || p.slug === id) || null;
    if (!place && isLeQuyDonId) {
      place = DEMO_PLACES.find((p) => p.id === "thpt-le-quy-don");
    }
    return place && !deletedIds.has(place.id) ? place : null;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      place = { id: docSnap.id, ...docSnap.data() };
    } else {
      place = DEMO_PLACES.find((p) => p.id === id || p.slug === id) || null;
      if (!place && isLeQuyDonId) {
        place = DEMO_PLACES.find((p) => p.id === "thpt-le-quy-don");
      }
    }

    if (place && deletedIds.has(place.id)) {
      return null;
    }

    return place;
  } catch (error) {
    console.error("Error reading place from Firestore:", error);
    place = DEMO_PLACES.find((p) => p.id === id || p.slug === id) || null;
    return place && !deletedIds.has(place.id) ? place : null;
  }
}

/**
 * Thêm mới hoặc Cập nhật địa điểm
 */
export async function savePlace(placeData) {
  const isNew = !placeData.id;
  const id = placeData.id || `place-${Date.now()}`;
  const now = new Date().toISOString();

  // Đảm bảo xóa khỏi danh sách đã xóa nếu tạo lại/lưu lại
  memoryDeletedIds.delete(id);
  try {
    localStorage.setItem("hcmc_deleted_place_ids", JSON.stringify(Array.from(memoryDeletedIds)));
  } catch {}

  const dataToSave = {
    ...placeData,
    id,
    deleted: false,
    updatedAt: now,
    ...(isNew ? { createdAt: now } : {})
  };

  if (!isFirebaseConfigured || !db) {
    const index = localPlaces.findIndex((p) => p.id === id);
    if (index >= 0) {
      localPlaces[index] = dataToSave;
    } else {
      localPlaces.push(dataToSave);
    }
    window.dispatchEvent(new CustomEvent("hcmc:places-updated"));
    return { success: true, id, isDemo: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await setDoc(docRef, dataToSave, { merge: true });

    // Cập nhật lại tombstones nếu có
    await setDoc(
      doc(db, DELETED_META_COLLECTION, DELETED_TOMBSTONE_ID),
      { deletedPlaceIds: Array.from(memoryDeletedIds) },
      { merge: true }
    );

    window.dispatchEvent(new CustomEvent("hcmc:places-updated"));
    return { success: true, id };
  } catch (error) {
    console.error("Error saving place to Firestore:", error);
    throw error;
  }
}

/**
 * Xóa hoàn toàn địa điểm (trên Bản đồ, Chatbot, Trang chủ và Admin)
 */
export async function deletePlace(id) {
  if (!id) return { success: false };

  memoryDeletedIds.add(id);
  localPlaces = localPlaces.filter((p) => p.id !== id);

  try {
    localStorage.setItem("hcmc_deleted_place_ids", JSON.stringify(Array.from(memoryDeletedIds)));
  } catch {}

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      await setDoc(
        doc(db, DELETED_META_COLLECTION, DELETED_TOMBSTONE_ID),
        { deletedPlaceIds: Array.from(memoryDeletedIds) },
        { merge: true }
      );
    } catch (error) {
      console.error("Error deleting place from Firestore:", error);
      throw error;
    }
  }

  // Phát tín hiệu để HomePage, MapPage và Chatbot lập tức cập nhật lại
  window.dispatchEvent(new CustomEvent("hcmc:place-deleted", { detail: { id } }));
  window.dispatchEvent(new CustomEvent("hcmc:places-updated"));
  return { success: true };
}

/**
 * Đồng bộ toàn bộ dữ liệu mẫu lên Cloud Firestore (1-Click Seed)
 */
export async function seedDemoPlaces() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase chưa được cấu hình. Vui lòng thiết lập .env trước khi seed dữ liệu.");
  }

  // Khi seed dữ liệu mới, làm mới danh sách tombstones
  memoryDeletedIds.clear();
  try {
    localStorage.removeItem("hcmc_deleted_place_ids");
    await setDoc(
      doc(db, DELETED_META_COLLECTION, DELETED_TOMBSTONE_ID),
      { deletedPlaceIds: [] },
      { merge: true }
    );
  } catch {}

  const results = [];
  for (const place of DEMO_PLACES) {
    const docRef = doc(db, COLLECTION_NAME, place.id);
    await setDoc(docRef, { ...place, deleted: false, updatedAt: new Date().toISOString() }, { merge: true });
    results.push(place.id);
  }
  return results;
}
