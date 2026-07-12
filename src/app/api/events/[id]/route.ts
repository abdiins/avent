// src/app/api/events/[id]/route.ts
// API Route untuk operasi pada satu event spesifik.
// GET    — detail event + daftar pendaftar
// PUT    — update event (admin)
// DELETE — hapus event (admin)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { eventSchema } from "@/lib/validations";

// GET: Detail satu event beserta data pendaftar
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true } },
        registrations: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { registeredAt: "desc" },
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Get event detail error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail event" },
      { status: 500 }
    );
  }
}

// PUT: Update event (hanya Admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validasi input
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, description, date, time, location, quota } = parsed.data;

    const event = await prisma.event.update({
      where: { id },
      data: {
        name,
        description,
        date: new Date(date),
        time,
        location,
        quota,
      },
    });

    return NextResponse.json({ message: "Event berhasil diupdate", event });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate event" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus event beserta semua registrasi terkait (hanya Admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Hapus registrasi terkait dulu (karena foreign key), lalu hapus event
    await prisma.registration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ message: "Event berhasil dihapus" });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus event" },
      { status: 500 }
    );
  }
}
