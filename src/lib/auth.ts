// src/lib/auth.ts
// Konfigurasi NextAuth.js menggunakan Credentials Provider.
// Menggunakan bcrypt untuk verifikasi password dan Prisma untuk query user.
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Menggunakan session berbasis JWT (tanpa database session)
  session: {
    strategy: "jwt",
  },

  // Halaman custom untuk login
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Fungsi authorize dipanggil saat user login.
      // Mencocokkan email & password dari database.
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Email atau password salah");
        }

        // Bandingkan password yang diinput dengan hash di database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        // Return objek user (tanpa passwordHash) untuk disimpan di JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Callback JWT: menyimpan data tambahan (id, role) ke dalam token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },

    // Callback Session: mengekspos data dari JWT ke session yang bisa
    // diakses di client-side via useSession()
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },

  // Secret untuk enkripsi JWT — wajib diset di environment variable
  secret: process.env.NEXTAUTH_SECRET,
};
