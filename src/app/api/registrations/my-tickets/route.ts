// src/app/api/registrations/my-tickets/route.ts
// API Route untuk mengambil semua tiket milik peserta yang sedang login.
// Digunakan di halaman "Tiket Saya".
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Anda harus login terlebih dahulu" },
        { status: 401 }
      );
    }

    // Ambil semua registrasi milik user yang login, beserta data event
    const tickets = await prisma.registration.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            description: true,
            date: true,
            time: true,
            location: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Get my tickets error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data tiket" },
      { status: 500 }
    );
  }
}
