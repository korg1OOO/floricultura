import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Pesquisa - Flor de Lima",
    description: "Encontre buquês, cestas e flores na Flor de Lima através da nossa pesquisa.",
    keywords: "pesquisa, buquês, cestas, flores, Flor de Lima",
    openGraph: {
      title: "Pesquisa - Flor de Lima",
      description: "Encontre buquês, cestas e flores na Flor de Lima através da nossa pesquisa.",
      url: "https://yourdomain.com/search",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
    robots: "noindex, nofollow",
  };
}

export default function SearchPage() {
  return <SearchClient />;
}