// src/app/api/auth/[...nextauth]/route.ts
// Handler NextAuth.js — route ini menangani semua request autentikasi
// (login, logout, session check, dll) secara otomatis.
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
