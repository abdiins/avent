// src/app/admin/events/page.tsx
// Halaman admin untuk mengelola event (list semua event dengan aksi edit/hapus).
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  quota: number;
  _count: { registrations: number };
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetchEvents();
    }
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Gagal mengambil event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus event "${name}"? Semua data pendaftaran juga akan dihapus.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Gagal menghapus event:", error);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1>📋 Kelola Event</h1>
          <p>Buat, edit, dan hapus event Anda.</p>
        </div>
        <Link href="/admin/events/create" className="btn btn-primary">
          + Buat Event Baru
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="table-container animate-fade-in">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Event</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Lokasi</th>
                <th>Pendaftar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td style={{ fontWeight: 600 }}>{event.name}</td>
                  <td>
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{event.time}</td>
                  <td>{event.location}</td>
                  <td>
                    <span style={{ color: event._count.registrations >= event.quota ? "var(--accent-danger)" : "var(--text-primary)" }}>
                      {event._count.registrations}/{event.quota}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.name)}
                        className="btn btn-danger btn-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Belum Ada Event</h3>
          <p>
            Mulai dengan{" "}
            <Link href="/admin/events/create" style={{ color: "var(--accent-primary-light)" }}>
              membuat event baru
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
