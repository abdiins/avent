// src/components/providers/SessionProvider.tsx
// Wrapper untuk NextAuth SessionProvider agar bisa dipakai di App Router.
// Harus dibuat sebagai Client Component ("use client") karena menggunakan React Context.
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
