// src/app/api/events/route.ts
// API Route untuk mengelola Event.
// GET  — mengambil semua event (publik)
// POST — membuat event baru (hanya ADMIN)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { eventSchema } from "@/lib/validations";

// GET: Ambil semua event beserta jumlah pendaftar
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        // Hitung jumlah pendaftar dan yang sudah check-in per event
        _count: {
          select: { registrations: true },
        },
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data event" },
      { status: 500 }
    );
  }
}

// POST: Buat event baru (hanya Admin)
export async function POST(request: Request) {
  try {
    // 1. Cek autentikasi dan role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin yang dapat membuat event." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // 2. Validasi input dengan Zod
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, description, date, time, location, quota } = parsed.data;

    // 3. Buat event di database, relasikan dengan admin yang membuat
    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date), // Konversi string tanggal ke DateTime
        time,
        location,
        quota,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Event berhasil dibuat", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "Gagal membuat event" },
      { status: 500 }
    );
  }
}
