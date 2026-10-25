import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getPlaceById } from "../services/placeService";
import PlaceDetail from "../components/PlaceDetail";
import ChatbotWidget from "../components/ChatbotWidget";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPlaceById(id).then((data) => {
        setPlace(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleBack = () => {
    navigate("/map");
  };

  if (loading) {
    return (
      <div className="detail-loading-screen">
        <Loader2 size={36} className="spinning-loader" />
        <p>{lang === "vi" ? "Đang tải thông tin địa điểm..." : "Loading place details..."}</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="section-container not-found-screen">
        <h2>{lang === "vi" ? "Không tìm thấy địa điểm" : "Place Not Found"}</h2>
        <p>{lang === "vi" ? "Địa điểm này không tồn tại hoặc đã bị ẩn." : "This place does not exist or has been unpublished."}</p>
        <button type="button" className="hero-btn primary-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>{t("backToList")}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="place-detail-standalone-page section-container">
      <PlaceDetail place={place} onBack={handleBack} />
      <ChatbotWidget currentWebPlace={place} />
    </div>
  );
}
