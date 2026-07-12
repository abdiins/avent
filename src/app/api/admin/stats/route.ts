// src/app/api/admin/stats/route.ts
// API Route untuk statistik dashboard admin.
// Mengembalikan ringkasan jumlah pendaftar vs jumlah hadir per event.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Hanya Admin yang bisa mengakses statistik
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    // Ambil semua event beserta hitungan registrasi & check-in
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        date: true,
        quota: true,
        registrations: {
          select: { status: true },
        },
      },
      orderBy: { date: "asc" },
    });

    // Proses data menjadi ringkasan statistik
    const stats = events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date,
      quota: event.quota,
      totalRegistered: event.registrations.length,
      totalCheckedIn: event.registrations.filter(
        (r) => r.status === "CHECKED_IN"
      ).length,
    }));

    // Hitung total keseluruhan
    const summary = {
      totalEvents: events.length,
      totalRegistrations: stats.reduce((sum, e) => sum + e.totalRegistered, 0),
      totalCheckedIn: stats.reduce((sum, e) => sum + e.totalCheckedIn, 0),
    };

    return NextResponse.json({ stats, summary });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 }
    );
  }
}
