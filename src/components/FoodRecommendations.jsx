import React, { useState } from "react";
import { Utensils, Coffee, Layers } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import VenueCard from "./VenueCard";

export default function FoodRecommendations({ venues = [], referencePlaceName = "" }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");

  const filteredVenues = venues.filter((v) => {
    if (activeTab === "all") return true;
    return v.type === activeTab;
  });

  return (
    <div className="food-recommendations-wrapper">
      <div className="food-tabs-bar">
        <button
          type="button"
          className={`food-tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <Layers size={16} />
          <span>{t("tabAllVenues")} ({venues.length})</span>
        </button>
        <button
          type="button"
          className={`food-tab-btn ${activeTab === "restaurant" ? "active" : ""}`}
          onClick={() => setActiveTab("restaurant")}
        >
          <Utensils size={16} />
          <span>{t("tabRestaurants")} ({venues.filter((v) => v.type === "restaurant").length})</span>
        </button>
        <button
          type="button"
          className={`food-tab-btn ${activeTab === "drink" ? "active" : ""}`}
          onClick={() => setActiveTab("drink")}
        >
          <Coffee size={16} />
          <span>{t("tabCafes")} ({venues.filter((v) => v.type === "drink").length})</span>
        </button>
      </div>

      {filteredVenues.length === 0 ? (
        <div className="empty-food-state">
          <p>{t("noVenuesFound")}</p>
        </div>
      ) : (
        <div className="venues-grid">
          {filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              referencePlaceName={referencePlaceName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
