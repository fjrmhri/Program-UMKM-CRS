import React, { useState } from "react";
import Dashboard from "./components/preposttest/Dashboard";
import UploadModal from "./components/preposttest/UploadModal";
import DetailModal from "./components/preposttest/DetailModal";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("analytics");
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-base">
      {/* Header */}
      <header className="py-3 md:py-6 bg-white shadow">
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-center leading-tight">
          Program Corporate Social Responsibility
        </h1>
        <h5 className="text-xs sm:text-base md:text-lg lg:text-xl text-center font-medium">
          estate cerenti
        </h5>
      </header>

      {/* Navbar */}
      <nav className="bg-white shadow mb-2 sm:mb-3 md:mb-6">
        <ul className="flex flex-wrap justify-center gap-1 sm:gap-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base">
          <li
            className={`px-2 sm:px-4 py-1 sm:py-2 cursor-pointer rounded transition-all ${
              activeMenu === "analytics"
                ? "border-b-2 sm:border-b-4 border-blue-500 font-semibold text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveMenu("analytics")}
          >
            Analisis Pre‑Post Test
          </li>
        </ul>
      </nav>

      <main className="mx-auto px-1 sm:px-2 md:px-4 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
        {/* Dashboard and Modals for analytics menu */}
        {activeMenu === "analytics" && (
          <>
            <Dashboard onAdd={() => setShowUpload(true)} onView={setSelected} />
            {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
            {selected && (
              <DetailModal data={selected} onClose={() => setSelected(null)} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
