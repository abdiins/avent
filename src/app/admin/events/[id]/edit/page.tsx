// src/app/admin/events/[id]/edit/page.tsx
// Form edit event — prefill data dari database lalu update via API.
"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch data event untuk prefill form
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        if (res.ok) {
          setForm({
            name: data.name,
            description: data.description,
            // Konversi ISO string ke format YYYY-MM-DD untuk input date
            date: new Date(data.date).toISOString().split("T")[0],
            time: data.time,
            location: data.location,
            quota: data.quota.toString(),
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data event:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quota: parseInt(form.quota),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const detailMsg = data.details
          ? data.details.map((d: { path?: string[]; message: string }) =>
              `${d.path?.join(".") ?? ""}: ${d.message}`
            ).join("\n")
          : "";
        setError(detailMsg || data.error || "Gagal mengupdate event");
        return;
      }

      router.push("/admin/events");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || status === "loading") {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1><span style={{ WebkitTextFillColor: "initial" }}>✏️</span> Edit Event</h1>
        <p>Perbarui informasi event di bawah.</p>
      </div>

      <div className="card animate-fade-in">
        {error && (
          <div className="alert alert-error" style={{ whiteSpace: "pre-wrap" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nama Event</label>
            <input
              id="name"
              type="text"
              className="form-input"
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
