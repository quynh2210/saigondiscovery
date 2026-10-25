import React from "react";
import { Landmark, Clock, BookOpen, Sparkles } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { DEMO_SITE_CONTENT } from "../data/demoData";

export default function CityIntroduction() {
  const { lang, t } = useLanguage();
  const about = DEMO_SITE_CONTENT.about;

  return (
    <section className="city-intro-section">
      <div className="section-container">
        <div className="section-header text-center">
          <div className="section-badge">
            <Sparkles size={16} />
            <span>{lang === "vi" ? "Di Sản & Lịch Sử" : "Heritage & History"}</span>
          </div>
          <h2 className="section-title">{about.title[lang] || about.title.vi}</h2>
          <p className="section-lead">{about.lead[lang] || about.lead.vi}</p>
        </div>

        {/* Historical Timeline */}
        <div className="timeline-grid">
          {about.timeline.map((item, index) => (
            <div key={index} className="timeline-card">
              <div className="timeline-header">
                <span className="timeline-era">{item.era}</span>
                <Clock size={18} className="era-icon" />
              </div>
              <h3 className="timeline-title">{item.title[lang] || item.title.vi}</h3>
              <p className="timeline-desc">{item.desc[lang] || item.desc.vi}</p>
            </div>
          ))}
        </div>

        {/* Core Values Featurettes */}
        <div className="intro-features-grid">
          <div className="feature-item">
            <div className="feature-icon-box">
              <Landmark size={24} />
            </div>
            <h4>{lang === "vi" ? "Kiến Trúc Đa Dạng" : "Diverse Architecture"}</h4>
            <p>
              {lang === "vi"
                ? "Sự giao thoa ngoạn mục giữa phong cách Phục Hưng Pháp, Art Deco thế kỷ 20 và các công trình hiện đại biểu tượng."
                : "A spectacular blend of French Neo-Romanesque, 20th-century Art Deco, and iconic modern landmarks."}
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <BookOpen size={24} />
            </div>
            <h4>{lang === "vi" ? "Chiều Sâu Lịch Sử" : "Historical Depth"}</h4>
            <p>
              {lang === "vi"
                ? "Nơi chứng kiến những bước ngoặt trọng đại của dân tộc, lưu giữ qua hệ thống bảo tàng và di tích quốc gia đặc biệt."
                : "Witness to pivotal moments in Vietnamese history, faithfully preserved across premier museums and monuments."}
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <Sparkles size={24} />
            </div>
            <h4>{lang === "vi" ? "Văn Hóa Mở & Hiếu Khách" : "Open & Welcoming Spirit"}</h4>
            <p>
              {lang === "vi"
                ? "Người Sài Gòn hào sảng, nồng hậu, chào đón du khách bốn phương với nét văn hóa ẩm thực hè phố độc nhất vô nhị."
                : "Warm, generous southern hospitality welcoming travelers worldwide with world-class street gastronomy."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
