// src/app/events/page.tsx
// Halaman publik yang menampilkan semua event yang tersedia.
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Selalu fetch data terbaru

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      _count: { select: { registrations: true } },
      createdBy: { select: { name: true } },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="gradient-text">Semua Event</h1>
        <p>Temukan event menarik dan daftar sekarang.</p>
      </div>

      {events.length > 0 ? (
        <div className="events-grid">
          {events.map((event) => {
            const percentage =
              event.quota > 0
                ? Math.min(
                    (event._count.registrations / event.quota) * 100,
                    100
                  )
                : 0;
            const isFull = event._count.registrations >= event.quota;

            return (
              <div key={event.id} className="event-card animate-fade-in">
                <h3>
                  <Link href={`/events/${event.id}`}>{event.name}</Link>
                </h3>
                <div className="event-meta">
                  <div className="event-meta-item">
                    📅{" "}
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="event-meta-item">🕐 {event.time} WIB</div>
                  <div className="event-meta-item">📍 {event.location}</div>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-footer">
                  <div className="quota-bar">
                    <div className="quota-indicator">
                      <div
                        className="quota-fill"
                        style={{
                          width: `${percentage}%`,
                          background: isFull
                            ? "var(--accent-danger)"
                            : "var(--accent-primary)",
                        }}
                      />
                    </div>
                    <span style={{ color: isFull ? "var(--accent-danger)" : "var(--text-secondary)" }}>
                      {event._count.registrations}/{event.quota}
                      {isFull && " (Penuh)"}
                    </span>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Belum Ada Event</h3>
          <p>Belum ada event yang tersedia saat ini.</p>
        </div>
      )}
    </div>
  );
}
