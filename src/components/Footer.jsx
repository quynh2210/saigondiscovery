import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, MapPin, Heart, Mail } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { formatDistrict } from "../utils/translations";

export default function Footer() {
  const { lang, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Col 1: Brand */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <MapPin size={22} className="footer-brand-icon" />
              <span className="footer-brand-name">Sài Gòn Discovery</span>
            </div>
            <p className="footer-desc">{t("footerDesc")}</p>
            <div className="footer-badges">
              <span className="badge-tag">{formatDistrict("Quận 1", lang)}</span>
              <span className="badge-tag">{formatDistrict("Quận 3", lang)}</span>
              <span className="badge-tag">TP. Hồ Chí Minh</span>
            </div>

            {/* Liên hệ tôi */}
            <div className="footer-contact-row" style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>
              <Mail size={16} style={{ color: "var(--primary)" }} />
              <span style={{ color: "var(--text-muted)" }}>{lang === "vi" ? "Liên hệ tôi :" : "Contact me:"}</span>
              <a href="mailto:mianaquynh@gmail.com" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                mianaquynh@gmail.com
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-heading">{t("navHome")}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t("navHome")}</Link></li>
              <li><Link to="/map">{t("navMap")}</Link></li>
              <li><Link to="/about">{t("navAbout")}</Link></li>
              <li><Link to="/admin">{t("navAdmin")}</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Open Data Attribution */}
          <div className="footer-col attribution-col">
            <h4 className="footer-heading">Bản Quyền & Ghi Công</h4>
            <p className="osm-attribution-text">
              {t("osmAttribution")}{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="osm-link"
              >
                OpenStreetMap Contributors
              </a>
            </p>
            <p className="disclaimer-text">
              Dữ liệu du lịch, lịch sử và hình ảnh phục vụ nghiên cứu và học tập. Các thông tin thời gian thực được liên kết tới Google Maps.
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} Sài Gòn Discovery. Xây dựng với <Heart size={14} className="heart-icon" /> cho du khách yêu TP.HCM.
          </p>
          <button type="button" className="back-to-top-btn" onClick={scrollToTop}>
            <span>{t("backToTop")}</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
