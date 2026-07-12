// src/app/admin/dashboard/page.tsx
// Dashboard Admin — statistik ringkasan semua event.
// Menampilkan total event, total pendaftar, total hadir, dan chart per event.
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface EventStat {
  id: string;
  name: string;
  date: string;
  quota: number;
  totalRegistered: number;
  totalCheckedIn: number;
}

interface StatsData {
  stats: EventStat[];
  summary: {
    totalEvents: number;
    totalRegistrations: number;
    totalCheckedIn: number;
  };
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proteksi route: hanya admin
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Gagal mengambil statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Dashboard Admin</h1>
        <p>Ringkasan statistik seluruh event Anda.</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in">
          <div className="stat-label">Total Event</div>
          <div className="stat-value">{data.summary.totalEvents}</div>
        </div>
        <div className="stat-card animate-fade-in">
          <div className="stat-label">Total Pendaftar</div>
          <div className="stat-value">{data.summary.totalRegistrations}</div>
        </div>
        <div className="stat-card animate-fade-in">
          <div className="stat-label">Total Hadir (Check-in)</div>
          <div className="stat-value">{data.summary.totalCheckedIn}</div>
        </div>
      </div>

      {/* Chart per Event */}
      {data.stats.length > 0 ? (
        <div className="chart-container animate-fade-in">
          <h3 className="chart-title">Pendaftar vs Hadir per Event</h3>
          <div className="chart-bars">
            {data.stats.map((event) => {
              const regPercent =
                event.quota > 0
                  ? Math.min((event.totalRegistered / event.quota) * 100, 100)
                  : 0;
              const checkinPercent =
                event.quota > 0
                  ? Math.min((event.totalCheckedIn / event.quota) * 100, 100)
                  : 0;

              return (
                <div key={event.id}>
                  <div className="chart-bar-row">
                    <div className="chart-bar-label" title={event.name}>
                      {event.name}
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill registered"
                        style={{ width: `${Math.max(regPercent, 2)}%` }}
                      >
                        {event.totalRegistered}
                      </div>
                    </div>
                  </div>
                  <div className="chart-bar-row">
                    <div className="chart-bar-label" style={{ opacity: 0 }}>
                      –
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill checked-in"
                        style={{ width: `${Math.max(checkinPercent, 2)}%` }}
                      >
                        {event.totalCheckedIn}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="chart-legend">
            <div className="chart-legend-item">
              <div
                className="chart-legend-dot"
                style={{ background: "var(--accent-primary)" }}
              />
              Pendaftar
            </div>
            <div className="chart-legend-item">
              <div
                className="chart-legend-dot"
                style={{ background: "var(--accent-success)" }}
              />
              Hadir (Check-in)
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Belum Ada Data</h3>
          <p>Buat event terlebih dahulu untuk melihat statistik.</p>
        </div>
      )}
    </div>
  );
}
