// /src/app/layout.tsx
export const dynamic = "force-dynamic";
export const dynamicParams = false;

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: [
    {
      path: "../../public/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    {
      path: "../../public/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
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
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}