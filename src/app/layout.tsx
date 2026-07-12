import type { Metadata } from "next";
import { Inter, Space_Grotesk, Bebas_Neue, Syne } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "avent",
  description:
    "Platform manajemen event dengan pendaftaran peserta dan check-in berbasis kode tiket digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable} ${bebasNeue.variable} ${syne.variable}`}>
      <body>
        <SessionProvider>
          <Navbar />
          <main className="main-content">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
