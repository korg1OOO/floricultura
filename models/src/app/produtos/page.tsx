import type { Metadata } from "next";
import ProdutosClient from "./ProdutosClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Todos os Produtos - Flor de Lima",
    description: "Explore todos os produtos da Flor de Lima, incluindo buquês, cestas de café da manhã, flores e presentes românticos.",
    keywords: "buquês, cestas, flores, presentes, Flor de Lima, café da manhã, romântico",
    openGraph: {
      title: "Todos os Produtos - Flor de Lima",
      description: "Compre buquês, cestas de café da manhã e flores frescas na Flor de Lima.",
      url: "https://yourdomain.com/produtos",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
  };
}

export default function ProdutosPage() {
  return <ProdutosClient />;
}