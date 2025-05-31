import type { Metadata } from "next";
import DatasComemorativasClient from "./DatasComemorativasClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Datas Comemorativas - Flor de Lima",
    description: "Encontre presentes perfeitos para datas comemorativas na Flor de Lima, como buquês e cestas.",
    keywords: "datas comemorativas, buquês, cestas, presentes, Flor de Lima",
    openGraph: {
      title: "Datas Comemorativas - Flor de Lima",
      description: "Encontre presentes perfeitos para datas comemorativas na Flor de Lima.",
      url: "https://yourdomain.com/datas-comemorativas",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/2041323605.png"],
    },
  };
}

export default function DatasComemorativasPage() {
  return <DatasComemorativasClient />;
}