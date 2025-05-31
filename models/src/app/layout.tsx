import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flor de Lima - Buquês, Cestas e Flores",
  description: "Compre buquês, cestas de café da manhã e flores frescas na Flor de Lima. Presentes perfeitos para todas as ocasiões.",
  keywords: "buquês, cestas, flores, café da manhã, presentes, romântico, Flor de Lima",
  openGraph: {
    title: "Flor de Lima - Buquês, Cestas e Flores",
    description: "Compre buquês, cestas de café da manhã e flores frescas na Flor de Lima.",
    url: "https://yourdomain.com",
    type: "website",
    images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}