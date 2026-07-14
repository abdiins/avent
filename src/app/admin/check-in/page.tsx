// src/app/admin/check-in/page.tsx
// Halaman check-in peserta — Admin memasukkan kode tiket secara manual.
// Validasi kode, cegah check-in ganda, dan tampilkan hasil.
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CheckInResult {
  success: boolean;
  message: string;
  registration?: {
    ticketCode: string;
    status: string;
    user: { name: string; email: string };
    event: { name: string };
  };
}

export default function CheckInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode: ticketCode.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          message: data.message,
          registration: data.registration,
        });
        setTicketCode(""); // Reset input setelah berhasil
      } else {
        const detailMsg = data.details
          ? data.details.map((d: { path?: string[]; message: string }) =>
              `${d.path?.join(".") ?? ""}: ${d.message}`
            ).join("\n")
          : "";
        setResult({
          success: false,
          message: detailMsg || data.error,
          registration: data.registration,
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Terjadi kesalahan. Coba lagi.",
      });
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
    <div className="page-container">
      <div className="checkin-container">
        <div className="page-header" style={{ textAlign: "center" }}>
          <h1><span style={{ WebkitTextFillColor: "initial" }}>📱</span> Check-in Peserta</h1>
          <p>Masukkan kode tiket peserta untuk melakukan check-in.</p>
        </div>

        <div className="card animate-fade-in">
          <form onSubmit={handleCheckIn}>
            <div className="form-group">
              <label htmlFor="ticketCode" className="form-label">
                Kode Tiket
              </label>
              <input
                id="ticketCode"
                type="text"
                className="form-input"
                placeholder="Contoh: EF-A1B2C3D4"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                required
                autoFocus
                style={{ fontSize: "0.9375rem", textAlign: "center", letterSpacing: "0.1em", fontFamily: "monospace" }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success btn-full btn-lg"
              disabled={loading || !ticketCode.trim()}
            >
              {loading ? "Memproses..." : "✅ Check-in"}
            </button>
          </form>
        </div>

        {/* Hasil Check-in */}
        {result && (
          <div className={`checkin-result ${result.success ? "success" : "error"}`} style={{ whiteSpace: "pre-wrap" }}>
            <h3>
              {result.success ? "✅ " : "❌ "}
              {result.message}
            </h3>
            {result.registration && (
              <div>
                <div className="detail-row">
                  <span className="detail-label">Nama</span>
                  <span>{result.registration.user.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span>{result.registration.user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Event</span>
                  <span>{result.registration.event.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Kode Tiket</span>
                  <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {result.registration.ticketCode}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span
                    className={`status-badge ${
                      result.registration.status === "CHECKED_IN"
                        ? "checked-in"
                        : "registered"
                    }`}
                  >
                    {result.registration.status === "CHECKED_IN"
                      ? "Sudah Hadir"
                      : "Terdaftar"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
