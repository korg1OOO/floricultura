import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Checkout - Flor de Lima",
    description: "Finalize sua compra na Flor de Lima e surpreenda com presentes incríveis.",
    keywords: "checkout, carrinho, Flor de Lima",
    openGraph: {
      title: "Checkout - Flor de Lima",
      description: "Finalize sua compra na Flor de Lima e surpreenda com presentes incríveis.",
      url: "https://yourdomain.com/checkout",
      type: "website",
      images: ["https://ext.same-assets.com/1148377775/3402056874.png"],
    },
    robots: "noindex, nofollow",
  };
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}