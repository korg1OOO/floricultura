import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Flor de Lima",
  description: "Finalize sua compra na Flor de Lima.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Carregando checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}