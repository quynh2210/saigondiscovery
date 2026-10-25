import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Headphones, Volume2, Volume1, VolumeX } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { normalizeAudioUrl } from "../utils/mediaUtils";

const DEFAULT_SAMPLE_AUDIO = "/assets/audio/Attention.mp3";

export default function AudioGuidePlayer({ audioData, placeName, compact = false }) {
  const { lang, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedLang, setSelectedLang] = useState(lang || "vi");
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem("hcmc_audio_volume");
      return saved !== null ? parseFloat(saved) : 0.85;
    } catch {
      return 0.85;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Đồng bộ ngôn ngữ mặc định nếu prop lang thay đổi
  useEffect(() => {
    if (lang) {
      setSelectedLang(lang);
    }
  }, [lang]);

  const currentGuide = audioData?.[selectedLang] || audioData?.vi || audioData?.en;
  const rawAudioUrl = currentGuide?.url || DEFAULT_SAMPLE_AUDIO;
  const audioSrc = normalizeAudioUrl(rawAudioUrl);

  // Áp dụng âm lượng và trạng thái tắt tiếng vào thẻ audio HTML5
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Khi đổi track hoặc đổi ngôn ngữ, dừng track cũ và cập nhật
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      audioRef.current.load();
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [audioSrc, selectedLang, volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Gửi event để BackgroundMusic tự động tạm dừng
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hcmc:audioguide-play"));
      }

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play prevented or failed:", err);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    try {
      localStorage.setItem("hcmc_audio_volume", val.toString());
    } catch {}

    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }

    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  if (!currentGuide && !audioData) {
    return (
      <div className={`audio-player-unavailable ${compact ? "compact" : ""}`}>
        <Headphones size={compact ? 16 : 20} className="audio-icon" />
        <p>{t("audioGuideTitle")}: {t("updating")}</p>
      </div>
    );
  }

  const title = currentGuide?.title || `${t("audioGuideTitle")} - ${placeName || ""}`;

  return (
    <div className={`audio-guide-player-card ${compact ? "audio-compact-card" : ""}`}>
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="audio-header">
        <div className="audio-meta">
          <Headphones size={compact ? 16 : 20} className="headphone-icon" />
          <h4 className="audio-title">{title}</h4>
        </div>

        {/* Audio Language Switcher: VI / EN */}
        <div className="audio-lang-switch">
          <button
            type="button"
            className={`audio-lang-btn ${selectedLang === "vi" ? "active" : ""}`}
            onClick={() => setSelectedLang("vi")}
            title="Nghe tiếng Việt"
          >
            VI
          </button>
          <button
            type="button"
            className={`audio-lang-btn ${selectedLang === "en" ? "active" : ""}`}
            onClick={() => setSelectedLang("en")}
            title="Listen in English"
          >
            EN
          </button>
        </div>
      </div>

      <div className="audio-controls-row">
        {/* Nút Play / Pause */}
        <button
          type="button"
          className="audio-play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Tạm dừng" : "Phát thuyết minh"}
        >
          {isPlaying ? <Pause size={compact ? 16 : 20} /> : <Play size={compact ? 16 : 20} className="play-icon" />}
        </button>

        {/* Thanh tua tiến trình & hiển thị thời gian */}
        <div className="audio-scrubber-wrap">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="audio-scrubber"
            title={`Tiến trình: ${formatTime(currentTime)} / ${formatTime(duration)}`}
          />
          <div className="audio-time-row">
            <span>{formatTime(currentTime)}</span>
            <span>
              {duration > 0
                ? formatTime(duration)
                : currentGuide?.duration || "3:00"}
            </span>
          </div>
        </div>

        {/* Bộ chỉnh âm lượng (Volume Controls) */}
        <div className="audio-volume-wrap" title={`Âm lượng: ${Math.round((isMuted ? 0 : volume) * 100)}%`}>
          <button
            type="button"
            className="audio-volume-btn"
            onClick={toggleMute}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            aria-label="Volume Mute Toggle"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={compact ? 16 : 18} />
            ) : volume < 0.5 ? (
              <Volume1 size={compact ? 16 : 18} />
            ) : (
              <Volume2 size={compact ? 16 : 18} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="audio-volume-slider"
          />
        </div>
      </div>
    </div>
  );
}
