import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardBook from "./components/bookkeeping/DashboardBook";
import FormModalMSE from "./components/bookkeeping/FormModalBook";

export default function App() {
  const { user, loading, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Memuat data...
      </div>
    );
  }

  return (
    <Router>
      <div>
        <main>
          <div className="bg-white ">
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
          </div>
        </main>
      </div>
    </Router>
  );
}
