import React from "react";
import SignUpForm from "../components/Auth/SignUpForm";
import logo from "../assets/logo.PNG";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl border border-gray-200">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Logo Perusahaan"
            className="mx-auto h-20 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Daftar Akun Baru
          </h1>
          <p className="text-gray-600 text-sm">
            Isi data Anda untuk membuat akun
          </p>
        </div>
        <SignUpForm />
        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 font-medium transition"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
