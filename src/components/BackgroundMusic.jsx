import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getSiteContent } from "../services/siteContentService";
import { normalizeAudioUrl } from "../utils/mediaUtils";

export default function BackgroundMusic() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");
  const isPlayingRef = useRef(false);
  const musicUrlRef = useRef("");
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);

  // Đồng bộ isPlayingRef mỗi khi isPlaying thay đổi
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Đồng bộ musicUrlRef mỗi khi musicUrl thay đổi
  useEffect(() => {
    musicUrlRef.current = musicUrl;
  }, [musicUrl]);

  // Tải cấu hình nhạc nền từ siteContent và lắng nghe cập nhật trực tiếp (real-time / admin edit)
  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const content = await getSiteContent();
        if (isMounted && content?.backgroundMusicUrl !== undefined) {
          const normalized = normalizeAudioUrl(content.backgroundMusicUrl);
          setMusicUrl(normalized);
          musicUrlRef.current = normalized;
        }
      } catch (err) {
        console.warn("Lỗi tải cấu hình nhạc nền:", err);
      }
    };
    loadContent();

    // Lắng nghe sự kiện cập nhật cấu hình từ AdminDashboard hoặc siteContentService
    const handleContentUpdate = (e) => {
      const updatedUrl = e.detail?.backgroundMusicUrl;
      if (updatedUrl !== undefined) {
        const normalized = normalizeAudioUrl(updatedUrl);
        setMusicUrl(normalized);
        musicUrlRef.current = normalized;

        if (audioElementRef.current) {
          if (normalized) {
            audioElementRef.current.src = normalized;
            audioElementRef.current.load();
            if (isPlayingRef.current) {
              audioElementRef.current.play().catch(console.warn);
            }
          } else {
            audioElementRef.current.pause();
          }
        }
      }
    };

    window.addEventListener("hcmc:site-content-updated", handleContentUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("hcmc:site-content-updated", handleContentUpdate);
    };
  }, []);

  // Lắng nghe sự kiện audio guide đang phát để tạm dừng nhạc nền
  // Dependency là [] để cleanup CHỈ chạy khi component unmount, KHÔNG chạy mỗi lần isPlaying thay đổi!
  useEffect(() => {
    const handleAudioGuidePlaying = () => {
      if (isPlayingRef.current) {
        stopAll();
        setIsPlaying(false);
      }
    };

    window.addEventListener("hcmc:audioguide-play", handleAudioGuidePlaying);

    return () => {
      window.removeEventListener("hcmc:audioguide-play", handleAudioGuidePlaying);
      stopAll();
    };
  }, []);

  const pentatonicFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

  const playSynthesizerNote = (ctx) => {
    if (!ctx || ctx.state === "closed") return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = pentatonicFreqs[Math.floor(Math.random() * pentatonicFreqs.length)];
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 4.6);
    } catch {
      // ignore
    }
  };

  const startMusic = async () => {
    let url = musicUrlRef.current;

    // Nếu chưa có url trong ref, thử tải lại nhanh từ getSiteContent
    if (!url) {
      try {
        const content = await getSiteContent();
        if (content?.backgroundMusicUrl) {
          url = normalizeAudioUrl(content.backgroundMusicUrl);
          setMusicUrl(url);
          musicUrlRef.current = url;
        }
      } catch {
        // fallback
      }
    }

    if (url) {
      const finalUrl = normalizeAudioUrl(url);
      try {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio(finalUrl);
          audioElementRef.current.loop = true;
          audioElementRef.current.volume = 0.5;
        } else {
          const currentSrc = audioElementRef.current.getAttribute("src") || audioElementRef.current.src;
          if (!currentSrc.includes(finalUrl) && currentSrc !== finalUrl) {
            audioElementRef.current.src = finalUrl;
            audioElementRef.current.load();
          }
        }

        audioElementRef.current.onerror = (e) => {
          console.error("Lỗi khi tải hoặc phát nhạc nền:", e);
          setIsPlaying(false);
        };

        await audioElementRef.current.play();
      } catch (e) {
        console.warn("Audio play blocked or failed:", e);
        setIsPlaying(false);
      }
    } else {
      try {
        if (!audioContextRef.current) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }
        playSynthesizerNote(audioContextRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          if (audioContextRef.current) {
            playSynthesizerNote(audioContextRef.current);
          }
        }, 3500);
      } catch (e) {
        console.warn("Web Audio error:", e);
        setIsPlaying(false);
      }
    }
  };

  const stopAll = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend();
    }
  };

  const toggleMusic = async () => {
    if (isPlaying) {
      stopAll();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await startMusic();
    }
  };

  return (
    <div className="bg-music-control" title={t("bgMusicTip")}>
      <button
        type="button"
        className={`bg-music-btn ${isPlaying ? "playing" : ""}`}
        onClick={toggleMusic}
        aria-label={t("bgMusic")}
      >
        <Music size={16} className={`music-icon ${isPlaying ? "spinning" : ""}`} />
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="bg-music-label">{isPlaying ? t("playing") : t("bgMusic")}</span>
      </button>
    </div>
  );
}
