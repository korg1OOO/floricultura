"use client";

import Header from "@/components/Header";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";

const breakfastBasketProducts = allProducts.filter((product) =>
  product.category.includes("cestas-de-cafe-da-manha-bh")
);

export default function CestasDeCafeDaManhaBHClient() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <ProductSection title="Cestas de Café da Manhã BH" products={breakfastBasketProducts} />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}