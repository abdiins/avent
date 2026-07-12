// src/app/api/check-in/route.ts
// API Route untuk check-in peserta berdasarkan kode tiket.
// Admin memasukkan kode tiket, sistem mengubah status jadi CHECKED_IN.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkInSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    // 1. Hanya Admin yang bisa melakukan check-in
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin yang dapat melakukan check-in." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // 2. Validasi input kode tiket
    const parsed = checkInSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Kode tiket tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { ticketCode } = parsed.data;

    // 3. Cari registrasi berdasarkan kode tiket
    const registration = await prisma.registration.findUnique({
      where: { ticketCode },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { name: true } },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Kode tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    // 4. Cek apakah sudah pernah check-in (mencegah check-in ganda)
    if (registration.status === "CHECKED_IN") {
      return NextResponse.json(
        {
          error: "Peserta sudah check-in sebelumnya",
          registration,
        },
        { status: 409 }
      );
    }

    // 5. Update status menjadi CHECKED_IN
    const updated = await prisma.registration.update({
      where: { ticketCode },
      data: { status: "CHECKED_IN" },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { name: true } },
      },
    });

    return NextResponse.json({
      message: "Check-in berhasil!",
      registration: updated,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan check-in" },
      { status: 500 }
    );
  }
}
