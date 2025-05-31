"use client";

import Header from "@/components/Header";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";

const basketProducts = allProducts.filter((product) =>
  product.category.includes("cestas")
);

export default function CestasClient() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <ProductSection title="Cestas" products={basketProducts} />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}