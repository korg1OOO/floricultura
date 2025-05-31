import type { Metadata } from "next";
import CestasDeCafeDaManhaBHClient from "./CestasDeCafeDaManhaBHClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cestas de Café da Manhã BH - Flor de Lima",
    description: "Compre cestas de café da manhã em BH na Flor de Lima, perfeitas para surpreender.",
    keywords: "cestas, café da manhã, BH, presentes, Flor de Lima",
    openGraph: {
      title: "Cestas de Café da Manhã BH - Flor de Lima",
      description: "Compre cestas de café da manhã em BH na Flor de Lima, perfeitas para surpreender.",
      url: "https://yourdomain.com/cestas-de-cafe-da-manha-bh",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/2041323605.png"],
    },
  };
}

export default function CestasDeCafeDaManhaBHPage() {
  return <CestasDeCafeDaManhaBHClient />;
}