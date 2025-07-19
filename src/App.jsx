import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import UploadModal from "./components/UploadModal";
import DetailModal from "./components/DetailModal";
import Todo from "./components/todo/Todo";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("analytics");
  const [showUpload, setShowUpload] = useState(false);
  const [showTodo, setShowTodo] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <header className="py-4 md:py-6 bg-white shadow">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          Program Corporate Social Responsibility
        </h1>
        <h5 className="text-lg sm:text-xl md:text-2xl text-center">
          estate cerenti
        </h5>
      </header>

      {}
      <nav className="bg-white shadow mb-4 md:mb-6">
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-4 py-2 text-base sm:text-lg">
          <li
            className={`px-2 sm:px-4 py-2 cursor-pointer ${
              activeMenu === "analytics"
                ? "border-b-2 sm:border-b-4 border-blue-500 font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveMenu("analytics")}
          >
            Analisis Pre‑Post Test
          </li>
          <li
            className={`px-2 sm:px-4 py-2 cursor-pointer ${
              activeMenu === "todo"
                ? "border-b-2 sm:border-b-4 border-blue-500 font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveMenu("todo")}
          >
            To‑Do List
          </li>
        </ul>
      </nav>

      <main className="container mx-auto px-2 sm:px-4 max-w-5xl">
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

        {}
        {activeMenu === "todo" && <Todo />}
      </main>
    </div>
  );
}
