import type { Metadata } from "next";
import MeusPedidosClient from "./MeusPedidosClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Meus Pedidos - Flor de Lima",
    description: "Acompanhe seus pedidos na Flor de Lima e veja o status de suas compras.",
    keywords: "pedidos, conta, Flor de Lima",
    openGraph: {
      title: "Meus Pedidos - Flor de Lima",
      description: "Acompanhe seus pedidos na Flor de Lima e veja o status de suas compras.",
      url: "https://yourdomain.com/meus-pedidos",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
    robots: "noindex, nofollow",
  };
}

export default function MeusPedidosPage() {
  return <MeusPedidosClient />;
}