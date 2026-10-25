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
import { DEMO_VENUES } from "../data/demoData";

const COLLECTION_NAME = "venues";
const DELETED_META_COLLECTION = "_metadata";
const DELETED_VENUES_DOC = "deleted_venues";

let localVenues = [...DEMO_VENUES];

const memoryDeletedVenueIds = new Set();
try {
  const stored = localStorage.getItem("hcmc_deleted_venue_ids");
  if (stored) {
    JSON.parse(stored).forEach((id) => memoryDeletedVenueIds.add(id));
  }
} catch {
  // ignore
}

async function getDeletedVenueIds() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, DELETED_META_COLLECTION, DELETED_VENUES_DOC));
      if (snap.exists() && Array.isArray(snap.data().deletedVenueIds)) {
        snap.data().deletedVenueIds.forEach((id) => memoryDeletedVenueIds.add(id));
      }
    } catch {
      // ignore
    }
  }
  return memoryDeletedVenueIds;
}

/**
 * Lấy danh sách quán ăn/nước đã xuất bản
 */
export async function getPublishedVenues() {
  const deletedIds = await getDeletedVenueIds();

  if (!isFirebaseConfigured || !db) {
    return localVenues.filter((v) => v.published !== false && !deletedIds.has(v.id));
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), where("published", "==", true));
    const snapshot = await getDocs(q);
    const firestoreVenues = [];
    if (!snapshot.empty) {
      snapshot.forEach((docSnap) => {
        const v = { id: docSnap.id, ...docSnap.data() };
        if (!deletedIds.has(v.id)) {
          firestoreVenues.push(v);
        }
      });
    }

    const mergedMap = new Map();
    DEMO_VENUES.forEach((v) => {
      if (!deletedIds.has(v.id)) {
        mergedMap.set(v.id, { ...v });
      }
    });

    firestoreVenues.forEach((fv) => {
      const demoV = mergedMap.get(fv.id);
      const combinedPlaceIds = demoV
        ? Array.from(new Set([...(fv.placeIds || []), ...(demoV.placeIds || [])]))
        : fv.placeIds || [];
      mergedMap.set(fv.id, { ...demoV, ...fv, placeIds: combinedPlaceIds });
    });

    return Array.from(mergedMap.values()).filter((v) => v.published !== false && !deletedIds.has(v.id));
  } catch (error) {
    console.error("Error reading venues from Firestore:", error);
    return DEMO_VENUES.filter((v) => !deletedIds.has(v.id));
  }
}

/**
 * Lấy các quán ăn/nước được liên kết với một địa điểm du lịch cụ thể
 * @param {string} placeId ID địa điểm du lịch
 */
export async function getVenuesByPlaceId(placeId) {
  if (!placeId) return [];

  const allVenues = await getPublishedVenues();
  return allVenues.filter((v) => {
    if (!Array.isArray(v.placeIds)) return false;
    return v.placeIds.includes(placeId);
  });
}

/**
 * Lấy toàn bộ danh sách quán cho trang quản trị
 */
export async function getAllVenuesAdmin() {
  const deletedIds = await getDeletedVenueIds();

  if (!isFirebaseConfigured || !db) {
    return localVenues.filter((v) => !deletedIds.has(v.id));
  }

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const venues = [];
    snapshot.forEach((docSnap) => {
      const v = { id: docSnap.id, ...docSnap.data() };
      if (!deletedIds.has(v.id)) {
        venues.push(v);
      }
    });

    if (venues.length === 0 && snapshot.empty) {
      return DEMO_VENUES.filter((v) => !deletedIds.has(v.id));
    }

    const mergedMap = new Map();
    DEMO_VENUES.forEach((v) => {
      if (!deletedIds.has(v.id)) {
        mergedMap.set(v.id, { ...v });
      }
    });

    venues.forEach((fv) => {
      const demoV = mergedMap.get(fv.id);
      mergedMap.set(fv.id, { ...demoV, ...fv });
    });

    return Array.from(mergedMap.values()).filter((v) => !deletedIds.has(v.id));
  } catch (error) {
    console.error("Error fetching all venues for admin:", error);
    return localVenues.filter((v) => !deletedIds.has(v.id));
  }
}

/**
 * Tạo mới hoặc cập nhật quán ăn / quán nước
 */
export async function saveVenue(venueData) {
  const id = venueData.id || `venue-${Date.now()}`;
  const now = new Date().toISOString();

  memoryDeletedVenueIds.delete(id);
  try {
    localStorage.setItem("hcmc_deleted_venue_ids", JSON.stringify(Array.from(memoryDeletedVenueIds)));
  } catch {}

  const dataToSave = {
    ...venueData,
    id,
    updatedAt: now,
    createdAt: venueData.createdAt || now
  };

  if (!isFirebaseConfigured || !db) {
    const index = localVenues.findIndex((v) => v.id === id);
    if (index >= 0) {
      localVenues[index] = dataToSave;
    } else {
      localVenues.unshift(dataToSave);
    }
    return { success: true, id, isDemo: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await setDoc(docRef, dataToSave, { merge: true });
    return { success: true, id };
  } catch (error) {
    console.error("Error saving venue to Firestore:", error);
    throw error;
  }
}

/**
 * Xóa quán ăn / nước
 */
export async function deleteVenue(id) {
  if (!id) return { success: false };

  memoryDeletedVenueIds.add(id);
  localVenues = localVenues.filter((v) => v.id !== id);

  try {
    localStorage.setItem("hcmc_deleted_venue_ids", JSON.stringify(Array.from(memoryDeletedVenueIds)));
  } catch {}

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      await setDoc(
        doc(db, DELETED_META_COLLECTION, DELETED_VENUES_DOC),
        { deletedVenueIds: Array.from(memoryDeletedVenueIds) },
        { merge: true }
      );
    } catch (error) {
      console.error("Error deleting venue:", error);
      throw error;
    }
  }
  return { success: true };
}

/**
 * Seed danh sách quán mẫu lên Firestore
 */
export async function seedDemoVenues() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase chưa được cấu hình. Vui lòng thiết lập .env trước khi seed dữ liệu.");
  }

  memoryDeletedVenueIds.clear();
  try {
    localStorage.removeItem("hcmc_deleted_venue_ids");
    await setDoc(
      doc(db, DELETED_META_COLLECTION, DELETED_VENUES_DOC),
      { deletedVenueIds: [] },
      { merge: true }
    );
  } catch {}

  const results = [];
  for (const venue of DEMO_VENUES) {
    const docRef = doc(db, COLLECTION_NAME, venue.id);
    await setDoc(docRef, { ...venue, updatedAt: new Date().toISOString() }, { merge: true });
    results.push(venue.id);
  }
  return results;
}
