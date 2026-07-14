// src/app/page.tsx
// Landing page — halaman utama EventFlow.
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const events = await prisma.event.findMany({
    take: 6,
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: { date: "asc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content animate-fade-in">
            <div className="hero-brand">
              <span className="hero-brand-text">avent</span>
            </div>
            <h1>
              Acara<br />
              menyenangkan<br />
              <span className="text-luma-start">dimulai</span>{" "}
              <span className="text-luma-here">di sini.</span>
            </h1>
            <p>
              Buat halaman acara, undang teman-teman dan jual tiket dan Selenggarakan acara yang berkesan hari ini.
            </p>
            <div className="hero-buttons">
              <Link href="/events" className="btn btn-primary btn-lg">
                Buat Acara Pertama Anda
              </Link>
            </div>
          </div>

          <div className="hero-image-wrapper animate-fade-in">
            <video
              src="/phone-dark.webm"
              autoPlay
              loop
              muted
              playsInline
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Event Terbaru */}
      <section className="page-container">
        <div className="page-header">
          <h2>Acara Mendatang</h2>
          <p>Temukan dan daftar ke acara yang menarik bagi Anda.</p>
        </div>

        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => {
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
                    <div className="event-meta-item">
                      🕐 {event.time} WIB
                    </div>
                    <div className="event-meta-item">
                      📍 {event.location}
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
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
            <div className="empty-icon">✨</div>
            <h3>Belum Ada Acara</h3>
            <p>Jadilah yang pertama membuat acara berkesan!</p>
          </div>
        )}
      </section>
    </>
  );
}
