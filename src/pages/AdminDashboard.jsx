import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  LogOut, 
  MapPin, 
  Utensils, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Database, 
  Loader2, 
  CheckCircle2, 
  Upload,
  Music,
  Image as ImageIcon,
  Star,
  Layers,
  Video,
  Headphones
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getCurrentAdminUser, logoutAdminUser } from "../services/adminService";
import { 
  getAllPlacesAdmin, 
  savePlace, 
  deletePlace, 
  seedDemoPlaces 
} from "../services/placeService";
import { 
  getAllVenuesAdmin, 
  saveVenue, 
  deleteVenue, 
  seedDemoVenues 
} from "../services/venueService";
import { getAllReviewsAdmin, deleteReview } from "../services/reviewService";
import { getSiteContent, saveSiteContent } from "../services/siteContentService";
import { uploadImageToCloudinary } from "../services/uploadService";
import { isFirebaseConfigured } from "../lib/firebase";
import { normalizeAudioUrl, normalizeAssetUrl } from "../utils/mediaUtils";
import { formatDistrict } from "../utils/translations";

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("places"); // 'places' | 'venues' | 'reviews' | 'content'
  const [places, setPlaces] = useState([]);
  const [venues, setVenues] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);

  // Feedback State
  const [toastMessage, setToastMessage] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [placesData, venuesData, reviewsData, contentData] = await Promise.all([
        getAllPlacesAdmin(),
        getAllVenuesAdmin(),
        getAllReviewsAdmin(),
        getSiteContent()
      ]);
      setPlaces(placesData);
      setVenues(venuesData);
      setReviews(reviewsData);
      setSiteContent(contentData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra đăng nhập
  useEffect(() => {
    const unsubscribe = getCurrentAdminUser((user) => {
      if (!user) {
        navigate("/admin");
      } else {
        setCurrentUser(user);
        loadAllData();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleLogout = async () => {
    await logoutAdminUser();
    navigate("/admin");
  };

  // Upload ảnh lên Cloudinary
  const handleCloudinaryUpload = async (file, onSuccess) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onSuccess(url);
      showToast("Tải ảnh lên Cloudinary thành công!");
    } catch (err) {
      alert("Lỗi tải ảnh: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Seed Data to Firestore
  const handleSeedData = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn nạp toàn bộ bộ dữ liệu mẫu vào cơ sở dữ liệu?")) {
      return;
    }
    setIsSeeding(true);
    try {
      if (isFirebaseConfigured) {
        await seedDemoPlaces();
        await seedDemoVenues();
        showToast("Đã đồng bộ thành công dữ liệu mẫu lên Cloud Firestore!");
      } else {
        showToast("Đang ở chế độ Demo.");
      }
      loadAllData();
    } catch (err) {
      alert("Lỗi khi seed dữ liệu: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // ==================== QUẢN LÝ ĐỊA ĐIỂM ====================
  const handleOpenPlaceModal = (place = null) => {
    if (place) {
      const cloned = JSON.parse(JSON.stringify(place));
      // Đảm bảo audioGuide cả bản VI và EN luôn tồn tại object an toàn
      const rawAudio = cloned.audioGuide || {};
      cloned.audioGuide = {
        vi: {
          title: rawAudio.vi?.title || `Thuyết minh ${cloned.name?.vi || ""}`,
          url: rawAudio.vi?.url || (typeof rawAudio === "string" ? rawAudio : "") || "",
          duration: rawAudio.vi?.duration || "3:00"
        },
        en: {
          title: rawAudio.en?.title || `${cloned.name?.en || cloned.name?.vi || ""} Audio Guide`,
          url: rawAudio.en?.url || "",
          duration: rawAudio.en?.duration || "3:00"
        }
      };
      setEditingPlace(cloned);
    } else {
      setEditingPlace({
        name: { vi: "", en: "" },
        district: "Quận 1",
        category: "historical",
        address: { vi: "", en: "" },
        coordinates: { lat: 10.7769, lng: 106.6953 },
        openingHours: { vi: "", en: "" },
        ticketPrice: { vi: "", en: "" },
        phone: "",
        summary: { vi: "", en: "" },
        description: { vi: "", en: "" },
        history: { vi: "", en: "" },
        coverImageUrl: "",
        gallery: [],
        audioGuide: {
          vi: { title: "Thuyết minh", url: "", duration: "3:00" },
          en: { title: "Audio Guide", url: "", duration: "3:00" }
        },
        qrGuide: {
          vi: { title: "Quét mã để xem nguồn thông tin", imageUrl: "" },
          en: { title: "Scan to view information sources", imageUrl: "" }
        },
        published: true
      });
    }
    setNewGalleryUrl("");
    setPlaceModalOpen(true);
  };

  const handleSavePlace = async (e) => {
    e.preventDefault();
    try {
      const placeToSave = {
        ...editingPlace,
        audioGuide: {
          vi: {
            title: editingPlace.audioGuide?.vi?.title?.trim() || `Thuyết minh ${editingPlace.name?.vi || ""}`,
            url: editingPlace.audioGuide?.vi?.url ? normalizeAudioUrl(editingPlace.audioGuide.vi.url.trim()) : "",
            duration: editingPlace.audioGuide?.vi?.duration?.trim() || "3:00"
          },
          en: {
            title: editingPlace.audioGuide?.en?.title?.trim() || `${editingPlace.name?.en || editingPlace.name?.vi || ""} Audio Guide`,
            url: editingPlace.audioGuide?.en?.url ? normalizeAudioUrl(editingPlace.audioGuide.en.url.trim()) : "",
            duration: editingPlace.audioGuide?.en?.duration?.trim() || "3:00"
          }
        }
      };
      await savePlace(placeToSave);
      setPlaceModalOpen(false);
      showToast("Đã lưu địa điểm thành công!");
      loadAllData();
    } catch (err) {
      alert("Lỗi lưu địa điểm: " + err.message);
    }
  };

  const handleDeletePlace = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa vĩnh viễn địa điểm này? Địa điểm sẽ bị xóa trên toàn bộ bản đồ, trang chủ và chatbot.")) return;
    try {
      await deletePlace(id);
      showToast("Đã xóa hoàn toàn địa điểm khỏi hệ thống!");
      loadAllData();
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };

  const handleTogglePlacePublish = async (place) => {
    try {
      const updated = { ...place, published: !place.published };
      await savePlace(updated);
      showToast(updated.published ? "Đã xuất bản địa điểm!" : "Đã chuyển về bản nháp.");
      loadAllData();
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  // Thêm ảnh vào gallery của địa điểm
  const handleAddGalleryImage = (url) => {
    if (!url || !url.trim()) return;
    const currentGallery = Array.isArray(editingPlace.gallery) ? editingPlace.gallery : [];
    setEditingPlace({
      ...editingPlace,
      gallery: [...currentGallery, url.trim()]
    });
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    const currentGallery = Array.isArray(editingPlace.gallery) ? editingPlace.gallery : [];
    setEditingPlace({
      ...editingPlace,
      gallery: currentGallery.filter((_, idx) => idx !== indexToRemove)
    });
  };

  // ==================== QUẢN LÝ QUÁN ĂN / QUÁN NƯỚC ====================
  const handleOpenVenueModal = (venue = null) => {
    setEditingVenue(
      venue
        ? JSON.parse(JSON.stringify(venue))
        : {
            name: { vi: "", en: "" },
            type: "restaurant",
            category: "Vietnamese Food",
            address: { vi: "", en: "" },
            description: { vi: "", en: "" },
            coordinates: { lat: 10.7769, lng: 106.6953 },
            coverImageUrl: "",
            googleMapsUrl: "",
            placeIds: [],
            published: true
          }
    );
    setVenueModalOpen(true);
  };

  const handleSaveVenue = async (e) => {
    e.preventDefault();
    try {
      await saveVenue(editingVenue);
      setVenueModalOpen(false);
      showToast("Đã lưu thông tin quán ăn thành công!");
      loadAllData();
    } catch (err) {
      alert("Lỗi lưu quán: " + err.message);
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa quán ăn này?")) return;
    try {
      await deleteVenue(id);
      showToast("Đã xóa quán ăn.");
      loadAllData();
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };

  // ==================== QUẢN LÝ BÌNH LUẬN & ĐÁNH GIÁ ====================
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này vì vi phạm tiêu chuẩn cộng đồng?")) return;
    try {
      await deleteReview(id);
      showToast("Đã xóa bình luận thành công!");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Lỗi khi xóa bình luận: " + err.message);
    }
  };

  // ==================== CÀI ĐẶT NỘI DUNG ====================
  const handleSaveSiteContent = async (e) => {
    e.preventDefault();
    try {
      const normalizedContent = {
        ...siteContent,
        backgroundMusicUrl: normalizeAudioUrl(siteContent.backgroundMusicUrl),
        mascotImageUrl: normalizeAssetUrl(siteContent.mascotImageUrl),
        introVideoUrl: siteContent.introVideoUrl ? siteContent.introVideoUrl.trim() : ""
      };
      await saveSiteContent(normalizedContent);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hcmc:site-content-updated", { detail: normalizedContent }));
      }
      showToast("Đã cập nhật nội dung website thành công!");
    } catch (err) {
      alert("Lỗi lưu cài đặt: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <Loader2 size={36} className="spinning-loader" />
        <p>Đang tải dữ liệu quản trị...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Top Bar Header */}
      <header className="dashboard-header-bar">
        <div className="section-container header-inner-flex">
          <div className="dash-brand-block">
            <ShieldCheck size={26} className="dash-brand-icon" />
            <div>
              <h2 className="dash-heading">{t("adminTitle")}</h2>
              <span className="dash-sub-badge">
                {currentUser?.email || "Quản trị viên"} • Sài Gòn Discovery
              </span>
            </div>
          </div>

          <div className="dash-top-actions">
            <button
              type="button"
              className="dash-action-btn seed-btn"
              onClick={handleSeedData}
              disabled={isSeeding}
              title="Khôi phục & Đồng bộ dữ liệu gốc lên Firestore"
            >
              {isSeeding ? <Loader2 size={16} className="spinning-loader" /> : <Database size={16} />}
              <span>{isSeeding ? "Đang đồng bộ..." : t("seedDataBtn")}</span>
            </button>

            <button
              type="button"
              className="dash-action-btn logout-btn"
              onClick={handleLogout}
              title={t("logoutBtn")}
            >
              <LogOut size={16} />
              <span>{t("logoutBtn")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="dashboard-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="section-container dashboard-main-content">
        {/* Navigation Tabs */}
        <div className="dashboard-tabs-bar">
          <button
            type="button"
            className={`dash-tab ${activeTab === "places" ? "active" : ""}`}
            onClick={() => setActiveTab("places")}
          >
            <MapPin size={18} />
            <span>{t("managePlaces")} ({places.length})</span>
          </button>
          <button
            type="button"
            className={`dash-tab ${activeTab === "venues" ? "active" : ""}`}
            onClick={() => setActiveTab("venues")}
          >
            <Utensils size={18} />
            <span>Quán ăn & Cà phê ({venues.length})</span>
          </button>
          <button
            type="button"
            className={`dash-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <Star size={18} />
            <span>Đánh giá & Bình luận ({reviews.length})</span>
          </button>
          <button
            type="button"
            className={`dash-tab ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            <Settings size={18} />
            <span>Cài đặt nội dung & Nhạc</span>
          </button>
        </div>

        {/* Tab 1: Quản lý Địa Điểm */}
        {activeTab === "places" && (
          <div className="dashboard-tab-panel">
            <div className="panel-actions-row">
              <h3>Danh sách địa điểm du lịch ({places.length})</h3>
              <button
                type="button"
                className="dash-btn primary"
                onClick={() => handleOpenPlaceModal()}
              >
                <Plus size={16} />
                <span>Thêm địa điểm mới</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên địa danh</th>
                    <th>Quận</th>
                    <th>Danh mục</th>
                    <th>Thuyết minh</th>
                    <th>QR Code</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((place) => (
                    <tr key={place.id}>
                      <td>
                        <img
                          src={place.coverImageUrl || "/assets/images/placeholder.jpg"}
                          alt=""
                          className="table-thumb"
                        />
                      </td>
                      <td>
                        <strong>{place.name?.vi}</strong>
                        <div className="place-row-sub">{place.name?.en}</div>
                      </td>
                      <td>
                        <span className="badge-tag">{formatDistrict(place.district, lang)}</span>
                      </td>
                      <td>
                        <span className="cat-pill">{place.category}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${place.audioGuide?.vi?.url || place.audioGuide?.en?.url ? "available" : "empty"}`}>
                          {place.audioGuide?.vi?.url && place.audioGuide?.en?.url
                            ? "VI + EN"
                            : place.audioGuide?.vi?.url
                            ? "Có VI"
                            : place.audioGuide?.en?.url
                            ? "Có EN"
                            : "Chưa có"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${place.qrGuide?.vi?.imageUrl || place.qrGuide?.imageUrl ? "available" : "empty"}`}>
                          {place.qrGuide?.vi?.imageUrl || place.qrGuide?.imageUrl ? "Có QR" : "Chưa có"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`status-toggle-btn ${place.published !== false ? "published" : "draft"}`}
                          onClick={() => handleTogglePlacePublish(place)}
                          title="Bấm để bật/tắt hiển thị công khai"
                        >
                          {place.published !== false ? "Đã xuất bản" : "Bản nháp"}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="action-icon edit"
                            onClick={() => handleOpenPlaceModal(place)}
                            title="Chỉnh sửa"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            className="action-icon delete"
                            onClick={() => handleDeletePlace(place.id)}
                            title="Xóa vĩnh viễn"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Quản lý Quán Ăn & Nước */}
        {activeTab === "venues" && (
          <div className="dashboard-tab-panel">
            <div className="panel-actions-row">
              <h3>Danh sách quán ăn & cà phê liên kết ({venues.length})</h3>
              <button
                type="button"
                className="dash-btn primary"
                onClick={() => handleOpenVenueModal()}
              >
                <Plus size={16} />
                <span>Thêm quán mới</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên quán</th>
                    <th>Loại hình</th>
                    <th>Địa chỉ</th>
                    <th>Tọa độ (Map)</th>
                    <th>Liên kết địa danh</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.map((venue) => (
                    <tr key={venue.id}>
                      <td>
                        <img
                          src={venue.coverImageUrl || "/assets/images/placeholder.jpg"}
                          alt=""
                          className="table-thumb"
                        />
                      </td>
                      <td>
                        <strong>{venue.name?.vi}</strong>
                        <div className="place-row-sub">{venue.name?.en}</div>
                      </td>
                      <td>
                        <span className={`type-badge ${venue.type}`}>
                          {venue.type === "restaurant" ? "🍜 Quán ăn" : "☕ Quán nước"}
                        </span>
                      </td>
                      <td className="addr-cell">{venue.address?.vi || venue.address?.en}</td>
                      <td>
                        {venue.coordinates?.lat && venue.coordinates?.lng ? (
                          <span style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600 }}>
                            {venue.coordinates.lat.toFixed(4)}, {venue.coordinates.lng.toFixed(4)}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Chưa ghim tọa độ</span>
                        )}
                      </td>
                      <td>
                        <span className="linked-count-badge">
                          {Array.isArray(venue.placeIds) ? `${venue.placeIds.length} địa điểm` : "0"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="action-icon edit"
                            onClick={() => handleOpenVenueModal(venue)}
                            title="Chỉnh sửa"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            className="action-icon delete"
                            onClick={() => handleDeleteVenue(venue.id)}
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Quản lý Đánh giá & Bình luận */}
        {activeTab === "reviews" && (
          <div className="dashboard-tab-panel">
            <div className="panel-actions-row">
              <div>
                <h3>Kiểm duyệt bình luận & Đánh giá ({reviews.length})</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  Quản trị viên có toàn quyền kiểm tra và xóa các bình luận vi phạm tiêu chuẩn cộng đồng.
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Địa điểm</th>
                    <th>Đánh giá</th>
                    <th>Ảnh đính kèm</th>
                    <th>Nội dung bình luận</th>
                    <th>Ngày đăng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                        Chưa có bài đánh giá nào từ người dùng.
                      </td>
                    </tr>
                  ) : (
                    reviews.map((rev) => {
                      const matchedPlace = places.find((p) => p.id === rev.placeId);
                      const placeTitle = matchedPlace?.name?.vi || rev.placeId;

                      return (
                        <tr key={rev.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              {rev.userPhotoURL ? (
                                <img
                                  src={rev.userPhotoURL}
                                  alt=""
                                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                                />
                              ) : (
                                <div style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: "var(--primary)",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700
                                }}>
                                  {rev.userDisplayName?.charAt(0).toUpperCase() || "U"}
                                </div>
                              )}
                              <div>
                                <strong>{rev.userDisplayName}</strong>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{rev.userEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <strong>{placeTitle}</strong>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#f59e0b" }}>
                              <Star size={16} fill="#f59e0b" />
                              <strong style={{ marginLeft: "0.25rem" }}>{rev.rating}/5</strong>
                            </div>
                          </td>
                          <td>
                            {rev.imageUrl ? (
                              <a href={rev.imageUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={rev.imageUrl}
                                  alt="Review"
                                  className="table-thumb"
                                  style={{ cursor: "pointer" }}
                                />
                              </a>
                            ) : (
                              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Không kèm ảnh</span>
                            )}
                          </td>
                          <td style={{ maxWidth: 300, lineHeight: 1.4 }}>
                            {rev.caption ? rev.caption : <em style={{ color: "var(--text-muted)" }}>(Không có lời bình)</em>}
                          </td>
                          <td style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("vi-VN") : ""}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="dash-btn danger"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                              onClick={() => handleDeleteReview(rev.id)}
                              title="Xóa bình luận vi phạm"
                            >
                              <Trash2 size={14} />
                              <span>Xóa</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Cài đặt nội dung, nhạc nền & linh vật */}
        {activeTab === "content" && siteContent && (
          <div className="dashboard-tab-panel">
            <form onSubmit={handleSaveSiteContent} className="site-content-form">
              <h3>Cài Đặt Nhạc Nền, Linh Vật & Nội Dung</h3>

              {/* Phần 1: Cài đặt Nhạc Nền */}
              <div className="setting-card-box">
                <div className="box-header-title">
                  <Music size={20} className="header-icon" />
                  <h4>Nhạc Nền Website (Background Music)</h4>
                </div>
                <div className="upload-flex-row">
                  <input
                    type="text"
                    placeholder="URL file nhạc (vd: /assets/audio/Attention.mp3 hoặc https://...)"
                    value={siteContent.backgroundMusicUrl || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, backgroundMusicUrl: e.target.value })}
                    className="form-input flex-1"
                  />
                </div>
              </div>

              {/* Phần 2: Cài đặt Linh Vật Chatbot */}
              <div className="setting-card-box">
                <div className="box-header-title">
                  <ImageIcon size={20} className="header-icon" />
                  <h4>Linh Vật Chatbot Hướng Dẫn Viên</h4>
                </div>
                <div className="upload-flex-row">
                  <label className="file-upload-label-btn">
                    <Upload size={16} />
                    <span>Tải ảnh lên Cloudinary</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleCloudinaryUpload(e.target.files?.[0], (url) => {
                          setSiteContent({ ...siteContent, mascotImageUrl: url });
                        })
                      }
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Hoặc dán URL ảnh linh vật"
                    value={siteContent.mascotImageUrl || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, mascotImageUrl: e.target.value })}
                    className="form-input flex-1"
                  />
                </div>
                {siteContent.mascotImageUrl && (
                  <div className="media-preview-box" style={{ marginTop: "0.75rem" }}>
                    <img src={siteContent.mascotImageUrl} alt="Mascot" style={{ width: 64, height: 64, objectFit: "contain" }} />
                  </div>
                )}
              </div>

              {/* Phần 3: Cài đặt Video Giới Thiệu Trang Chủ (Hero Showcase Video) */}
              <div className="setting-card-box">
                <div className="box-header-title">
                  <Video size={20} className="header-icon" />
                  <h4>Video Giới Thiệu Trang Chủ (Hero Showcase Video)</h4>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  Video này sẽ phát khi du khách bấm nút "Xem Video Giới Thiệu" trên Banner Trang Chủ. Hỗ trợ file video MP4, WebM hoặc link Cloudinary.
                </p>
                <div className="upload-flex-row">
                  <label className="file-upload-label-btn">
                    <Upload size={16} />
                    <span>Tải video lên Cloudinary</span>
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleCloudinaryUpload(e.target.files?.[0], (url) => {
                          setSiteContent({ ...siteContent, introVideoUrl: url });
                        })
                      }
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Hoặc dán URL video (vd: https://... hoặc /assets/...)"
                    value={siteContent.introVideoUrl || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, introVideoUrl: e.target.value })}
                    className="form-input flex-1"
                  />
                  <button
                    type="button"
                    className="dash-btn secondary"
                    style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                    onClick={() =>
                      setSiteContent({
                        ...siteContent,
                        introVideoUrl:
                          "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/57/Ho_Chi_Minh_city_tour.webm/Ho_Chi_Minh_city_tour.webm.480p.vp9.webm"
                      })
                    }
                  >
                    Dùng video mẫu TP.HCM
                  </button>
                </div>
                {siteContent.introVideoUrl && (
                  <div className="media-preview-box" style={{ marginTop: "1rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-muted)" }}>
                      Xem trước video (Trình phát kiểm tra):
                    </div>
                    <video
                      src={siteContent.introVideoUrl}
                      controls
                      playsInline
                      style={{
                        width: "100%",
                        maxHeight: "280px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "#000",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="modal-actions-bar" style={{ marginTop: "1.5rem" }}>
                <button type="submit" className="dash-btn primary">
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ==================== MODAL CHỈNH SỬA ĐỊA ĐIỂM (BILINGUAL & MULTI-IMAGE CAROUSEL) ==================== */}
      {placeModalOpen && editingPlace && (
        <div className="admin-modal-backdrop" onClick={() => setPlaceModalOpen(false)}>
          <div className="admin-modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPlace.id ? "Chỉnh sửa địa điểm du lịch" : "Thêm địa điểm du lịch mới"}</h3>
              <button type="button" onClick={() => setPlaceModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSavePlace} className="modal-form">
              {/* Tên địa điểm Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tên địa điểm (Tiếng Việt) *</label>
                  <input
                    type="text"
                    required
                    value={editingPlace.name?.vi || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, name: { ...editingPlace.name, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Place Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingPlace.name?.en || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, name: { ...editingPlace.name, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Quận & Danh mục */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Quận</label>
                  <select
                    value={editingPlace.district || "Quận 1"}
                    onChange={(e) => setEditingPlace({ ...editingPlace, district: e.target.value })}
                    className="form-input"
                  >
                    <option value="Quận 1">Quận 1 (cũ) / Former District 1</option>
                    <option value="Quận 3">Quận 3 (cũ) / Former District 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select
                    value={editingPlace.category || "historical"}
                    onChange={(e) => setEditingPlace({ ...editingPlace, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="historical">Di tích lịch sử</option>
                    <option value="architecture">Kiến trúc</option>
                    <option value="culture">Văn hóa & Điểm hẹn</option>
                    <option value="spiritual">Tâm linh & Chùa chiền</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {/* Tọa độ (Vĩ độ & Kinh độ) */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Vĩ độ (Latitude) *</label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={editingPlace.coordinates?.lat || 10.7769}
                    onChange={(e) => setEditingPlace({ ...editingPlace, coordinates: { ...editingPlace.coordinates, lat: parseFloat(e.target.value) } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Kinh độ (Longitude) *</label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={editingPlace.coordinates?.lng || 106.6953}
                    onChange={(e) => setEditingPlace({ ...editingPlace, coordinates: { ...editingPlace.coordinates, lng: parseFloat(e.target.value) } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Địa chỉ Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Địa chỉ (Tiếng Việt) *</label>
                  <input
                    type="text"
                    required
                    value={editingPlace.address?.vi || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, address: { ...editingPlace.address, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Address (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingPlace.address?.en || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, address: { ...editingPlace.address, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Giờ mở cửa Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Giờ mở cửa (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={editingPlace.openingHours?.vi || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, openingHours: { ...editingPlace.openingHours, vi: e.target.value } })}
                    placeholder="8:00 - 17:00 hàng ngày"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Opening Hours (English)</label>
                  <input
                    type="text"
                    value={editingPlace.openingHours?.en || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, openingHours: { ...editingPlace.openingHours, en: e.target.value } })}
                    placeholder="8:00 AM - 5:00 PM daily"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Giá vé Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Giá vé tham quan (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={editingPlace.ticketPrice?.vi || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, ticketPrice: { ...editingPlace.ticketPrice, vi: e.target.value } })}
                    placeholder="40.000 VNĐ / Miễn phí"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Ticket Price (English)</label>
                  <input
                    type="text"
                    value={editingPlace.ticketPrice?.en || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, ticketPrice: { ...editingPlace.ticketPrice, en: e.target.value } })}
                    placeholder="40,000 VND / Free admission"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label>Số điện thoại liên hệ</label>
                <input
                  type="text"
                  value={editingPlace.phone || ""}
                  onChange={(e) => setEditingPlace({ ...editingPlace, phone: e.target.value })}
                  placeholder="(028) 3822 ..."
                  className="form-input"
                />
              </div>

              {/* Upload Ảnh Đại Diện (Cloudinary) */}
              <div className="form-media-upload-box">
                <label className="field-box-title">
                  <ImageIcon size={18} />
                  <span>Hình Ảnh Đại Diện Chính (Cloudinary)</span>
                </label>
                <div className="upload-flex-row">
                  <label className="file-upload-label-btn">
                    <Upload size={16} />
                    <span>{isUploading ? "Đang tải lên..." : "Tải ảnh lên Cloudinary"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleCloudinaryUpload(e.target.files?.[0], (url) => {
                          setEditingPlace({ ...editingPlace, coverImageUrl: url });
                        })
                      }
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="Hoặc dán URL ảnh (https://...)"
                    value={editingPlace.coverImageUrl || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, coverImageUrl: e.target.value })}
                    className="form-input flex-1"
                  />
                </div>
                {editingPlace.coverImageUrl && (
                  <div className="media-preview-box" style={{ marginTop: "0.5rem" }}>
                    <img src={editingPlace.coverImageUrl} alt="Preview" className="thumb-preview-img" style={{ maxHeight: 140, borderRadius: 8 }} />
                  </div>
                )}
              </div>

              {/* Quản lý Thư Viện Nhiều Ảnh (Multi-image Gallery Carousel) */}
              <div className="form-media-upload-box" style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: 8 }}>
                <label className="field-box-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  <Layers size={18} />
                  <span>Thư Viện Ảnh Carousel (Chạy tự động khi xem chi tiết)</span>
                </label>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  Thêm nhiều hình ảnh để người dùng xem carousel chuyển ảnh tự động khi di chuột qua.
                </p>

                <div className="upload-flex-row" style={{ marginBottom: "0.75rem" }}>
                  <label className="file-upload-label-btn">
                    <Upload size={16} />
                    <span>Tải ảnh thêm vào Carousel</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleCloudinaryUpload(e.target.files?.[0], (url) => {
                          handleAddGalleryImage(url);
                        })
                      }
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="Hoặc dán URL ảnh và bấm Thêm"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="form-input flex-1"
                  />
                  <button
                    type="button"
                    className="dash-btn secondary"
                    onClick={() => handleAddGalleryImage(newGalleryUrl)}
                  >
                    Thêm ảnh
                  </button>
                </div>

                {/* Danh sách ảnh Carousel hiện có */}
                {Array.isArray(editingPlace.gallery) && editingPlace.gallery.length > 0 && (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                    {editingPlace.gallery.map((imgUrl, idx) => (
                      <div key={idx} style={{ position: "relative", width: 90, height: 60, borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)" }}>
                        <img src={imgUrl} alt={`Gallery ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            background: "rgba(0,0,0,0.75)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                          title="Xóa ảnh này"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tóm tắt Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tóm tắt ngắn (Tiếng Việt)</label>
                  <textarea
                    rows={2}
                    value={editingPlace.summary?.vi || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, summary: { ...editingPlace.summary, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Short Summary (English)</label>
                  <textarea
                    rows={2}
                    value={editingPlace.summary?.en || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, summary: { ...editingPlace.summary, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Mô tả chi tiết Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Mô tả chi tiết (Tiếng Việt)</label>
                  <textarea
                    rows={3}
                    value={editingPlace.description?.vi || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, description: { ...editingPlace.description, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Detailed Description (English)</label>
                  <textarea
                    rows={3}
                    value={editingPlace.description?.en || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, description: { ...editingPlace.description, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Lịch sử Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Lịch sử & Ý nghĩa văn hóa (Tiếng Việt)</label>
                  <textarea
                    rows={3}
                    value={editingPlace.history?.vi || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, history: { ...editingPlace.history, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>History & Cultural Significance (English)</label>
                  <textarea
                    rows={3}
                    value={editingPlace.history?.en || ""}
                    onChange={(e) => setEditingPlace({ ...editingPlace, history: { ...editingPlace.history, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Thuyết minh Âm thanh Audio Guide (Song ngữ Việt & Anh) */}
              <div className="form-group" style={{ border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "var(--radius-md)", background: "var(--bg-card)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <Headphones size={20} style={{ color: "var(--primary)" }} />
                  <label style={{ fontWeight: 800, fontSize: "1rem", margin: 0 }}>
                    Thuyết Minh Âm Thanh Audio Guide (Song Ngữ Việt - Anh)
                  </label>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  Tải tệp âm thanh (.mp3, .wav, .m4a) lên Cloudinary hoặc dán liên kết URL file thuyết minh để du khách nghe trực tiếp trên bản đồ, chatbot và trang chi tiết.
                </p>

                <div className="form-grid-2">
                  {/* Bản Thuyết Minh Tiếng Việt */}
                  <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem", background: "var(--bg-alt)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                      <span style={{ background: "#059669", color: "#fff", padding: "2px 8px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>VI</span>
                      <strong style={{ fontSize: "0.92rem" }}>Bản Tiếng Việt</strong>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Tiêu đề thuyết minh (VI)</label>
                      <input
                        type="text"
                        placeholder="vd: Thuyết minh Dinh Độc Lập"
                        value={editingPlace.audioGuide?.vi?.title || ""}
                        onChange={(e) =>
                          setEditingPlace({
                            ...editingPlace,
                            audioGuide: {
                              ...editingPlace.audioGuide,
                              vi: {
                                ...(editingPlace.audioGuide?.vi || {}),
                                title: e.target.value
                              }
                            }
                          })
                        }
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Tệp âm thanh / URL Audio (VI)</label>
                      <div className="upload-flex-row">
                        <label className="file-upload-label-btn" style={{ padding: "0.5rem 0.85rem", fontSize: "0.8rem" }}>
                          <Upload size={15} />
                          <span>Tải file Audio (.mp3)</span>
                          <input
                            type="file"
                            accept="audio/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleCloudinaryUpload(e.target.files?.[0], (url) => {
                                setEditingPlace({
                                  ...editingPlace,
                                  audioGuide: {
                                    ...editingPlace.audioGuide,
                                    vi: {
                                      ...(editingPlace.audioGuide?.vi || {}),
                                      url: url
                                    }
                                  }
                                });
                              })
                            }
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Hoặc dán link audio (vd: /assets/audio/Attention.mp3 hoặc https://...)"
                          value={editingPlace.audioGuide?.vi?.url || ""}
                          onChange={(e) =>
                            setEditingPlace({
                              ...editingPlace,
                              audioGuide: {
                                ...editingPlace.audioGuide,
                                vi: {
                                  ...(editingPlace.audioGuide?.vi || {}),
                                  url: e.target.value
                                }
                              }
                            })
                          }
                          className="form-input flex-1"
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Thời lượng</label>
                        <input
                          type="text"
                          placeholder="vd: 3:45"
                          value={editingPlace.audioGuide?.vi?.duration || ""}
                          onChange={(e) =>
                            setEditingPlace({
                              ...editingPlace,
                              audioGuide: {
                                ...editingPlace.audioGuide,
                                vi: {
                                  ...(editingPlace.audioGuide?.vi || {}),
                                  duration: e.target.value
                                }
                              }
                            })
                          }
                          className="form-input"
                          style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }}
                        />
                      </div>
                      <button
                        type="button"
                        className="dash-btn secondary"
                        style={{ fontSize: "0.75rem", alignSelf: "flex-end", padding: "0.45rem 0.75rem" }}
                        onClick={() =>
                          setEditingPlace({
                            ...editingPlace,
                            audioGuide: {
                              ...editingPlace.audioGuide,
                              vi: {
                                ...(editingPlace.audioGuide?.vi || {}),
                                url: "/assets/audio/Attention.mp3",
                                duration: "3:45"
                              }
                            }
                          })
                        }
                      >
                        File mẫu
                      </button>
                    </div>

                    {/* Nghe thử Audio Tiếng Việt */}
                    {editingPlace.audioGuide?.vi?.url && (
                      <div style={{ marginTop: "0.75rem", padding: "0.6rem", background: "rgba(0,0,0,0.06)", borderRadius: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-main)" }}>Nghe thử bản Tiếng Việt:</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingPlace({
                                ...editingPlace,
                                audioGuide: {
                                  ...editingPlace.audioGuide,
                                  vi: {
                                    ...(editingPlace.audioGuide?.vi || {}),
                                    url: ""
                                  }
                                }
                              })
                            }
                            style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", cursor: "pointer" }}
                          >
                            Xóa file này
                          </button>
                        </div>
                        <audio
                          controls
                          src={normalizeAudioUrl(editingPlace.audioGuide.vi.url)}
                          style={{ width: "100%", height: "36px" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Bản Thuyết Minh Tiếng Anh */}
                  <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem", background: "var(--bg-alt)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                      <span style={{ background: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>EN</span>
                      <strong style={{ fontSize: "0.92rem" }}>English Audio Guide</strong>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Audio Title (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Independence Palace Audio Tour"
                        value={editingPlace.audioGuide?.en?.title || ""}
                        onChange={(e) =>
                          setEditingPlace({
                            ...editingPlace,
                            audioGuide: {
                              ...editingPlace.audioGuide,
                              en: {
                                ...(editingPlace.audioGuide?.en || {}),
                                title: e.target.value
                              }
                            }
                          })
                        }
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Audio File / URL (English)</label>
                      <div className="upload-flex-row">
                        <label className="file-upload-label-btn" style={{ padding: "0.5rem 0.85rem", fontSize: "0.8rem" }}>
                          <Upload size={15} />
                          <span>Upload English Audio</span>
                          <input
                            type="file"
                            accept="audio/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleCloudinaryUpload(e.target.files?.[0], (url) => {
                                setEditingPlace({
                                  ...editingPlace,
                                  audioGuide: {
                                    ...editingPlace.audioGuide,
                                    en: {
                                      ...(editingPlace.audioGuide?.en || {}),
                                      url: url
                                    }
                                  }
                                });
                              })
                            }
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Or paste audio URL (e.g. /assets/audio/Attention.mp3 or https://...)"
                          value={editingPlace.audioGuide?.en?.url || ""}
                          onChange={(e) =>
                            setEditingPlace({
                              ...editingPlace,
                              audioGuide: {
                                ...editingPlace.audioGuide,
                                en: {
                                  ...(editingPlace.audioGuide?.en || {}),
                                  url: e.target.value
                                }
                              }
                            })
                          }
                          className="form-input flex-1"
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 3:30"
                          value={editingPlace.audioGuide?.en?.duration || ""}
                          onChange={(e) =>
                            setEditingPlace({
                              ...editingPlace,
                              audioGuide: {
                                ...editingPlace.audioGuide,
                                en: {
                                  ...(editingPlace.audioGuide?.en || {}),
                                  duration: e.target.value
                                }
                              }
                            })
                          }
                          className="form-input"
                          style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }}
                        />
                      </div>
                      <button
                        type="button"
                        className="dash-btn secondary"
                        style={{ fontSize: "0.75rem", alignSelf: "flex-end", padding: "0.45rem 0.75rem" }}
                        onClick={() =>
                          setEditingPlace({
                            ...editingPlace,
                            audioGuide: {
                              ...editingPlace.audioGuide,
                              en: {
                                ...(editingPlace.audioGuide?.en || {}),
                                url: "/assets/audio/Attention.mp3",
                                duration: "3:30"
                              }
                            }
                          })
                        }
                      >
                        Use Sample
                      </button>
                    </div>

                    {/* Nghe thử Audio Tiếng Anh */}
                    {editingPlace.audioGuide?.en?.url && (
                      <div style={{ marginTop: "0.75rem", padding: "0.6rem", background: "rgba(0,0,0,0.06)", borderRadius: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-main)" }}>Preview English Audio:</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingPlace({
                                ...editingPlace,
                                audioGuide: {
                                  ...editingPlace.audioGuide,
                                  en: {
                                    ...(editingPlace.audioGuide?.en || {}),
                                    url: ""
                                  }
                                }
                              })
                            }
                            style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                        <audio
                          controls
                          src={normalizeAudioUrl(editingPlace.audioGuide.en.url)}
                          style={{ width: "100%", height: "36px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Liên kết Quán Ăn & Quán Nước */}
              <div className="form-group" style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: 8 }}>
                <label style={{ fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
                  🍜 Liên kết quán ăn / quán nước lân cận:
                </label>
                <div style={{ maxHeight: 150, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.5rem" }}>
                  {venues.map((v) => {
                    const isLinked = Array.isArray(v.placeIds) && v.placeIds.includes(editingPlace.id);
                    return (
                      <label key={v.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={isLinked}
                          onChange={async (e) => {
                            const currentPlaceIds = Array.isArray(v.placeIds) ? [...v.placeIds] : [];
                            const updatedPlaceIds = e.target.checked
                              ? Array.from(new Set([...currentPlaceIds, editingPlace.id]))
                              : currentPlaceIds.filter((pId) => pId !== editingPlace.id);
                            const updatedVenue = { ...v, placeIds: updatedPlaceIds };
                            await saveVenue(updatedVenue);
                            setVenues((prev) => prev.map((item) => (item.id === v.id ? updatedVenue : item)));
                          }}
                        />
                        <span>{v.name?.vi} ({v.type === "drink" ? "Cà phê" : "Quán ăn"})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox Xuất bản */}
              <div className="checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={editingPlace.published !== false}
                    onChange={(e) => setEditingPlace({ ...editingPlace, published: e.target.checked })}
                  />
                  <span>Xuất bản công khai lên bản đồ và chatbot</span>
                </label>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="dash-btn secondary" onClick={() => setPlaceModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="dash-btn primary" disabled={isUploading}>
                  {isUploading ? "Đang tải ảnh..." : "Lưu địa điểm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL CHỈNH SỬA QUÁN ĂN / NƯỚC (COORDINATES & PLACES LINK) ==================== */}
      {venueModalOpen && editingVenue && (
        <div className="admin-modal-backdrop" onClick={() => setVenueModalOpen(false)}>
          <div className="admin-modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingVenue.id ? "Chỉnh sửa quán ăn / cà phê" : "Thêm quán mới"}</h3>
              <button type="button" onClick={() => setVenueModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveVenue} className="modal-form">
              {/* Tên quán Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tên quán (Tiếng Việt) *</label>
                  <input
                    type="text"
                    required
                    value={editingVenue.name?.vi || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, name: { ...editingVenue.name, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Venue Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingVenue.name?.en || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, name: { ...editingVenue.name, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Loại hình & Phân loại món */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Loại hình</label>
                  <select
                    value={editingVenue.type || "restaurant"}
                    onChange={(e) => setEditingVenue({ ...editingVenue, type: e.target.value })}
                    className="form-input"
                  >
                    <option value="restaurant">Quán ăn (Restaurant)</option>
                    <option value="drink">Quán nước / Cà phê (Cafe & Drinks)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phân loại món</label>
                  <input
                    type="text"
                    value={editingVenue.category || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, category: e.target.value })}
                    placeholder="Món Việt, Cà phê vợt, Cơm tấm..."
                    className="form-input"
                  />
                </div>
              </div>

              {/* Tọa độ hiển thị trên Bản Đồ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Vĩ độ (Latitude) *</label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={editingVenue.coordinates?.lat || 10.7769}
                    onChange={(e) => setEditingVenue({ ...editingVenue, coordinates: { ...editingVenue.coordinates, lat: parseFloat(e.target.value) } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Kinh độ (Longitude) *</label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={editingVenue.coordinates?.lng || 106.6953}
                    onChange={(e) => setEditingVenue({ ...editingVenue, coordinates: { ...editingVenue.coordinates, lng: parseFloat(e.target.value) } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Địa chỉ Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Địa chỉ (Tiếng Việt) *</label>
                  <input
                    type="text"
                    required
                    value={editingVenue.address?.vi || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, address: { ...editingVenue.address, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Address (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingVenue.address?.en || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, address: { ...editingVenue.address, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Mô tả Song ngữ */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Mô tả ngắn (Tiếng Việt)</label>
                  <textarea
                    rows={2}
                    value={editingVenue.description?.vi || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, description: { ...editingVenue.description, vi: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Short Description (English)</label>
                  <textarea
                    rows={2}
                    value={editingVenue.description?.en || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, description: { ...editingVenue.description, en: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Upload Ảnh Quán (Cloudinary) */}
              <div className="form-media-upload-box">
                <label className="field-box-title">
                  <ImageIcon size={18} />
                  <span>Hình Ảnh Quán (Cloudinary)</span>
                </label>
                <div className="upload-flex-row">
                  <label className="file-upload-label-btn">
                    <Upload size={16} />
                    <span>Tải ảnh lên Cloudinary</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleCloudinaryUpload(e.target.files?.[0], (url) => {
                          setEditingVenue({ ...editingVenue, coverImageUrl: url });
                        })
                      }
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="Hoặc dán URL ảnh (https://...)"
                    value={editingVenue.coverImageUrl || ""}
                    onChange={(e) => setEditingVenue({ ...editingVenue, coverImageUrl: e.target.value })}
                    className="form-input flex-1"
                  />
                </div>
                {editingVenue.coverImageUrl && (
                  <div className="media-preview-box" style={{ marginTop: "0.5rem" }}>
                    <img src={editingVenue.coverImageUrl} alt="Venue preview" className="thumb-preview-img" style={{ maxHeight: 120, borderRadius: 8 }} />
                  </div>
                )}
              </div>

              {/* Liên kết Địa Danh Du Lịch */}
              <div className="form-group" style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: 8 }}>
                <label style={{ fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
                  📍 Liên kết với các địa điểm du lịch lân cận:
                </label>
                <div style={{ maxHeight: 160, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.5rem" }}>
                  {places.map((p) => {
                    const currentPlaceIds = Array.isArray(editingVenue.placeIds) ? editingVenue.placeIds : [];
                    const isChecked = currentPlaceIds.includes(p.id);

                    return (
                      <label key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? Array.from(new Set([...currentPlaceIds, p.id]))
                              : currentPlaceIds.filter((id) => id !== p.id);
                            setEditingVenue({ ...editingVenue, placeIds: updated });
                          }}
                        />
                        <span>{p.name?.vi} ({p.district})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="dash-btn secondary" onClick={() => setVenueModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="dash-btn primary" disabled={isUploading}>
                  {isUploading ? "Đang tải ảnh..." : "Lưu thông tin quán"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
