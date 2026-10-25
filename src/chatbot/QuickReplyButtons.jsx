import React from "react";
import { RotateCcw } from "lucide-react";

export default function QuickReplyButtons({
  onSelectQuickPrompt,
  onResetChat,
  lang = "vi",
  isProcessing = false
}) {
  const quickPrompts = lang === "vi"
    ? [
        { label: "🏛️ Khám phá địa điểm", text: "Gợi ý cho tôi các địa điểm du lịch nổi bật tại TP.HCM" },
        { label: "🍜 Quán ăn ngon", text: "Có quán ăn nào ngon gần đây không?" },
        { label: "☕ Cà phê đẹp", text: "Gợi ý quán nước hoặc cà phê đẹp" },
        { label: "🚌 Tìm xe buýt", text: "Làm thế nào để đi xe buýt đến Bưu điện Trung tâm?" }
      ]
    : [
        { label: "🏛️ Explore Places", text: "Recommend famous tourist attractions in Saigon" },
        { label: "🍜 Good Local Food", text: "Are there good food spots nearby?" },
        { label: "☕ Scenic Cafes", text: "Recommend nice cafes around here" },
        { label: "🚌 Bus Routes", text: "How to take bus to Central Post Office?" }
      ];

  return (
    <div className="quick-replies-bar">
      <div className="quick-chips-scroll">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="quick-chip-btn"
            disabled={isProcessing}
            onClick={() => onSelectQuickPrompt(item.text)}
          >
            <span>{item.label}</span>
          </button>
        ))}

        <button
          type="button"
          className="quick-chip-btn reset-chip"
          disabled={isProcessing}
          onClick={onResetChat}
          title={lang === "vi" ? "Làm mới hội thoại" : "New conversation"}
        >
          <RotateCcw size={12} />
          <span>{lang === "vi" ? "Làm mới" : "Reset"}</span>
        </button>
      </div>
    </div>
  );
}
