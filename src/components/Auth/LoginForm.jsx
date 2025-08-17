import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = `${phone}@umkm.local`;

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        setError("Data UMKM tidak ditemukan. Silakan hubungi administrator.");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Login gagal. Pastikan nomor HP dan password benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <p className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm">
          {error}
        </p>
      )}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          No. HP / WA Mitra
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-900 placeholder-gray-400 text-sm transition"
          placeholder="Contoh: 081234567890"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 text-gray-900 placeholder-gray-400 text-sm transition"
          placeholder="Masukkan password Anda"
          required
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="w-full h-10 px-4 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
