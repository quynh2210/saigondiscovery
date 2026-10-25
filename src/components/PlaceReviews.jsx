import React, { useState, useEffect } from "react";
import { 
  Star, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Send, 
  LogIn, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  X 
} from "lucide-react";
import { getReviewsByPlaceId, addReview, deleteReview } from "../services/reviewService";
import { uploadImageToCloudinary } from "../services/uploadService";
import { subscribeToAuthChanges, logoutUser } from "../services/authService";
import { useLanguage } from "../hooks/useLanguage";
import AuthModal from "./AuthModal";

export default function PlaceReviews({ placeId, placeName }) {
  const { lang } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Preview Image Modal state
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const loadReviews = async () => {
    if (!placeId) return;
    setLoading(true);
    try {
      const data = await getReviewsByPlaceId(placeId);
      setReviews(data);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [placeId]);

  // Upload ảnh đánh giá lên Cloudinary
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage("");
    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      setErrorMessage(err.message || "Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  // Gửi bài đánh giá
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await addReview({
        placeId,
        rating,
        caption,
        imageUrl,
        user: currentUser
      });

      setSuccessMessage(
        lang === "vi"
          ? "Cảm ơn bạn đã gửi đánh giá cho địa điểm này!"
          : "Thank you for sharing your review!"
      );
      setCaption("");
      setImageUrl("");
      setRating(5);
      await loadReviews();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage(err.message || "Có lỗi khi gửi bài đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa bình luận
  const handleDelete = async (reviewId) => {
    if (!window.confirm(lang === "vi" ? "Bạn có chắc muốn xóa đánh giá này?" : "Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert("Lỗi khi xóa đánh giá: " + err.message);
    }
  };

  // Tính điểm trung bình
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="place-reviews-section">
      <div className="reviews-header-block">
        <div className="reviews-summary-flex">
          <div>
            <h3 className="reviews-title">
              {lang === "vi" ? "Đánh Giá & Nhận Xét" : "Visitor Reviews & Ratings"}
            </h3>
            <p className="reviews-subtitle">
              {placeName
                ? lang === "vi"
                  ? `Chia sẻ trải nghiệm của bạn tại ${placeName}`
                  : `Share your experience visiting ${placeName}`
                : ""}
            </p>
          </div>

          {averageRating && (
            <div className="reviews-rating-score-box">
              <div className="score-number-row">
                <span className="big-score">{averageRating}</span>
                <span className="max-score">/ 5</span>
              </div>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(Number(averageRating))
                        ? "star-icon filled"
                        : "star-icon empty"
                    }
                  />
                ))}
              </div>
              <span className="reviews-count-label">
                {reviews.length} {lang === "vi" ? "đánh giá" : "reviews"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Review Form or Login Prompt */}
      <div className="review-composer-card">
        {currentUser ? (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="composer-user-bar">
              <div className="composer-user-avatar">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className="composer-user-info">
                <strong>{currentUser.displayName || currentUser.email}</strong>
                <span className="composer-status-pill">
                  {lang === "vi" ? "Đang viết đánh giá" : "Reviewing"}
                </span>
              </div>
              <button
                type="button"
                className="user-logout-mini-btn"
                onClick={() => logoutUser()}
                title="Đăng xuất"
              >
                {lang === "vi" ? "Đổi tài khoản" : "Switch user"}
              </button>
            </div>

            {/* Interactive 5-Star Rating Selector */}
            <div className="rating-select-group">
              <label className="rating-label">
                {lang === "vi" ? "Đánh giá của bạn:" : "Your Rating:"}
              </label>
              <div className="star-picker-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-btn"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`${star} sao`}
                  >
                    <Star
                      size={26}
                      className={
                        star <= (hoverRating || rating)
                          ? "star-icon interactive filled"
                          : "star-icon interactive empty"
                      }
                    />
                  </button>
                ))}
                <span className="rating-text-hint">
                  {rating === 5 && (lang === "vi" ? "Tuyệt vời! 🌟" : "Excellent! 🌟")}
                  {rating === 4 && (lang === "vi" ? "Rất tốt 👍" : "Very Good 👍")}
                  {rating === 3 && (lang === "vi" ? "Bình thường" : "Average")}
                  {rating === 2 && (lang === "vi" ? "Chưa hài lòng" : "Poor")}
                  {rating === 1 && (lang === "vi" ? "Thất vọng" : "Terrible")}
                </span>
              </div>
            </div>

            {/* Optional Caption Textarea */}
            <div className="form-group">
              <label>
                {lang === "vi" ? "Lời nhận xét (không bắt buộc):" : "Your Caption / Comment (optional):"}
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={
                  lang === "vi"
                    ? "Cảm nhận về cảnh quan, không gian, trải nghiệm tham quan..."
                    : "Share what you loved about this place, tips for future visitors..."
                }
                className="form-input"
              />
            </div>

            {/* Photo Upload via Cloudinary */}
            <div className="review-photo-upload-row">
              <label className="review-upload-btn">
                {isUploading ? (
                  <Loader2 size={16} className="spinning-loader" />
                ) : (
                  <Upload size={16} />
                )}
                <span>
                  {isUploading
                    ? lang === "vi"
                      ? "Đang tải ảnh lên Cloudinary..."
                      : "Uploading image..."
                    : lang === "vi"
                    ? "Đăng kèm hình ảnh"
                    : "Attach Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  style={{ display: "none" }}
                  onChange={handleImageFileChange}
                />
              </label>

              {imageUrl && (
                <div className="review-thumb-preview">
                  <img src={imageUrl} alt="Attached preview" />
                  <button
                    type="button"
                    className="remove-thumb-btn"
                    onClick={() => setImageUrl("")}
                    title="Xóa ảnh"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="review-alert error">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="review-alert success">
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="review-submit-bar">
              <button
                type="submit"
                className="dash-btn primary"
                disabled={isSubmitting || isUploading}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="spinning-loader" />
                ) : (
                  <Send size={16} />
                )}
                <span>{lang === "vi" ? "Đăng đánh giá" : "Post Review"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="login-prompt-box">
            <div className="login-prompt-icon">
              <Star size={28} className="star-highlight-icon" />
            </div>
            <h4>
              {lang === "vi"
                ? "Đăng nhập để chia sẻ đánh giá của bạn"
                : "Sign in to share your review"}
            </h4>
            <p>
              {lang === "vi"
                ? "Bạn có thể chấm điểm 5 sao, chia sẻ hình ảnh đẹp và cảm nhận về địa điểm này cho du khách khắp nơi."
                : "Rate this landmark, share memorable photos, and help fellow travelers discover Ho Chi Minh City."}
            </p>
            <button
              type="button"
              className="dash-btn primary login-action-btn"
              onClick={() => setShowAuthModal(true)}
            >
              <LogIn size={16} />
              <span>
                {lang === "vi"
                  ? "Đăng nhập bằng Google / Email"
                  : "Sign In with Google / Email"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="reviews-list-container">
        {loading ? (
          <div className="reviews-loading">
            <Loader2 size={24} className="spinning-loader" />
            <span>{lang === "vi" ? "Đang tải đánh giá..." : "Loading reviews..."}</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty-state">
            <p>
              {lang === "vi"
                ? "Chưa có đánh giá nào cho địa điểm này. Hãy là người đầu tiên chia sẻ cảm nhận!"
                : "No reviews yet for this landmark. Be the first to share your experience!"}
            </p>
          </div>
        ) : (
          reviews.map((rev) => {
            const isOwner = currentUser && currentUser.uid === rev.userId;
            const formattedDate = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              : "";

            return (
              <div key={rev.id} className="review-card-item">
                <div className="review-card-header">
                  <div className="review-user-block">
                    {rev.userPhotoURL ? (
                      <img
                        src={rev.userPhotoURL}
                        alt={rev.userDisplayName}
                        className="review-user-avatar-img"
                      />
                    ) : (
                      <div className="review-user-avatar-placeholder">
                        {rev.userDisplayName?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <h4 className="review-user-name">{rev.userDisplayName}</h4>
                      <span className="review-date-text">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="review-stars-badge">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= (Number(rev.rating) || 5)
                            ? "star-icon filled"
                            : "star-icon empty"
                        }
                      />
                    ))}
                  </div>
                </div>

                {rev.caption && <p className="review-caption-text">{rev.caption}</p>}

                {rev.imageUrl && (
                  <div className="review-media-thumbnail">
                    <img
                      src={rev.imageUrl}
                      alt="Review snapshot"
                      onClick={() => setPreviewImage(rev.imageUrl)}
                      className="review-attached-img"
                    />
                  </div>
                )}

                {isOwner && (
                  <div className="review-card-actions">
                    <button
                      type="button"
                      className="review-delete-btn"
                      onClick={() => handleDelete(rev.id)}
                    >
                      <Trash2 size={13} />
                      <span>{lang === "vi" ? "Xóa đánh giá" : "Delete"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Image Preview Lightbox Modal */}
      {previewImage && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewImage(null)} style={{ zIndex: 1200 }}>
          <div className="image-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setPreviewImage(null)}
            >
              <X size={24} />
            </button>
            <img src={previewImage} alt="Full preview" className="lightbox-full-img" />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}
