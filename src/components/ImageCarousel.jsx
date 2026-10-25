import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export default function ImageCarousel({
  images = [],
  alt = "Image",
  autoPlayOnHover = true,
  interval = 1800,
  aspectRatio = "16/9",
  className = "",
  showControls = true,
  showDots = true,
  showCounter = true
}) {
  // Chuẩn hóa mảng ảnh, loại bỏ phần tử rỗng hoặc trùng lặp
  const validImages = Array.from(
    new Set((Array.isArray(images) ? images : [images]).filter((img) => typeof img === "string" && img.trim().length > 0))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Xử lý auto-slide khi hover
  useEffect(() => {
    if (autoPlayOnHover && isHovered && validImages.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
      }, interval);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, validImages.length, autoPlayOnHover, interval]);

  if (validImages.length === 0) {
    return (
      <div className={`empty-carousel-placeholder ${className}`} style={{ aspectRatio }}>
        <ImageIcon size={32} />
        <span>Chưa có hình ảnh</span>
      </div>
    );
  }

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  return (
    <div
      className={`image-carousel-container ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-track">
        {validImages.map((imgSrc, idx) => (
          <div
            key={idx}
            className={`carousel-slide ${idx === currentIndex ? "active" : ""}`}
            style={{
              opacity: idx === currentIndex ? 1 : 0,
              zIndex: idx === currentIndex ? 2 : 1,
              transition: "opacity 0.4s ease-in-out"
            }}
          >
            <img
              src={imgSrc}
              alt={`${alt} (${idx + 1}/${validImages.length})`}
              className="carousel-img"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Điều hướng Next / Prev khi có từ 2 ảnh trở lên */}
      {showControls && validImages.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-nav-btn prev-btn"
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="carousel-nav-btn next-btn"
            onClick={handleNext}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Counter Pill */}
      {showCounter && validImages.length > 1 && (
        <div className="carousel-counter-badge">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}

      {/* Dots Indicator */}
      {showDots && validImages.length > 1 && (
        <div className="carousel-dots-row">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`carousel-dot ${idx === currentIndex ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
