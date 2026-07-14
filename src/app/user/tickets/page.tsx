// src/app/user/tickets/page.tsx
// Halaman "Tiket Saya" — menampilkan semua tiket milik peserta yang login.
// Setiap tiket ditampilkan dengan QR Code yang bisa di-scan saat check-in.
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface Ticket {
  id: string;
  ticketCode: string;
  status: string;
  registeredAt: string;
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
  };
}

export default function MyTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proteksi route: hanya peserta yang bisa mengakses halaman ini
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "PESERTA") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      (async () => {
        try {
          const res = await fetch("/api/registrations/my-tickets");
          const data = await res.json();
          setTickets(data);
        } catch (error) {
          console.error("Gagal mengambil tiket:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [status, session, router]);

  if (loading || status === "loading") {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <h1><span style={{ WebkitTextFillColor: "initial" }}>🎫</span> Tiket Saya</h1>
        <p>Semua tiket event yang Anda ikuti.</p>
      </div>

      {tickets.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card animate-fade-in">
              <div className="ticket-header">
                <h3>{ticket.event.name}</h3>
                <div className="event-meta">
                  <div className="event-meta-item">
                    📅{" "}
                    {new Date(ticket.event.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="event-meta-item">
                    🕐 {ticket.event.time} WIB
                  </div>
                  <div className="event-meta-item">
                    📍 {ticket.event.location}
                  </div>
                </div>
              </div>
              <div className="ticket-body">
                {/* QR Code berisi kode tiket */}
                <div className="ticket-qr">
                  <QRCodeSVG value={ticket.ticketCode} size={120} />
                </div>
                <div className="ticket-info">
                  <div className="ticket-code">{ticket.ticketCode}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                    Terdaftar:{" "}
                    {new Date(ticket.registeredAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <span
                    className={`status-badge ${
                      ticket.status === "CHECKED_IN" ? "checked-in" : "registered"
                    }`}
                  >
                    {ticket.status === "CHECKED_IN" ? "✅ Sudah Hadir" : "🎟️ Terdaftar"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h3>Belum Ada Tiket</h3>
          <p>
            Anda belum mendaftar ke event apapun.{" "}
            <Link href="/events" style={{ color: "var(--accent-primary-light)" }}>
              Jelajahi event
            </Link>{" "}
            dan daftar sekarang!
          </p>
        </div>
      )}
    </div>
  );
}
