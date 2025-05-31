"use client";

import Header from "@/components/Header";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";

export default function ProdutosClient() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <ProductSection title="Todos os Produtos" products={allProducts} />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}