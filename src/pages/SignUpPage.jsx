import React from "react";
import SignUpForm from "../components/Auth/SignUpForm";
import logo from "../assets/logo.PNG";

export default function SignUpPage() {
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
            Daftar Akun Baru
          </h1>
          <p className="text-gray-600">Isi data Anda untuk membuat akun</p>
        </div>
        <SignUpForm />
        {}
        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <a href="/" className="text-green-600 hover:underline font-medium">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
}
