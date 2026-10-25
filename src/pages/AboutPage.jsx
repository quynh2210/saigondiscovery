import React from "react";
import { Link } from "react-router-dom";
import {
  Map,
  Landmark,
  Building2,
  Trees,
  ArrowRight,
  Star,
  Clock,
  Globe,
  Users,
  Camera,
  Heart,
  Sparkles,
  Navigation,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { formatDistrict } from "../utils/translations";
import CityIntroduction from "../components/CityIntroduction";
import ChatbotWidget from "../components/ChatbotWidget";

const STATS = [
  { icon: Users, valueVI: "10 triệu+", valueEN: "10M+", labelVI: "Dân số", labelEN: "Population" },
  { icon: Clock, valueVI: "300+ năm", valueEN: "300+ years", labelVI: "Lịch sử", labelEN: "History" },
  { icon: Landmark, valueVI: "100+", valueEN: "100+", labelVI: "Di tích lịch sử", labelEN: "Historic Sites" },
  { icon: Globe, valueVI: "Top 10", valueEN: "Top 10", labelVI: "Điểm đến Đông Nam Á", labelEN: "SE Asia Dest." },
];

const HIGHLIGHTS = [
  {
    icon: Building2,
    colorClass: "highlight-blue",
    titleVI: "Kiến Trúc Pháp Thuộc",
    titleEN: "French Colonial Architecture",
    descVI:
      "Nhà thờ Đức Bà, Bưu điện Trung tâm, UBND Thành phố — những viên ngọc kiến trúc tân Gothic và Baroque được bảo tồn nguyên vẹn qua hơn 100 năm.",
    descEN:
      "Notre-Dame Cathedral, Central Post Office, and City Hall — pristine Neo-Gothic and Baroque gems preserved across 100+ years of turbulent history.",
  },
  {
    icon: Heart,
    colorClass: "highlight-red",
    titleVI: "Di Tích Lịch Sử Quốc Gia",
    titleEN: "National Historical Sites",
    descVI:
      "Dinh Độc Lập — biểu tượng thống nhất dân tộc, nơi kết thúc chiến tranh Việt Nam vào ngày 30/4/1975, mang trong lòng cả một thế kỷ phong trào giải phóng.",
    descEN:
      "Independence Palace — the iconic reunification landmark where the Vietnam War ended on April 30, 1975, carrying a century of liberation within its walls.",
  },
  {
    icon: Camera,
    colorClass: "highlight-amber",
    titleVI: "Văn Hóa & Nghệ Thuật",
    titleEN: "Culture & Arts",
    descVI:
      "Bảo tàng Chứng tích Chiến tranh, Bảo tàng Mỹ thuật, Nhà hát Thành phố — không gian văn hóa sống động phản chiếu tâm hồn đa tầng của người Sài Gòn.",
    descEN:
      "War Remnants Museum, Fine Arts Museum, Opera House — a vibrant cultural tapestry reflecting Saigon's multilayered, resilient spirit.",
  },
  {
    icon: Trees,
    colorClass: "highlight-green",
    titleVI: "Đường Phố & Thiên Nhiên",
    titleEN: "Streets & Nature",
    descVI:
      "Những con phố rợp bóng me chua, Hồ Con Rùa thơ mộng, các công viên xanh mát giữa lòng đô thị náo nhiệt — vẻ đẹp bình yên giữa nhịp sống hối hả.",
    descEN:
      "Canopied tamarind streets, romantic Turtle Lake, and tranquil green parks nestled amid bustling urban energy — serene beauty in a city that never sleeps.",
  },
];

export default function AboutPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="about-page">
      {/* ── HERO BANNER ── */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content section-container">
          <span className="about-hero-badge">
            <Sparkles size={15} />
            {lang === "vi" ? "Khám phá lịch sử & văn hóa" : "Discover history & culture"}
          </span>
          <h1 className="about-hero-title">
            {lang === "vi" ? (
              <>Sài Gòn — TP. Hồ Chí Minh<br /><em>Qua năm tháng</em></>
            ) : (
              <>Saigon — Ho Chi Minh City<br /><em>Through Time</em></>
            )}
          </h1>
          <p className="about-hero-lead">
            {lang === "vi"
              ? "Hành trình hơn 300 năm từ bến cảng sông nước phù sa đến đô thị trung tâm kinh tế năng động và giàu bản sắc văn hóa bậc nhất Đông Nam Á."
              : "A journey spanning over 300 years from fertile river trading posts into the most vibrant, culturally diverse economic metropolis of Southeast Asia."}
          </p>
          <div className="about-hero-ctas">
            <Link to="/map" className="about-cta-primary">
              <Map size={18} />
              {t("exploreMap")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="about-stats-bar">
        <div className="section-container">
          <div className="about-stats-grid">
            {STATS.map(({ icon: Icon, valueVI, valueEN, labelVI, labelEN }, i) => (
              <div key={i} className="about-stat-item">
                <div className="about-stat-icon">
                  <Icon size={22} />
                </div>
                <div className="about-stat-value">{lang === "vi" ? valueVI : valueEN}</div>
                <div className="about-stat-label">{lang === "vi" ? labelVI : labelEN}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY INTRODUCTION (Timeline) ── */}
      <div id="about-intro">
        <CityIntroduction />
      </div>

      {/* ── HIGHLIGHTS GRID ── */}
      <section className="about-highlights-section">
        <div className="section-container">
          <div className="about-section-header">
            <span className="section-badge">
              <Star size={15} />
              {lang === "vi" ? "Điều Làm Nên Sài Gòn" : "What Makes Saigon Unique"}
            </span>
            <h2 className="section-title">
              {lang === "vi" ? "Vẻ Đẹp Đa Diện Của Một Đô Thị" : "The Multi-Faceted Beauty of a Metropolis"}
            </h2>
          </div>
          <div className="about-highlights-grid">
            {HIGHLIGHTS.map(({ icon: Icon, colorClass, titleVI, titleEN, descVI, descEN }, i) => (
              <div key={i} className={`about-highlight-card ${colorClass}`}>
                <div className="highlight-icon-wrap">
                  <Icon size={26} />
                </div>
                <div className="highlight-content">
                  <h3>{lang === "vi" ? titleVI : titleEN}</h3>
                  <p>{lang === "vi" ? descVI : descEN}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO DISTRICTS ── */}
      <section className="about-districts-section">
        <div className="section-container">
          <div className="about-section-header">
            <span className="section-badge">
              <Navigation size={15} />
              {lang === "vi" ? "Hai Quận Trọng Điểm" : "Two Core Districts"}
            </span>
            <h2 className="section-title">
              {lang === "vi" ? "Quận 1 & Quận 3 — Linh Hồn Sài Gòn" : "District 1 & District 3 — The Soul of Saigon"}
            </h2>
          </div>
          <div className="about-districts-grid">
            {/* District 1 */}
            <div className="about-district-card dist1">
              <div className="dist-card-badge">{formatDistrict("Quận 1", lang)}</div>
              <Building2 size={40} className="dist-card-icon" />
              <h3 className="dist-card-title">
                {lang === "vi" ? "Trái Tim Chính Trị & Kiến Trúc" : "The Political & Architectural Heart"}
              </h3>
              <p className="dist-card-desc">
                {lang === "vi"
                  ? "Nơi tọa lạc của những biểu tượng quốc gia: Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Trung tâm và Chợ Bến Thành — trung tâm hành chính sầm uất với đại lộ rợp bóng cây cổ thụ và những con phố đi bộ lung linh ánh đèn."
                  : "Home to Vietnam's celebrated national monuments: Independence Palace, Notre-Dame Cathedral, the Central Post Office, and Ben Thanh Market — a bustling commercial heart flanked by broad avenues and historic plazas."}
              </p>
              <div className="dist-card-tags">
                <span>Dinh Độc Lập</span>
                <span>Nhà thờ Đức Bà</span>
                <span>Bưu điện TT</span>
                <span>Chợ Bến Thành</span>
              </div>
            </div>

            {/* District 3 */}
            <div className="about-district-card dist3">
              <div className="dist-card-badge dist3-badge">{formatDistrict("Quận 3", lang)}</div>
              <Trees size={40} className="dist-card-icon" />
              <h3 className="dist-card-title">
                {lang === "vi" ? "Nét Thanh Lịch & Biệt Thự Cổ" : "Elegance, Villas & Spiritual Sanctuary"}
              </h3>
              <p className="dist-card-desc">
                {lang === "vi"
                  ? "Được bình chọn vào top những khu phố tuyệt vời nhất thế giới — quyến rũ bởi đường phố rợp bóng me chua, biệt thự Pháp cổ kính nép trong ngõ nhỏ, Bảo tàng Chứng tích Chiến tranh sâu sắc và Hồ Con Rùa thơ mộng."
                  : "Ranked among the world's coolest neighborhoods — enchanting with canopied tamarind avenues, quiet colonial villas, the poignant War Remnants Museum, and iconic Turtle Lake."}
              </p>
              <div className="dist-card-tags dist3-tags">
                <span>Bảo tàng Chứng tích</span>
                <span>Hồ Con Rùa</span>
                <span>Chùa Vĩnh Nghiêm</span>
                <span>Biệt thự Pháp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="about-cta-section">
        <div className="section-container">
          <div className="about-cta-banner">
            <div className="about-cta-text">
              <h2>{lang === "vi" ? "Sẵn sàng khám phá Sài Gòn?" : "Ready to Explore Saigon?"}</h2>
              <p>
                {lang === "vi"
                  ? "Mở bản đồ tương tác để xem chi tiết địa danh, nghe thuyết minh audio và tìm đường xe buýt nhanh chóng."
                  : "Open the interactive map to locate attractions, listen to audio guides, and find bus directions instantly."}
              </p>
            </div>
            <div className="about-cta-actions">
              <Link to="/map" className="about-cta-primary">
                <Map size={20} />
                {t("exploreMap")}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ChatbotWidget />
    </div>
  );
}
