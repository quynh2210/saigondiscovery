import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Map, ArrowRight, Compass } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { formatDistrict } from "../utils/translations";
import { getPublishedPlaces } from "../services/placeService";
import CityHero from "../components/CityHero";
import CityIntroduction from "../components/CityIntroduction";
import ChatbotWidget from "../components/ChatbotWidget";
import ImageCarousel from "../components/ImageCarousel";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    getPublishedPlaces().then((data) => {
      setPlaces(data.slice(0, 12)); // Hiển thị đầy đủ 12 địa danh
    });
  }, []);

  const handleExploreClick = () => {
    navigate("/map");
  };

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <CityHero onExploreClick={handleExploreClick} />

      {/* Featured Places Showcase */}
      <section className="featured-places-section">
        <div className="section-container">
          <div className="section-header-flex">
            <div>
              <span className="sub-badge">
                <Compass size={16} />
                <span>{lang === "vi" ? "Địa Danh Nổi Bật" : "Top Attractions"}</span>
              </span>
              <h2 className="section-title">
                {lang === "vi" ? "Điểm Đến Không Thể Bỏ Qua" : "Must-Visit Landmarks"}
              </h2>
            </div>
            <Link to="/map" className="view-all-link">
              <span>{lang === "vi" ? "Xem tất cả trên bản đồ" : "Explore all on map"}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="featured-grid">
            {places.map((place) => {
              const name = place.name?.[lang] || place.name?.vi || place.name?.en;
              const summary = place.summary?.[lang] || place.summary?.vi || place.summary?.en;

              return (
                <div 
                  key={place.id} 
                  className="featured-card"
                  onClick={() => navigate(`/places/${place.id}`)}
                  style={{ cursor: "pointer" }}
                  title={lang === "vi" ? `Xem chi tiết ${name}` : `View details of ${name}`}
                >
                  <div className="featured-card-media" style={{ position: "relative" }}>
                    <ImageCarousel
                      images={[place.coverImageUrl, ...(Array.isArray(place.gallery) ? place.gallery : [])].filter(Boolean)}
                      alt={name}
                      aspectRatio="16/10"
                      autoPlayOnHover={true}
                      interval={2400}
                      showControls={false}
                      showCounter={false}
                      showDots={true}
                    />
                    <span className="featured-district-tag" style={{ zIndex: 6, pointerEvents: "none" }}>
                      {formatDistrict(place.district, lang)}
                    </span>
                  </div>

                  <div className="featured-card-body">
                    <h3 className="featured-card-title">{name}</h3>
                    <p className="featured-card-desc">{summary}</p>

                    <div className="featured-card-footer">
                      <Link
                        to={`/map?placeId=${place.id}`}
                        className="featured-map-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Map size={16} />
                        <span>{t("showOnMapBtn")}</span>
                      </Link>
                      <Link
                        to={`/places/${place.id}`}
                        className="featured-detail-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{t("viewDetails")}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* City History & Culture Section */}
      <CityIntroduction />

      {/* Chatbot hướng dẫn du lịch nổi góc màn hình */}
      <ChatbotWidget />
    </div>
  );
}
