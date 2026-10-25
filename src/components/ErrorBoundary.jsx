import React from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "#/";
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
            background: "var(--bg-main, #f8fafc)",
            color: "var(--text-main, #0f172a)",
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#fee2e2",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem"
            }}
          >
            <AlertCircle size={32} />
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Đã có sự cố khi tải trang
          </h2>
          <p style={{ maxWidth: "500px", color: "var(--text-muted, #64748b)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            {this.state.error?.message || "Đã xảy ra lỗi không mong muốn trong quá trình kết xuất giao diện."}
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                background: "#059669",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              <RotateCcw size={16} />
              <span>Tải lại trang</span>
            </button>

            <button
              type="button"
              onClick={this.handleGoHome}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#334155",
                border: "1px solid #cbd5e1",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              <Home size={16} />
              <span>Về trang chủ</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
