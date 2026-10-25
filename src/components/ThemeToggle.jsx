import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme mode toggle">
      <button
        type="button"
        className={`theme-btn ${!isDark ? "active" : ""}`}
        onClick={() => {
          if (isDark) toggleTheme();
        }}
        title="Chế độ Sáng (Light Mode)"
        aria-label="Light mode"
      >
        <Sun size={15} />
      </button>
      <button
        type="button"
        className={`theme-btn ${isDark ? "active" : ""}`}
        onClick={() => {
          if (!isDark) toggleTheme();
        }}
        title="Chế độ Tối (Dark Mode)"
        aria-label="Dark mode"
      >
        <Moon size={15} />
      </button>
    </div>
  );
}
