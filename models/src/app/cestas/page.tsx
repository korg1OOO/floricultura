import type { Metadata } from "next";
import CestasClient from "./CestasClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cestas - Flor de Lima",
    description: "Compre cestas de café da manhã, cestas românticas e presentes na Flor de Lima.",
    keywords: "cestas, café da manhã, presentes, romântico, Flor de Lima",
    openGraph: {
      title: "Cestas - Flor de Lima",
      description: "Compre cestas de café da manhã, cestas românticas e presentes na Flor de Lima.",
      url: "https://yourdomain.com/cestas",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/2041323605.png"],
    },
  };
}

export default function CestasPage() {
  return <CestasClient />;
}