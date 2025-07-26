import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const initialMeta = {
  nama: "",
  usaha: "",
  hp: "",
  desa: "",
  kota: "",
  estate: "",
  cdo: "Emisba DT.Bagindo ratu",
};

export default function SignUpForm() {
  const [meta, setMeta] = useState(initialMeta);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = `${meta.hp}@umkm.local`;

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await set(ref(db, `users/${uid}`), {
        nama: meta.nama,
        usaha: meta.usaha,
        hp: meta.hp,
        desa: meta.desa,
        kota: meta.kota,
        estate: meta.estate,
        cdo: meta.cdo,
        createdAt: Date.now(),
      });

      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Registrasi gagal. Silakan coba lagi.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage =
          "Nomor HP ini sudah terdaftar. Silakan login atau gunakan nomor lain.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Format nomor HP tidak valid.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah. Minimal 6 karakter.";
      }
      setError(errorMessage);
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = (key) => {
    switch (key) {
      case "nama":
        return "Nama Lengkap UMKM";
      case "usaha":
        return "Nama Usaha / Produk";
      case "hp":
        return "No. HP / WA Mitra";
      case "desa":
        return "Desa";
      case "kota":
        return "Kota / Kabupaten";
      case "estate":
        return "Estate";
      case "cdo":
        return "CDO";
      default:
        return key;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
    >
      {error && (
        <p
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm col-span-full"
          role="alert"
        >
          {error}
        </p>
      )}

      {Object.entries(initialMeta).map(([key]) => (
        <div key={key} className="flex flex-col">
          <label
            htmlFor={key}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {getLabel(key)}
          </label>
          <input
            type={key === "hp" ? "tel" : "text"}
            id={key}
            name={key}
            value={meta[key]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out sm:text-sm"
            placeholder={
              key === "hp"
                ? "Contoh: 081234567890"
                : `Masukkan ${getLabel(key).toLowerCase()}`
            }
            required
            disabled={loading}
          />
        </div>
      ))}

      <div className="flex flex-col col-span-full">
        {" "}
        {}
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out sm:text-sm"
          placeholder="Minimal 6 karakter"
          required
          disabled={loading}
        />
      </div>

      <div className="col-span-full flex justify-end pt-2">
        {" "}
        {}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
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
            "Daftar"
          )}
        </button>
      </div>
    </form>
  );
}
