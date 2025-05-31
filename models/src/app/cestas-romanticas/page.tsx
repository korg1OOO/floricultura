import type { Metadata } from "next";
import CestasRomanticasClient from "./CestasRomanticasClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cestas Românticas - Flor de Lima",
    description: "Compre cestas românticas na Flor de Lima para surpreender quem você ama.",
    keywords: "cestas, romântico, presentes, Flor de Lima",
    openGraph: {
      title: "Cestas Românticas - Flor de Lima",
      description: "Compre cestas românticas na Flor de Lima para surpreender quem você ama.",
      url: "https://yourdomain.com/cestas-romanticas",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/2041323605.png"],
    },
  };
}

export default function CestasRomanticasPage() {
  return <CestasRomanticasClient />;
}