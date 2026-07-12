// src/lib/validations.ts
// Skema validasi Zod untuk semua form input di aplikasi.
// Digunakan di sisi server (API routes) untuk memastikan data yang masuk valid.
import { z } from "zod/v4";

// ============================================================
// AUTH SCHEMAS
// ============================================================

// Validasi form register
export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["ADMIN", "PESERTA"]).default("PESERTA"),
});

// Validasi form login
export const loginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// ============================================================
// EVENT SCHEMAS
// ============================================================

// Validasi form buat/edit event
export const eventSchema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.string().min(1, "Tanggal wajib diisi"), // format YYYY-MM-DD dari input date
  time: z.string().min(1, "Waktu wajib diisi"),   // format HH:MM dari input time
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  quota: z.coerce.number().int().min(1, "Kuota minimal 1 orang"),
});

// ============================================================
// REGISTRATION / CHECK-IN SCHEMAS
// ============================================================

// Validasi pendaftaran event
export const registrationSchema = z.object({
  eventId: z.string().min(1, "Event ID wajib diisi"),
});

// Validasi check-in (input kode tiket)
export const checkInSchema = z.object({
  ticketCode: z.string().min(1, "Kode tiket wajib diisi"),
});

// ============================================================
// TYPE EXPORTS
// ============================================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type CheckInInput = z.infer<typeof checkInSchema>;
