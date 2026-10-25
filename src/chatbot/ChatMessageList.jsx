import React from "react";
import { 
  Navigation, 
  QrCode 
} from "lucide-react";
import AudioGuidePlayer from "../components/AudioGuidePlayer";

export default function ChatMessageList({
  messages = [],
  mascotSrc,
  onOptionClick,
  onShowQrModal,
  lang = "vi"
}) {
  return (
    <div className="chat-messages-container">
      {messages.map((msg) => {
        const isUser = msg.sender === "user";

        return (
          <div
            key={msg.id}
            className={`chat-bubble-row ${isUser ? "user-row" : "bot-row"}`}
          >
            {!isUser && (
              <img
                src={mascotSrc}
                alt="Plunis"
                className="chat-avatar-img"
              />
            )}

            <div className={`chat-bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
              {!isUser && (
                <div className="bot-bubble-meta-header">
                  <span className="bot-author-name">Plunis</span>
                </div>
              )}

              {/* Nội dung tin nhắn */}
              <div className="message-text-content">
                {msg.text.split("\n").map((line, idx) => (
                  <p key={idx} style={{ margin: line ? "0.25rem 0" : "0.5rem 0" }}>
                    {renderFormattedLine(line)}
                  </p>
                ))}
              </div>

              {/* Audio Guide Player nếu có */}
              {msg.actionData?.type === "PLAY_AUDIO_GUIDE" && msg.actionData?.audioData && (
                <div className="bubble-audio-box" style={{ marginTop: "0.75rem" }}>
                  <AudioGuidePlayer
                    audioData={msg.actionData.audioData}
                    placeName={msg.actionData.placeName}
                    compact={true}
                  />
                </div>
              )}

              {/* QR Code Action nếu có */}
              {msg.actionData?.type === "SHOW_QR" && msg.actionData?.qrData && (
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="quick-action-pill"
                    onClick={() => onShowQrModal(msg.actionData.qrData, msg.actionData.placeName)}
                  >
                    <QrCode size={14} />
                    <span>{lang === "vi" ? "Xem mã QR thông tin" : "View QR Code"}</span>
                  </button>
                </div>
              )}

              {/* Danh sách thẻ Quán ăn / Nước liên kết nếu có */}
              {msg.actionData?.type === "RECOMMEND_VENUES" && Array.isArray(msg.actionData?.venues) && msg.actionData.venues.length > 0 && (
                <div className="bubble-venues-grid" style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {msg.actionData.venues.map((venue) => {
                    const vName = venue.name?.[lang] || venue.name?.vi || venue.id;
                    const vAddr = venue.address?.[lang] || venue.address?.vi || "";
                    const isDrink = venue.type === "drink";

                    return (
                      <div
                        key={venue.id}
                        className="bubble-venue-card"
                        style={{
                          background: "var(--bg-alt)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "0.6rem 0.75rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, fontSize: "0.88rem" }}>
                            <span>{isDrink ? "☕" : "🍜"}</span>
                            <span>{vName}</span>
                          </div>
                          {vAddr && (
                            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              {vAddr}
                            </div>
                          )}
                        </div>

                        {venue.googleMapsUrl && (
                          <a
                            href={venue.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dash-btn primary"
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}
                          >
                            <Navigation size={12} />
                            <span>{lang === "vi" ? "Đường đi" : "Directions"}</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Các nút hành động được xác minh (Buttons) */}
              {msg.actionData?.buttons && (
                <div className="bubble-actions-row" style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {msg.actionData.buttons.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      className="quick-action-pill"
                      onClick={() => onOptionClick(btn)}
                    >
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Các nút lựa chọn câu trả lời nhanh (Options) */}
              {Array.isArray(msg.options) && msg.options.length > 0 && (
                <div className="bubble-options-row" style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {msg.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="quick-action-pill"
                      onClick={() => onOptionClick(opt)}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Xử lý in đậm Markdown đơn giản (**bold**)
 */
function renderFormattedLine(text) {
  if (!text) return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
