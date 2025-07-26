import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import logo from "../assets/logo.PNG";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Logo Perusahaan"
            className="mx-auto h-20 w-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang
          </h1>
          <p className="text-gray-600">Silakan masuk untuk melanjutkan</p>
        </div>
        <LoginForm />
        {}
        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <a
            href="/signup"
            className="text-green-600 hover:underline font-medium"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
