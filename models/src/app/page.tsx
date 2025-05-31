import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
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
}

export default function Home() {
  return <HomeClient />;
}