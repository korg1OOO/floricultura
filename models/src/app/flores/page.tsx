import type { Metadata } from "next";
import FloresClient from "./FloresClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Flores - Flor de Lima",
    description: "Explore arranjos de flores frescas e únicas na Flor de Lima.",
    keywords: "flores, arranjos, presentes, Flor de Lima",
    openGraph: {
      title: "Flores - Flor de Lima",
      description: "Explore arranjos de flores frescas e únicas na Flor de Lima.",
      url: "https://yourdomain.com/flores",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3510166492.png"],
    },
  };
}

export default function FloresPage() {
  return <FloresClient />;
}