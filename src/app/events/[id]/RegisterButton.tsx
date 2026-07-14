// src/app/events/[id]/RegisterButton.tsx
// Client Component — tombol untuk mendaftar ke event.
// Menghandle berbagai state: belum login, sudah daftar, kuota penuh, dll.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterButtonProps {
  eventId: string;
  isLoggedIn: boolean;
  isRegistered: boolean;
  isFull: boolean;
  isPeserta: boolean;
}

export default function RegisterButton({
  eventId,
  isLoggedIn,
  isRegistered,
  isFull,
  isPeserta,
}: RegisterButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Jika belum login, tampilkan link ke login
  if (!isLoggedIn) {
    return (
      <Link href="/login" className="btn btn-primary btn-full">
        Login untuk Mendaftar
      </Link>
    );
  }

  // Jika bukan peserta (admin), tidak bisa mendaftar ke event
  if (!isPeserta) {
    return (
      <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
        Admin tidak dapat mendaftar ke event.
      </div>
    );
  }

  // Jika sudah terdaftar
  if (isRegistered) {
    return (
      <div className="alert alert-success" style={{ margin: 0 }}>
        ✅ Anda sudah terdaftar di event ini. Lihat tiket Anda di halaman{" "}
        <Link href="/user/tickets" style={{ color: "var(--accent-success)", fontWeight: 600 }}>
          Tiket Saya
        </Link>
        .
      </div>
    );
  }

  // Jika kuota penuh
  if (isFull) {
    return (
      <button className="btn btn-danger btn-full" disabled>
        Kuota Penuh
      </button>
    );
  }

  // Fungsi pendaftaran
  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();

      if (!res.ok) {
        const detailMsg = data.details
          ? data.details.map((d: { path?: string[]; message: string }) =>
              `${d.path?.join(".") ?? ""}: ${d.message}`
            ).join("\n")
          : "";
        setMessage(detailMsg || data.error || "Pendaftaran gagal");
        return;
      }

      // Berhasil — redirect ke halaman tiket
      router.push("/user/tickets");
      router.refresh();
    } catch {
      setMessage("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div className="alert alert-error" style={{ marginBottom: "0.75rem", whiteSpace: "pre-wrap" }}>
          {message}
        </div>
      )}
      <button
        onClick={handleRegister}
        className="btn btn-primary btn-full btn-lg"
        disabled={loading}
      >
        {loading ? "Mendaftar..." : "Daftar Event Ini"}
      </button>
    </div>
  );
}
