// src/app/admin/events/create/page.tsx
// Form untuk membuat event baru (Admin only).
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    quota: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quota: parseInt(form.quota),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat event");
        return;
      }

      router.push("/admin/events");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1>✨ Buat Event Baru</h1>
        <p>Isi form di bawah untuk membuat event.</p>
      </div>

      <div className="card animate-fade-in">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nama Event</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Contoh: Workshop Web Development"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Deskripsi</label>
            <textarea
              id="description"
              className="form-input"
              placeholder="Jelaskan detail event Anda..."
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="date" className="form-label">Tanggal</label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time" className="form-label">Waktu</label>
              <input
                id="time"
                type="time"
                className="form-input"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">Lokasi</label>
            <input
              id="location"
              type="text"
              className="form-input"
              placeholder="Contoh: Aula Kampus Gedung A"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quota" className="form-label">Kuota Peserta</label>
            <input
              id="quota"
              type="number"
              className="form-input"
              placeholder="Contoh: 100"
              min={1}
              value={form.quota}
              onChange={(e) => setForm({ ...form, quota: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Buat Event"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.back()}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
