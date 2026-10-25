import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, AlertCircle, Info, Loader2 } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { loginAdminUser, getCurrentAdminUser } from "../services/adminService";
import { isFirebaseConfigured } from "../lib/firebase";

export default function AdminLoginPage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Kiểm tra nếu đã đăng nhập rồi thì chuyển vào Dashboard
  useEffect(() => {
    const unsubscribe = getCurrentAdminUser((user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await loginAdminUser(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMessage(err.message || t("unauthorizedMsg"));
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoAccount = () => {
    setEmail("admin@hcmc.vn");
    setPassword("admin123");
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-icon-wrapper">
            <ShieldCheck size={36} className="admin-shield-icon" />
          </div>
          <h2 className="admin-login-title">{t("loginTitle")}</h2>
          <p className="admin-login-sub">{t("adminSubtitle")}</p>
        </div>

        {/* Demo Mode Notice */}
        {!isFirebaseConfigured && (
          <div className="admin-demo-alert">
            <div className="alert-title-row">
              <Info size={18} />
              <span>{t("demoModeNotice")}</span>
            </div>
            <p className="alert-desc">
              Bạn có thể đăng nhập bằng tài khoản Quản trị Demo để khám phá hệ thống CMS:
            </p>
            <button
              type="button"
              className="quick-demo-fill-btn"
              onClick={handleUseDemoAccount}
            >
              👉 Điền tài khoản demo (admin@hcmc.vn / admin123)
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="admin-error-box">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">{t("emailLabel")}</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t("passwordLabel")}</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinning-loader" />
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              <span>{t("loginBtn")}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
