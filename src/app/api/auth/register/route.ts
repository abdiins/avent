// src/app/api/auth/register/route.ts
// API Route untuk registrasi akun baru.
// Memvalidasi input dengan Zod, hash password dengan bcrypt, dan simpan ke database.
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validasi input menggunakan Zod schema
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // 3. Hash password menggunakan bcrypt (salt rounds = 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Buat user baru di database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as "ADMIN" | "PESERTA",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
