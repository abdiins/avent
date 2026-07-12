// src/components/layout/Navbar.tsx
// Komponen navigasi utama yang responsif.
// Menampilkan menu berbeda berdasarkan role user (Admin / Peserta / belum login).
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo: teks 'avent' di halaman lain, disembunyikan di halaman utama */}
        {pathname !== "/" ? (
          <Link href="/" className="navbar-logo navbar-brand-text" aria-label="Beranda">
            avent
          </Link>
        ) : (
          <div style={{ width: '48px' }}></div>
        )}

        {/* Hamburger button untuk mobile */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Menu navigasi */}
        <div className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          <Link href="/events" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Jelajahi Event
          </Link>

          {/* Menu khusus Admin */}
          {session?.user?.role === "ADMIN" && (
            <>
              <Link href="/admin/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link href="/admin/events" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Kelola Event
              </Link>
              <Link href="/admin/check-in" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Check-in
              </Link>
            </>
          )}

          {/* Menu khusus Peserta */}
          {session?.user?.role === "PESERTA" && (
            <Link href="/user/tickets" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Tiket Saya
            </Link>
          )}

          {/* Auth buttons */}
          {session ? (
            <div className="nav-auth">
              <span className="nav-user">
                {session.user.name}
                <span className={`role-badge ${session.user.role === "ADMIN" ? "admin" : "peserta"}`}>
                  {session.user.role}
                </span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-outline btn-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link href="/login" className="btn btn-outline btn-sm" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
