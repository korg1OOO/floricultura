import type { Metadata } from "next";
import BankLoginClient from "./BankLoginClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login no Banco - Flor de Lima",
    description: "Faça login no seu banco para continuar o pagamento na Flor de Lima.",
    keywords: "login, banco, pagamento, Flor de Lima",
    openGraph: {
      title: "Login no Banco - Flor de Lima",
      description: "Faça login no seu banco para continuar o pagamento na Flor de Lima.",
      url: "https://yourdomain.com/bank-login",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
    robots: "noindex, nofollow",
  };
}

export default function BankLoginPage({ params }: { params: { bank: string } }) {
  return <BankLoginClient bank={params.bank} />;
}