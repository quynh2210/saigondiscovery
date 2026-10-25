import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./hooks/useLanguage";
import { ThemeProvider } from "./hooks/useTheme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import AboutPage from "./pages/AboutPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <HashRouter>
            <div className="app-root-layout">
              <Navbar />
              <div className="app-main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/places/:id" element={<PlaceDetailPage />} />
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </HashRouter>
        </ErrorBoundary>
      </LanguageProvider>
    </ThemeProvider>
  );
}
