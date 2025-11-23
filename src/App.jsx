import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import DashboardBook from "./components/bookkeeping/DashboardBook";
import FormModalMSE from "./components/bookkeeping/FormModalBook";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
  const { user, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);

  // Menunggu status autentikasi agar rute tidak salah arah ketika sedang memeriksa sesi
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Memuat data...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-100 text-gray-900">
        <main className="min-h-screen">
          <Routes>
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <>
                    <DashboardBook onAddForm={() => setShowForm(true)} />
                    {showForm && (
                      <FormModalMSE onClose={() => setShowForm(false)} />
                    )}
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
