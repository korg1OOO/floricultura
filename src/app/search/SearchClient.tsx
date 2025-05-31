"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    if (query) {
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query) ||
          product.category.some((cat) => cat.toLowerCase().includes(query))
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Resultados para "{query || "Todos os Produtos"}"
          </h1>
          {filteredProducts.length > 0 ? (
            <ProductSection title="" products={filteredProducts} />
          ) : (
            <p className="text-gray-600">Nenhum produto encontrado para "{query}".</p>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}