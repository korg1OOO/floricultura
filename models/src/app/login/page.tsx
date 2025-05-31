import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login - Flor de Lima",
    description: "Faça login na sua conta Flor de Lima para gerenciar pedidos e favoritos.",
    keywords: "login, conta, Flor de Lima",
    openGraph: {
      title: "Login - Flor de Lima",
      description: "Faça login na sua conta Flor de Lima para gerenciar pedidos e favoritos.",
      url: "https://yourdomain.com/login",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
    robots: "noindex, nofollow",
  };
}

export default function LoginPage() {
  return <LoginClient />;
}