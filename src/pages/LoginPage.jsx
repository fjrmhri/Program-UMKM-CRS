import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import logo from "../assets/logo.PNG";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Logo Perusahaan"
            className="mx-auto h-20 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Selamat Datang
          </h1>
          <p className="text-gray-600 text-sm">
            Silakan masuk untuk melanjutkan
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-600 font-medium transition"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
