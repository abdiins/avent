// src/types/next-auth.d.ts
// Augmentasi tipe NextAuth agar TypeScript mengenali field custom (id, role)
// yang kita tambahkan ke session dan JWT token.
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
