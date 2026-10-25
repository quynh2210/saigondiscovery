import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Ticket, 
  Phone, 
  Navigation, 
  Bus, 
  QrCode, 
  Share2, 
  CheckCircle2, 
  Info, 
  BookOpen,
  Award,
  GraduationCap,
  Star
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { formatDistrict } from "../utils/translations";
import { getDirectionsUrl, getTransitUrl, getNearbyBusStopsUrl } from "../utils/googleMapsLinks";
import { getVenuesByPlaceId } from "../services/venueService";
import AudioGuidePlayer from "./AudioGuidePlayer";
import QRCodeModal from "./QRCodeModal";
import FoodRecommendations from "./FoodRecommendations";
import ImageCarousel from "./ImageCarousel";
import PlaceReviews from "./PlaceReviews";

export default function PlaceDetail({ place, onBack }) {
  const { lang, t } = useLanguage();
  const [showQrModal, setShowQrModal] = useState(false);
  const [linkedVenues, setLinkedVenues] = useState([]);
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'history' | 'food'

  const name = place.name?.[lang] || place.name?.vi || place.name?.en || "Địa điểm";
  const address = place.address?.[lang] || place.address?.vi || place.address?.en;
  const summary = place.summary?.[lang] || place.summary?.vi || place.summary?.en;
  const description = place.description?.[lang] || place.description?.vi || place.description?.en;
  const history = place.history?.[lang] || place.history?.vi || place.history?.en;
  const openingHours = place.openingHours?.[lang] || place.openingHours?.vi || place.openingHours?.en;
  const ticketPrice = place.ticketPrice?.[lang] || place.ticketPrice?.vi || place.ticketPrice?.en;
  const highlights = place.highlights?.[lang] || place.highlights?.vi || place.highlights?.en;

  const allImages = Array.from(
    new Set([place.coverImageUrl, ...(Array.isArray(place.gallery) ? place.gallery : [])])
  ).filter((url) => typeof url === "string" && url.trim().length > 0);

  useEffect(() => {
    if (place?.id) {
      getVenuesByPlaceId(place.id).then((venues) => {
        setLinkedVenues(venues);
      });

      // Đọc query param ?tab=history hoặc ?tab=food hoặc ?tab=reviews từ URL
      const hash = window.location.hash || "";
      const qIndex = hash.indexOf("?");
      if (qIndex !== -1) {
        const params = new URLSearchParams(hash.substring(qIndex));
        const requestedTab = params.get("tab");
        if (requestedTab && ["info", "history", "food", "reviews"].includes(requestedTab)) {
          setActiveTab(requestedTab);
        }
      }
    }
  }, [place?.id]);

  const directionsUrl = getDirectionsUrl(address || name);
  const busRoutesUrl = getTransitUrl(address || name);
  const nearbyStopsUrl = getNearbyBusStopsUrl(name);

  return (
    <div className="place-detail-container">
      {/* Top Bar with Back Button */}
      <div className="detail-top-nav">
        <button type="button" className="detail-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>{t("backToList")}</span>
        </button>

        <div className="detail-top-actions">
          {place.qrGuide && (
            <button
              type="button"
              className="action-icon-btn"
              onClick={() => setShowQrModal(true)}
              title={t("qrTitle")}
            >
              <QrCode size={18} />
              <span>QR Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Cover Image & Carousel (auto-slide on hover, unblurred zoom) */}
      {allImages.length > 0 && (
        <div className="detail-hero-media" style={{ position: "relative" }}>
          <ImageCarousel
            images={allImages}
            alt={name}
            aspectRatio="16/9"
            autoPlayOnHover={true}
            interval={3500}
            showControls={true}
            showDots={true}
            showCounter={true}
          />
          <div className="detail-hero-gradient"></div>
          <div className="detail-hero-badges" style={{ zIndex: 6, pointerEvents: "none" }}>
            <span className="detail-district-badge">{formatDistrict(place.district, lang)}</span>
            <span className="detail-cat-badge">{t(`cat${place.category?.charAt(0).toUpperCase() + place.category?.slice(1)}`) || place.category}</span>
          </div>
        </div>
      )}

      {/* Content Header */}
      <div className="detail-header-block">
        <h2 className="detail-place-name">{name}</h2>
        
        {(place.heritageRank || place.yearEstablished) && (
          <div className="heritage-badge-pill-row">
            <span className="heritage-pill">
              <Award size={14} className="award-icon" />
              <span>
                {place.heritageRank?.[lang] || place.heritageRank?.vi || (lang === "vi" ? "Di tích Kiến trúc Nghệ thuật" : "Architectural Heritage Site")}
                {place.yearEstablished ? ` • ${lang === "vi" ? "Thành lập năm" : "Est."} ${place.yearEstablished}` : ""}
              </span>
            </span>
          </div>
        )}

        <p className="detail-address-line">
          <MapPin size={16} className="pin-icon" />
          <span>{address || t("updating")}</span>
        </p>

        {/* Google Maps Actions Bar */}
        <div className="google-maps-actions-bar">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="maps-action-btn primary"
            title={t("getDirections")}
          >
            <Navigation size={16} />
            <span>{t("getDirections")}</span>
          </a>

          <a
            href={busRoutesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="maps-action-btn secondary"
            title={t("findBusRoutes")}
          >
            <Bus size={16} />
            <span>{t("findBusRoutes")}</span>
          </a>

          <a
            href={nearbyStopsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="maps-action-btn outline"
            title={t("findNearbyBusStops")}
          >
            <MapPin size={16} />
            <span>{t("findNearbyBusStops")}</span>
          </a>
        </div>
      </div>

      {/* Practical Visit Info Row */}
      <div className="practical-info-grid">
        <div className="info-card">
          <Clock size={18} className="info-icon" />
          <div className="info-texts">
            <span className="info-label">{t("openingHours")}</span>
            <span className="info-val">{openingHours || t("updating")}</span>
          </div>
        </div>

        <div className="info-card">
          <Ticket size={18} className="info-icon" />
          <div className="info-texts">
            <span className="info-label">{t("ticketPrice")}</span>
            <span className="info-val">{ticketPrice || t("updating")}</span>
          </div>
        </div>

        {place.phone && (
          <div className="info-card">
            <Phone size={18} className="info-icon" />
            <div className="info-texts">
              <span className="info-label">{t("phone")}</span>
              <a href={`tel:${place.phone}`} className="info-val phone-link">
                {place.phone}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Audio Guide Section */}
      <div className="detail-section audio-section">
        <AudioGuidePlayer audioData={place.audioGuide} placeName={name} />
      </div>

      {/* Tabs Switcher for Detail Sections */}
      <div className="detail-nav-tabs">
        <button
          type="button"
          className={`detail-tab ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <Info size={16} />
          <span>{lang === "vi" ? "Tổng quan & Điểm nổi bật" : "Overview & Highlights"}</span>
        </button>
        <button
          type="button"
          className={`detail-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <BookOpen size={16} />
          <span>{t("historyTitle")}</span>
        </button>
        <button
          type="button"
          className={`detail-tab ${activeTab === "food" ? "active" : ""}`}
          onClick={() => setActiveTab("food")}
        >
          <span>🍜 {t("foodTitle")} ({linkedVenues.length})</span>
        </button>
        <button
          type="button"
          className={`detail-tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <Star size={16} />
          <span>⭐ {lang === "vi" ? "Đánh giá" : "Reviews"}</span>
        </button>
      </div>

      {/* Tab 1: Overview & Highlights */}
      {activeTab === "info" && (
        <div className="detail-tab-pane">
          {summary && <p className="detail-summary-lead">{summary}</p>}
          {description && <p className="detail-desc-body">{description}</p>}

          {highlights && Array.isArray(highlights) && highlights.length > 0 && (
            <div className="detail-highlights-box">
              <h4 className="box-title">{t("highlightsTitle")}</h4>
              <ul className="highlights-list">
                {highlights.map((item, idx) => (
                  <li key={idx} className="highlight-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: History & Heritage */}
      {activeTab === "history" && (
        <div className="detail-tab-pane">
          <div className="history-text-card">
            <h4 className="box-title">{t("historyTitle")}</h4>
            <p className="history-paragraphs">{history || t("updating")}</p>
          </div>

          {/* Prominent Alumni & Scholars */}
          {place.alumni && Array.isArray(place.alumni) && place.alumni.length > 0 && (
            <div className="detail-alumni-box">
              <h4 className="box-title">
                <GraduationCap size={20} />
                <span>{lang === "vi" ? "Danh nhân & Cựu học sinh tiêu biểu" : "Prominent Alumni & Scholars"}</span>
              </h4>
              <div className="alumni-cards-grid">
                {place.alumni.map((alum, idx) => (
                  <div key={idx} className="alumni-card">
                    <strong className="alumni-name">{alum.name}</strong>
                    <span className="alumni-role">{alum.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Food & Drinks */}
      {activeTab === "food" && (
        <div className="detail-tab-pane">
          <FoodRecommendations venues={linkedVenues} referencePlaceName={name} />
        </div>
      )}

      {/* Tab 4: 5-Star Reviews & Photos */}
      {activeTab === "reviews" && (
        <div className="detail-tab-pane">
          <PlaceReviews placeId={place.id} placeName={name} />
        </div>
      )}

      {/* QR Code Modal Popup */}
      {showQrModal && (
        <QRCodeModal
          qrData={place.qrGuide}
          placeName={name}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}
