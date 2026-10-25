import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MapPin, Compass, Info, ShieldCheck, Menu, X } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import BackgroundMusic from "./BackgroundMusic";

export default function Navbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="site-brand" onClick={closeMenu}>
          <div className="brand-icon-wrap">
            <MapPin size={24} className="brand-pin-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">SÀI GÒN DISCOVERY</span>
            <span className="brand-subtitle">{t("tagline")}</span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Food removed per request) */}
        <nav className="desktop-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Compass size={18} />
            <span>{t("navHome")}</span>
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <MapPin size={18} />
            <span>{t("navMap")}</span>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Info size={18} />
            <span>{t("navAbout")}</span>
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link admin-nav-link ${isActive ? "active" : ""}`}>
            <ShieldCheck size={18} />
            <span>{t("navAdmin")}</span>
          </NavLink>
        </nav>

        {/* Right Tools (Music + Theme Toggle + Language + Mobile Toggle) */}
        <div className="header-actions">
          <BackgroundMusic />
          <ThemeToggle />
          <LanguageToggle />

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-list">
            <NavLink to="/" end className="mobile-nav-item" onClick={closeMenu}>
              <Compass size={20} />
              <span>{t("navHome")}</span>
            </NavLink>
            <NavLink to="/map" className="mobile-nav-item" onClick={closeMenu}>
              <MapPin size={20} />
              <span>{t("navMap")}</span>
            </NavLink>
            <NavLink to="/about" className="mobile-nav-item" onClick={closeMenu}>
              <Info size={20} />
              <span>{t("navAbout")}</span>
            </NavLink>
            <NavLink to="/admin" className="mobile-nav-item admin-item" onClick={closeMenu}>
              <ShieldCheck size={20} />
              <span>{t("navAdmin")}</span>
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
