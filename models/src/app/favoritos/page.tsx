import type { Metadata } from "next";
import FavoritosClient from "./FavoritosClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Favoritos - Flor de Lima",
    description: "Veja seus produtos favoritos na Flor de Lima e adicione-os ao carrinho.",
    keywords: "favoritos, conta, Flor de Lima",
    openGraph: {
      title: "Favoritos - Flor de Lima",
      description: "Veja seus produtos favoritos na Flor de Lima e adicione-os ao carrinho.",
      url: "https://yourdomain.com/favoritos",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
    robots: "noindex, nofollow",
  };
}

export default function FavoritosPage() {
  return <FavoritosClient />;
}