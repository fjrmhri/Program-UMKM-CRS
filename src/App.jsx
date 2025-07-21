import React, { useState } from "react";
import Dashboard from "./components/preposttest/Dashboard";
import UploadModal from "./components/preposttest/UploadModal";
import DetailModal from "./components/preposttest/DetailModal";
import DashboardMSE from "./components/mse/DashboardMSE";
import UploadModalMSE from "./components/mse/UploadModalMSE";
import DetailModalMSE from "./components/mse/DetailModalMSE";
import FormModalMSE from "./components/mse/FormModalMSE";
import FormModalComparisonMSE from "./components/mse/FormModalComparisonMSE";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("analytics");
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState(null);

  // MSE states
  const [showUploadMSE, setShowUploadMSE] = useState(false);
  const [showFormMSE, setShowFormMSE] = useState(false);
  const [selectedMSE, setSelectedMSE] = useState(null);
  const [showCompareMSE, setShowCompareMSE] = useState(false);
  const [compareDataMSE, setCompareDataMSE] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-base">
      {}
      <header className="py-3 md:py-6 bg-white shadow">
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-center leading-tight">
          Program Corporate Social Responsibility
        </h1>
        <h5 className="text-xs sm:text-base md:text-lg lg:text-xl text-center font-medium">
          estate cerenti
        </h5>
      </header>

      {}
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
          <li
            className={`px-2 sm:px-4 py-1 sm:py-2 cursor-pointer rounded transition-all ${
              activeMenu === "mse"
                ? "border-b-2 sm:border-b-4 border-green-500 font-semibold text-green-600 bg-green-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveMenu("mse")}
          >
            MSE Offline
          </li>
        </ul>
      </nav>

      <main className="mx-auto px-1 sm:px-2 md:px-4 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
        {}
        {activeMenu === "analytics" && (
          <>
            <Dashboard onAdd={() => setShowUpload(true)} onView={setSelected} />
            {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
            {selected && (
              <DetailModal data={selected} onClose={() => setSelected(null)} />
            )}
          </>
        )}
        {activeMenu === "mse" && (
          <>
            <DashboardMSE
              onAddForm={() => setShowFormMSE(true)}
              onAddUpload={() => setShowUploadMSE(true)}
              onView={setSelectedMSE}
              onCompare={(d) => {
                setCompareDataMSE(d);
                setShowCompareMSE(true);
              }}
            />
            {showFormMSE && (
              <FormModalMSE onClose={() => setShowFormMSE(false)} />
            )}
            {showUploadMSE && (
              <UploadModalMSE onClose={() => setShowUploadMSE(false)} />
            )}
            {selectedMSE && (
              <DetailModalMSE
                data={selectedMSE}
                onClose={() => setSelectedMSE(null)}
              />
            )}
            {showCompareMSE && (
              <FormModalComparisonMSE
                data={compareDataMSE}
                onClose={() => setShowCompareMSE(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
