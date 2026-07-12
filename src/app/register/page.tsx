// src/app/register/page.tsx
// Halaman registrasi akun baru.
// Peserta dan Admin bisa mendaftar dari form ini.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PESERTA",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrasi gagal");
        return;
      }

      // Redirect ke login setelah berhasil register
      router.push("/login?registered=true");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <h1 className="gradient-text">Buat Akun</h1>
        <p>Daftar untuk mulai menjelajahi dan mengikuti event.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

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
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Daftar Sebagai</label>
            <select
              id="role"
              className="form-input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="PESERTA">Peserta</option>
              <option value="ADMIN">Admin / Panitia</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun?{" "}
          <Link href="/login">Login di sini</Link>
        </div>
      </div>
    </div>
  );
}
