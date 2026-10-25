import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem("hcmc_tourism_lang");
      return saved === "en" ? "en" : "vi";
    } catch {
      return "vi";
    }
  });

  const setLang = (newLang) => {
    const valid = newLang === "en" ? "en" : "vi";
    setLangState(valid);
    try {
      localStorage.setItem("hcmc_tourism_lang", valid);
    } catch {
      // ignore storage error
    }
  };

  const toggleLang = () => {
    setLang(lang === "vi" ? "en" : "vi");
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations["vi"]?.[key] || key;
  };

  /**
   * Helper để lấy giá trị song ngữ { vi, en } từ đối tượng dữ liệu
   */
  const getLocalized = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj["vi"] || obj["en"] || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
