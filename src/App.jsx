import { BrowserRouter, Route, Routes } from "react-router-dom";

import AnimatedBackground from "./components/AnimatedBackground";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-bg">
          <AnimatedBackground />
          <div className="pixel-grid" aria-hidden="true" />
        </div>
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
