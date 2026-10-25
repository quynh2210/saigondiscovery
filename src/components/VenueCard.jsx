import React from "react";
import { MapPin, Navigation, ExternalLink, Utensils, Coffee } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getSearchUrl, getVenueDirectionsUrl } from "../utils/googleMapsLinks";

export default function VenueCard({ venue, referencePlaceName = "" }) {
  const { lang, t } = useLanguage();

  if (!venue) return null;

  const name = venue.name?.[lang] || venue.name?.vi || venue.name?.en;
  const address = venue.address?.[lang] || venue.address?.vi || venue.address?.en;
  const description = venue.description?.[lang] || venue.description?.vi || venue.description?.en;
  const isRestaurant = venue.type === "restaurant";

  const mapsUrl = venue.googleMapsUrl || getSearchUrl(`${name} ${address}`);
  const directionsUrl = referencePlaceName
    ? getVenueDirectionsUrl(referencePlaceName, address || name)
    : getSearchUrl(`${name} ${address}`);

  return (
    <div className="venue-card">
      {venue.coverImageUrl && (
        <div className="venue-img-wrap">
          <img src={venue.coverImageUrl} alt={name} className="venue-img" loading="lazy" />
          <span className={`venue-type-tag ${isRestaurant ? "tag-food" : "tag-drink"}`}>
            {isRestaurant ? <Utensils size={14} /> : <Coffee size={14} />}
            <span>{isRestaurant ? t("tabRestaurants") : t("tabCafes")}</span>
          </span>
        </div>
      )}

      <div className="venue-content">
        <h4 className="venue-name">{name}</h4>
        {address && (
          <p className="venue-address">
            <MapPin size={14} className="pin-icon" />
            <span>{address}</span>
          </p>
        )}
        {description && <p className="venue-desc">{description}</p>}

        <div className="venue-actions-row">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-btn map-btn"
            title={t("viewOnMap")}
          >
            <ExternalLink size={14} />
            <span>{t("viewOnMap")}</span>
          </a>

          {referencePlaceName && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-btn dir-btn"
              title={`${t("directionsFromPlace")} ${referencePlaceName}`}
            >
              <Navigation size={14} />
              <span>{t("directionsFromPlace")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
