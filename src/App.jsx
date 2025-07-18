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
      <header className="py-6 bg-white shadow">
        <h1 className="text-3xl font-bold text-center">
          Program Corporate Social Responsibility
        </h1>
        <h5 className="text-2xl text-center">estate cerenti</h5>
      </header>

      {}
      <nav className="bg-white shadow mb-6">
        <ul className="flex justify-center space-x-4 py-2 text-lg">
          <li
            className={`px-4 py-2 cursor-pointer ${
              activeMenu === "analytics"
                ? "border-b-4 border-blue-500 font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveMenu("analytics")}
          >
            Analisis Pre‑Post Test
          </li>
          <li
            className={`px-4 py-2 cursor-pointer ${
              activeMenu === "todo"
                ? "border-b-4 border-blue-500 font-semibold text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveMenu("todo")}
          >
            To‑Do List
          </li>
        </ul>
      </nav>

      <main className="max-w-5xl mx-auto px-4">
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
