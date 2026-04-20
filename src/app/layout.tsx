import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Laporan Statistik Deskriptif",
  description:
    "Analisis Statistik Deskriptif Aplikasi - Studi Kuesioner 100 Responden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${jakartaSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
