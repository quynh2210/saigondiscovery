import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Map, 
  ArrowRight, 
  Sparkles, 
  Info, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1, 
  X,
  Maximize2,
  Minimize2,
  RotateCw
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getSiteContent } from "../services/siteContentService";

// Video mẫu chất lượng cao về du lịch và nhịp sống TP. Hồ Chí Minh
const DEFAULT_SAMPLE_VIDEO = "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/57/Ho_Chi_Minh_city_tour.webm/Ho_Chi_Minh_city_tour.webm.480p.vp9.webm";

export default function CityHero({ onExploreClick, videoUrl }) {
  const { lang, t } = useLanguage();
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem("hcmc_audio_volume");
      return saved !== null ? parseFloat(saved) : 0.85;
    } catch {
      return 0.85;
    }
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeVideoSrc, setActiveVideoSrc] = useState(videoUrl || DEFAULT_SAMPLE_VIDEO);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Tải URL video tùy biến từ siteContent và lắng nghe cập nhật real-time từ Admin
  useEffect(() => {
    getSiteContent().then((content) => {
      if (content?.introVideoUrl || content?.heroVideoUrl) {
        setActiveVideoSrc(content.introVideoUrl || content.heroVideoUrl);
      }
    }).catch(() => {});

    const handleContentUpdate = (e) => {
      const updatedUrl = e.detail?.introVideoUrl || e.detail?.heroVideoUrl;
      if (updatedUrl) {
        setActiveVideoSrc(updatedUrl);
      }
    };

    window.addEventListener("hcmc:site-content-updated", handleContentUpdate);
    return () => {
      window.removeEventListener("hcmc:site-content-updated", handleContentUpdate);
    };
  }, []);

  // Lắng nghe sự kiện thay đổi fullscreen của trình duyệt (ví dụ khi người dùng nhấn Esc)
  useEffect(() => {
    const onFullscreenChange = () => {
      const isFull = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFull);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  // Xử lý mở video
  const handleOpenVideo = () => {
    setIsVideoActive(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
        videoRef.current.muted = isMuted;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Trình duyệt chặn autoplay có tiếng -> bật mute và phát tiếp
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
      }
    }, 200);
  };

  // Xử lý đóng video và khôi phục banner
  const handleCloseVideo = async () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      } catch {}
    }
    setIsFullscreen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setIsVideoActive(false);
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  // Điều chỉnh âm lượng
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    try {
      localStorage.setItem("hcmc_audio_volume", val.toString());
    } catch {}

    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  // Chế độ Xoay ngang & Toàn màn hình
  const toggleFullscreen = async () => {
    try {
      const container = containerRef.current;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container?.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container?.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        }
        setIsFullscreen(true);

        // Thử xoay ngang sang chế độ landscape trên thiết bị di động
        if (window.screen?.orientation?.lock) {
          window.screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
        setIsFullscreen(false);
        if (window.screen?.orientation?.unlock) {
          window.screen.orientation.unlock();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle fallback:", err);
      // Fallback toggle state class
      setIsFullscreen((prev) => !prev);
    }
  };

  // Cập nhật tiến trình video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const formatSeconds = (sec) => {
    if (isNaN(sec) || sec <= 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section className={`city-hero ${isVideoActive ? "hero-mode-video" : "hero-mode-banner"}`}>
      <div className="hero-overlay"></div>

      {/* ── BANNER GỐC (Giữ nguyên toàn bộ cấu trúc & animation mượt) ── */}
      <div className={`hero-content-container ${isVideoActive ? "hero-exiting" : "hero-entering"}`}>
        <div className="hero-badge">
          <Sparkles size={16} className="badge-icon" />
          <span>{t("heroBadge")}</span>
        </div>

        <h1 className="hero-title">
          {lang === "vi" ? (
            <>
              Thành Phố <span className="highlight-text">Hồ Chí Minh</span>
            </>
          ) : (
            <>
              Welcome to <span className="highlight-text">Ho Chi Minh City</span>
            </>
          )}
        </h1>

        <p className="hero-subtitle">
          {lang === "vi"
            ? "Khám phá những di tích lịch sử vang bóng, công trình kiến trúc vượt thời gian và nhịp sống văn hóa đặc sắc giữa lòng Quận 1 và Quận 3."
            : "Discover historic landmarks, timeless colonial architecture, and the vibrant cultural pulse across the heart of Saigon."}
        </p>

        {/* Nút hành động chính & Nút xem video nổi bật */}
        <div className="hero-actions">
          {onExploreClick ? (
            <button type="button" className="hero-btn primary-btn" onClick={onExploreClick}>
              <Map size={20} />
              <span>{t("exploreMap")}</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <Link to="/map" className="hero-btn primary-btn">
              <Map size={20} />
              <span>{t("exploreMap")}</span>
              <ArrowRight size={18} />
            </Link>
          )}

          {/* Nút Phát Video Giới Thiệu Nổi Bật */}
          <button
            type="button"
            className="hero-video-trigger-btn"
            onClick={handleOpenVideo}
            title={lang === "vi" ? "Xem video giới thiệu Sài Gòn" : "Watch Saigon showcase video"}
          >
            <span className="video-trigger-pulse"></span>
            <div className="video-trigger-icon-wrap">
              <Play size={18} fill="currentColor" className="play-triangle" />
            </div>
            <span className="video-trigger-label">
              {lang === "vi" ? "Xem Video Giới Thiệu" : "Watch Intro Video"}
            </span>
          </button>

          <Link to="/about" className="hero-btn secondary-btn">
            <Info size={20} />
            <span>{t("navAbout")}</span>
          </Link>
        </div>

        {/* Quick Highlights Stats */}
        <div className="hero-stats-row">
          <div className="stat-pill">
            <span className="stat-num">Q.1</span>
            <span className="stat-label">{lang === "vi" ? "Trái tim sôi động" : "The Vibrant Heart"}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">Q.3</span>
            <span className="stat-label">{lang === "vi" ? "Nét duyên cổ kính" : "Heritage & Charm"}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">100%</span>
            <span className="stat-label">{lang === "vi" ? "Bản đồ tương tác" : "Interactive Map"}</span>
          </div>
        </div>
      </div>

      {/* ── VIDEO SHOWCASE ANIMATION CONTAINER (HIỂN THỊ SIÊU RỘNG & FULL MÀN HÌNH) ── */}
      {isVideoActive && (
        <div 
          ref={containerRef}
          className={`hero-video-player-container ${isFullscreen ? "is-fullscreen-mode" : ""}`}
        >
          <div className="video-inner-wrapper">
            {/* Header thanh điều khiển & Nút đóng & Nút Xoay toàn màn hình */}
            <div className="video-top-bar">
              <div className="video-title-chip">
                <span className="live-dot"></span>
                <span>{lang === "vi" ? "Video Giới Thiệu Thành Phố Hồ Chí Minh" : "Ho Chi Minh City Showcase"}</span>
              </div>

              <div className="video-top-actions">
                {/* Nút Xoay Ngang Full Màn Hình */}
                <button
                  type="button"
                  className="video-top-btn video-rotate-btn"
                  onClick={toggleFullscreen}
                  title={lang === "vi" ? "Xoay ngang / Toàn màn hình" : "Rotate / Fullscreen"}
                >
                  <RotateCw size={17} className="rotate-icon" />
                  {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                  <span>{lang === "vi" ? (isFullscreen ? "Thu nhỏ" : "Xoay ngang Full màn hình") : (isFullscreen ? "Exit Fullscreen" : "Rotate Fullscreen")}</span>
                </button>

                {/* Nút Đóng video */}
                <button
                  type="button"
                  className="video-close-btn"
                  onClick={handleCloseVideo}
                  title={lang === "vi" ? "Đóng video (Quay về trang chủ)" : "Close video (Back to banner)"}
                >
                  <X size={20} />
                  <span>{lang === "vi" ? "Đóng video" : "Close"}</span>
                </button>
              </div>
            </div>

            {/* Video Element */}
            <div className="video-screen-frame" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={activeVideoSrc}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hero-video-element"
              />

              {/* Icon tạm dừng giữa màn hình khi pause */}
              {!isPlaying && (
                <div className="video-center-play-overlay">
                  <div className="center-play-circle">
                    <Play size={44} fill="currentColor" />
                  </div>
                </div>
              )}
            </div>

            {/* Bộ điều khiển Video dưới cùng */}
            <div className="video-bottom-controls-bar">
              {/* Nút Play / Pause */}
              <button
                type="button"
                className="video-ctrl-btn"
                onClick={togglePlay}
                title={isPlaying ? "Tạm dừng" : "Phát tiếp"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              </button>

              {/* Thanh tiến trình */}
              <div className="video-timeline-wrap">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="video-progress-slider"
                />
                <div className="video-time-display">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>/</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>

              {/* Bộ điều khiển âm lượng */}
              <div className="video-volume-group">
                <button
                  type="button"
                  className="video-ctrl-btn"
                  onClick={toggleMute}
                  title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="video-volume-slider"
                  title={`Âm lượng: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>

              {/* Nút Phóng to / Xoay ngang màn hình ở thanh dưới */}
              <button
                type="button"
                className="video-ctrl-btn video-fs-ctrl-btn"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Thu nhỏ màn hình" : "Xoay ngang / Toàn màn hình"}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
