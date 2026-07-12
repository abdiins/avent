// src/app/login/page.tsx
// Halaman login menggunakan NextAuth signIn().
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // signIn dari NextAuth — redirect: false agar kita handle sendiri
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        return;
      }

      // Login berhasil, redirect ke halaman utama
      router.push("/");
      router.refresh(); // Refresh untuk update session di server components
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <h1 className="gradient-text">Masuk</h1>
        <p>Login untuk mengakses event dan tiket Anda.</p>

        {registered && (
          <div className="alert alert-success">
            Registrasi berhasil! Silakan login.
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="contoh@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Belum punya akun?{" "}
          <Link href="/register">Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
}

// Wrapper dengan Suspense karena useSearchParams membutuhkannya di App Router
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="loading-spinner"><div className="spinner" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
