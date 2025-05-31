import type { Metadata } from "next";
import CadastroClient from "./CadastroClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cadastre-se - Flor de Lima",
    description: "Crie sua conta na Flor de Lima para aproveitar uma experiência personalizada.",
    keywords: "cadastro, conta, Flor de Lima",
    openGraph: {
      title: "Cadastre-se - Flor de Lima",
      description: "Crie sua conta na Flor de Lima para aproveitar uma experiência personalizada.",
      url: "https://yourdomain.com/cadastro",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
    robots: "noindex, nofollow",
  };
}

export default function CadastroPage() {
  return <CadastroClient />;
}