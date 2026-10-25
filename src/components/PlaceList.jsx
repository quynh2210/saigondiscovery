import React, { useState, useMemo } from "react";
import { Search, MapPin, Filter, X } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { formatDistrict } from "../utils/translations";
import { removeVietnameseTones } from "../chatbot/chatbotIntents";
import ImageCarousel from "./ImageCarousel";

export default function PlaceList({ places = [], selectedPlace, onSelectPlace, onOpenDetail }) {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // 1. Lọc theo quận
      if (selectedDistrict !== "all" && place.district !== selectedDistrict) {
        return false;
      }

      // 2. Lọc theo danh mục
      if (selectedCategory !== "all" && place.category !== selectedCategory) {
        return false;
      }

      // 3. Lọc theo tìm kiếm từ khóa
      if (searchQuery.trim()) {
        const queryNorm = removeVietnameseTones(searchQuery);
        const nameViNorm = removeVietnameseTones(place.name?.vi || "");
        const nameEnNorm = removeVietnameseTones(place.name?.en || "");
        const addrViNorm = removeVietnameseTones(place.address?.vi || "");

        const matches =
          nameViNorm.includes(queryNorm) ||
          nameEnNorm.includes(queryNorm) ||
          addrViNorm.includes(queryNorm);

        if (!matches) return false;
      }

      return true;
    });
  }, [places, searchQuery, selectedDistrict, selectedCategory]);

  return (
    <div className="place-list-panel">
      {/* Search Bar */}
      <div className="place-search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="search-input"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* District Filter Pills */}
      <div className="filter-group district-filters">
        <button
          type="button"
          className={`filter-pill ${selectedDistrict === "all" ? "active" : ""}`}
          onClick={() => setSelectedDistrict("all")}
        >
          {t("filterAll")}
        </button>
        <button
          type="button"
          className={`filter-pill ${selectedDistrict === "Quận 1" ? "active" : ""}`}
          onClick={() => setSelectedDistrict("Quận 1")}
        >
          {t("filterDistrict1")}
        </button>
        <button
          type="button"
          className={`filter-pill ${selectedDistrict === "Quận 3" ? "active" : ""}`}
          onClick={() => setSelectedDistrict("Quận 3")}
        >
          {t("filterDistrict3")}
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="filter-group category-filters">
        <button
          type="button"
          className={`filter-tag ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          {t("filterAll")}
        </button>
        <button
          type="button"
          className={`filter-tag ${selectedCategory === "historical" ? "active" : ""}`}
          onClick={() => setSelectedCategory("historical")}
        >
          {t("catHistorical")}
        </button>
        <button
          type="button"
          className={`filter-tag ${selectedCategory === "architecture" ? "active" : ""}`}
          onClick={() => setSelectedCategory("architecture")}
        >
          {t("catArchitecture")}
        </button>
        <button
          type="button"
          className={`filter-tag ${selectedCategory === "culture" ? "active" : ""}`}
          onClick={() => setSelectedCategory("culture")}
        >
          {t("catCulture")}
        </button>
        <button
          type="button"
          className={`filter-tag ${selectedCategory === "spiritual" ? "active" : ""}`}
          onClick={() => setSelectedCategory("spiritual")}
        >
          {t("catSpiritual")}
        </button>
        <button
          type="button"
          className={`filter-tag ${selectedCategory === "other" ? "active" : ""}`}
          onClick={() => setSelectedCategory("other")}
        >
          {t("catOther")}
        </button>
      </div>

      {/* Results Count Header */}
      <div className="list-meta-header">
        <span className="results-count">
          {filteredPlaces.length} {t("placesCount")}
        </span>
      </div>

      {/* Cards List */}
      <div className="place-cards-scroll">
        {filteredPlaces.length === 0 ? (
          <div className="empty-search-state">
            <p>{t("noPlacesFound")}</p>
          </div>
        ) : (
          filteredPlaces.map((place) => {
            const isSelected = selectedPlace && selectedPlace.id === place.id;
            const name = place.name?.[lang] || place.name?.vi || place.name?.en;
            const address = place.address?.[lang] || place.address?.vi || place.address?.en;

            return (
              <div
                key={place.id}
                className={`place-list-card ${isSelected ? "selected-card" : ""}`}
                onClick={() => onSelectPlace(place)}
              >
                {place.coverImageUrl && (
                  <div className="card-thumb-wrap" style={{ position: "relative" }}>
                    <ImageCarousel
                      images={[place.coverImageUrl, ...(place.gallery || [])].filter(Boolean)}
                      alt={name}
                      aspectRatio="16/10"
                      autoPlayOnHover={true}
                      interval={1800}
                      showControls={false}
                      showCounter={false}
                      showDots={false}
                    />
                    <span className="card-district-badge" style={{ zIndex: 6, pointerEvents: "none" }}>
                      {formatDistrict(place.district, lang)}
                    </span>
                  </div>
                )}
                <div className="card-content">
                  <h4 className="card-title">{name}</h4>
                  <p className="card-address">
                    <MapPin size={14} className="pin-icon" />
                    <span>{address}</span>
                  </p>
                  <div className="card-footer-actions">
                    <button
                      type="button"
                      className="card-detail-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDetail) onOpenDetail(place);
                      }}
                    >
                      {t("viewDetails")} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
