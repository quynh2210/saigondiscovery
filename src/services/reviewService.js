import { db, isFirebaseConfigured } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const COLLECTION_NAME = "reviews";

// Lưu tạm thời trong bộ nhớ khi không có Firebase
let localReviews = [
  {
    id: "review-demo-1",
    placeId: "dinh-doc-lap",
    userId: "demo-user-1",
    userDisplayName: "Nguyễn Văn Hùng",
    userPhotoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    caption: "Khuôn viên rất rộng và nhiều cây cổ thụ xanh mát. Phòng khánh tiết và khu hầm ngầm tác chiến cực kỳ ấn tượng, rất đáng để ghé thăm!",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-03-15T10:30:00.000Z"
  },
  {
    id: "review-demo-2",
    placeId: "dinh-doc-lap",
    userId: "demo-user-2",
    userDisplayName: "Sarah Jenkins",
    userPhotoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    caption: "A must-see in Ho Chi Minh City! The architecture is remarkable and the historic artifacts are well preserved.",
    imageUrl: "",
    createdAt: "2026-03-20T14:15:00.000Z"
  },
  {
    id: "review-demo-3",
    placeId: "bao-tang-chung-tich-chien-tranh",
    userId: "demo-user-3",
    userDisplayName: "Trần Minh Quân",
    userPhotoURL: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    caption: "Một điểm đến xúc động và ý nghĩa. Hình ảnh lịch sử vô cùng chân thực và sâu sắc.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-03-25T09:00:00.000Z"
  }
];

/**
 * Lấy danh sách đánh giá của một địa điểm cụ thể
 * @param {string} placeId
 */
export async function getReviewsByPlaceId(placeId) {
  if (!placeId) return [];

  if (!isFirebaseConfigured || !db) {
    return localReviews
      .filter((r) => r.placeId === placeId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("placeId", "==", placeId)
    );
    const snapshot = await getDocs(q);
    const reviews = [];
    snapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Sắp xếp giảm dần theo thời gian tạo
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Nếu trên Firestore chưa có bài đánh giá nào cho địa điểm này, hợp nhất dữ liệu demo
    if (reviews.length === 0) {
      return localReviews.filter((r) => r.placeId === placeId);
    }

    return reviews;
  } catch (error) {
    console.error("Error reading reviews from Firestore:", error);
    return localReviews.filter((r) => r.placeId === placeId);
  }
}

/**
 * Gửi một đánh giá mới
 * @param {object} reviewData { placeId, rating, caption, imageUrl, user }
 */
export async function addReview({ placeId, rating, caption = "", imageUrl = "", user }) {
  if (!user || !user.uid) {
    throw new Error("Bạn phải đăng nhập để gửi bài đánh giá.");
  }
  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Vui lòng chọn số sao đánh giá (từ 1 đến 5 sao).");
  }

  const newReview = {
    placeId,
    userId: user.uid,
    userDisplayName: user.displayName || user.email?.split("@")[0] || "Người dùng",
    userEmail: user.email || "",
    userPhotoURL: user.photoURL || "",
    rating: Number(rating),
    caption: String(caption || "").trim(),
    imageUrl: String(imageUrl || "").trim(),
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured || !db) {
    const created = { id: `review-${Date.now()}`, ...newReview };
    localReviews.unshift(created);
    return created;
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newReview);
    return { id: docRef.id, ...newReview };
  } catch (error) {
    console.error("Error adding review to Firestore:", error);
    throw error;
  }
}

/**
 * Xóa một bài đánh giá (dành cho người tạo hoặc Admin)
 * @param {string} reviewId
 */
export async function deleteReview(reviewId) {
  if (!reviewId) return false;

  localReviews = localReviews.filter((r) => r.id !== reviewId);

  if (!isFirebaseConfigured || !db) {
    return true;
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, reviewId));
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

/**
 * Lấy toàn bộ đánh giá trên hệ thống cho trang quản trị Admin
 */
export async function getAllReviewsAdmin() {
  if (!isFirebaseConfigured || !db) {
    return [...localReviews];
  }

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const reviews = [];
    snapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (reviews.length === 0) {
      return [...localReviews];
    }

    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return reviews;
  } catch (error) {
    console.error("Error reading all reviews for admin:", error);
    return [...localReviews];
  }
}
