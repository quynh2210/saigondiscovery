import React from "react";
import { useLanguage } from "../hooks/useLanguage";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="language-toggle" role="group" aria-label="Language selection">
      <button
        type="button"
        className={`lang-btn ${lang === "vi" ? "active" : ""}`}
        onClick={() => setLang("vi")}
        title="Tiếng Việt"
      >
        <span className="lang-flag">🇻🇳</span>
        <span className="lang-code">VI</span>
      </button>
      <button
        type="button"
        className={`lang-btn ${lang === "en" ? "active" : ""}`}
        onClick={() => setLang("en")}
        title="English"
      >
        <span className="lang-flag">🇬🇧</span>
        <span className="lang-code">EN</span>
      </button>
    </div>
  );
}
