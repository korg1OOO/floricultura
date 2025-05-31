import type { Metadata } from "next";
import BuquesEFloresClient from "./BuquesEFloresClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Buquês e Flores - Flor de Lima",
    description: "Compre buquês e flores frescas na Flor de Lima, perfeitos para qualquer ocasião.",
    keywords: "buquês, flores, arranjos, presentes, Flor de Lima",
    openGraph: {
      title: "Buquês e Flores - Flor de Lima",
      description: "Compre buquês e flores frescas na Flor de Lima, perfeitos para qualquer ocasião.",
      url: "https://yourdomain.com/buques-e-flores",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/2369351418.png"],
    },
  };
}

export default function BuquesEFloresPage() {
  return <BuquesEFloresClient />;
}