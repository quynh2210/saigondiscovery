import React, { useState } from "react";
import { X, LogIn, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { loginWithGoogle, loginWithEmail, registerWithEmail } from "../services/authService";
import { useLanguage } from "../hooks/useLanguage";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { lang } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res?.user) {
        if (onSuccess) onSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Đăng nhập Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        if (!displayName.trim()) {
          throw new Error("Vui lòng nhập họ và tên của bạn.");
        }
        res = await registerWithEmail(email, password, displayName);
      } else {
        res = await loginWithEmail(email, password);
      }

      if (res?.user) {
        if (onSuccess) onSuccess(res.user);
        onClose();
      }
    } catch (err) {
      let msg = err.message;
      if (msg.includes("auth/user-not-found") || msg.includes("auth/wrong-password") || msg.includes("auth/invalid-credential")) {
        msg = lang === "vi" ? "Email hoặc mật khẩu không chính xác." : "Incorrect email or password.";
      } else if (msg.includes("auth/email-already-in-use")) {
        msg = lang === "vi" ? "Email này đã được sử dụng." : "Email is already registered.";
      } else if (msg.includes("auth/weak-password")) {
        msg = lang === "vi" ? "Mật khẩu phải có ít nhất 6 ký tự." : "Password should be at least 6 characters.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h3>
            {isRegister
              ? lang === "vi"
                ? "Tạo tài khoản du khách"
                : "Create Tourist Account"
              : lang === "vi"
              ? "Đăng nhập du khách"
              : "Tourist Sign In"}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="auth-modal-content" style={{ padding: "1.25rem 0 0" }}>
          {error && (
            <div className="auth-error-banner" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#ef4444",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.88rem"
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Nút đăng nhập nhanh bằng Google */}
          <button
            type="button"
            className="google-sign-in-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--bg-card)",
              color: "var(--text-main)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              marginBottom: "1.25rem",
              transition: "var(--transition)"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {lang === "vi"
                ? "Tiếp tục với Google"
                : "Continue with Google"}
            </span>
          </button>

          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "1rem 0",
            color: "var(--text-muted)",
            fontSize: "0.82rem"
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ padding: "0 0.75rem" }}>
              {lang === "vi" ? "HOẶC DÙNG EMAIL" : "OR WITH EMAIL"}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <form onSubmit={handleEmailAuth} className="modal-form">
            {isRegister && (
              <div className="form-group">
                <label>{lang === "vi" ? "Họ và tên *" : "Full Name *"}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={lang === "vi" ? "Nguyễn Văn A" : "John Doe"}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>{lang === "vi" ? "Mật khẩu *" : "Password *"}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="dash-btn primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              {loading ? (
                <Loader2 size={18} className="spinning-loader" />
              ) : (
                <LogIn size={18} />
              )}
              <span>
                {isRegister
                  ? lang === "vi"
                    ? "Tạo tài khoản"
                    : "Create Account"
                  : lang === "vi"
                  ? "Đăng nhập"
                  : "Sign In"}
              </span>
            </button>
          </form>

          <div style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.88rem",
            color: "var(--text-muted)"
          }}>
            {isRegister ? (
              <span>
                {lang === "vi" ? "Đã có tài khoản? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  {lang === "vi" ? "Đăng nhập ngay" : "Sign in now"}
                </button>
              </span>
            ) : (
              <span>
                {lang === "vi" ? "Chưa có tài khoản? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  {lang === "vi" ? "Đăng ký miễn phí" : "Sign up free"}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
