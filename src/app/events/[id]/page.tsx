// src/app/events/[id]/page.tsx
// Halaman detail event — menampilkan informasi lengkap dan tombol daftar.
// Server Component yang mengambil data event dari database.
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import RegisterButton from "./RegisterButton";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Ambil detail event dari database
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    notFound();
  }

  // Cek session untuk menentukan apakah user sudah login & sudah terdaftar
  const session = await getServerSession(authOptions);
  let isRegistered = false;

  if (session?.user?.id) {
    const existingReg = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: id,
        },
      },
    });
    isRegistered = !!existingReg;
  }

  const isFull = event._count.registrations >= event.quota;

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <div className="animate-fade-in">
        {/* Header Event */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            {event.name}
          </h1>

          <div className="event-meta" style={{ fontSize: "0.9375rem" }}>
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
            <div className="event-meta-item">
              👤 Diselenggarakan oleh {event.createdBy.name}
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Tentang Event
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {event.description}
          </p>
        </div>

        {/* Info Kuota & Tombol Daftar */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                Kuota Peserta
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                <span style={{ color: isFull ? "var(--accent-danger)" : "var(--accent-primary-light)" }}>
                  {event._count.registrations}
                </span>
                <span style={{ color: "var(--text-muted)" }}> / {event.quota}</span>
              </div>
            </div>

            {/* Progress bar kuota */}
            <div style={{ width: 120 }}>
              <div className="quota-indicator" style={{ width: "100%", height: 8 }}>
                <div
                  className="quota-fill"
                  style={{
                    width: `${Math.min((event._count.registrations / event.quota) * 100, 100)}%`,
                    background: isFull ? "var(--accent-danger)" : "var(--accent-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tombol Daftar — Client Component */}
          <RegisterButton
            eventId={event.id}
            isLoggedIn={!!session}
            isRegistered={isRegistered}
            isFull={isFull}
            isPeserta={session?.user?.role === "PESERTA"}
          />
        </div>
      </div>
    </div>
  );
}
