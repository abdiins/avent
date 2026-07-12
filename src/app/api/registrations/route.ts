// src/app/api/registrations/route.ts
// API Route untuk pendaftaran peserta ke event.
// POST — peserta mendaftar ke event (dengan validasi kuota dan duplikasi).
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { registrationSchema } from "@/lib/validations";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    // 1. Cek autentikasi — hanya user yang login bisa mendaftar
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Anda harus login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 2. Validasi input
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { eventId } = parsed.data;
    const userId = session.user.id;

    // 3. Cek apakah event ada
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    // 4. Validasi kuota — pastikan masih ada slot tersedia
    if (event._count.registrations >= event.quota) {
      return NextResponse.json(
        { error: "Kuota event sudah penuh" },
        { status: 400 }
      );
    }

    // 5. Cek apakah user sudah terdaftar di event ini
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Anda sudah terdaftar di event ini" },
        { status: 409 }
      );
    }

    // 6. Generate kode tiket unik
    //    Format: EF-<8 karakter uppercase dari UUID>
    //    Contoh: EF-A1B2C3D4
    const ticketCode = `EF-${randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase()}`;

    // 7. Buat registrasi di database
    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        ticketCode,
      },
      include: {
        event: { select: { name: true, date: true, time: true, location: true } },
      },
    });

    return NextResponse.json(
      { message: "Pendaftaran berhasil", registration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Gagal mendaftar ke event" },
      { status: 500 }
    );
  }
}
