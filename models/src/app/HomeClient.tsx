"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryShowcase from "@/components/CategoryShowcase";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";

const maisVendidosProducts = allProducts.filter((product) =>
  product.category.includes("mais-vendidos")
);
const destaquesProducts = allProducts.filter((product) =>
  product.category.includes("destaques")
);
const cafeManhaProducts = allProducts.filter((product) =>
  product.category.includes("cestas-de-cafe-da-manha-bh")
);
const cesarRomanticasProducts = allProducts.filter((product) =>
  product.category.includes("cestas-romanticas")
);

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CategoryShowcase />
      <div id="mais-vendidos">
        <ProductSection title="Mais Vendidos" products={maisVendidosProducts} />
      </div>
      <ProductSection title="Destaques" products={destaquesProducts} />
      <ProductSection title="Cestas Românticas" products={cesarRomanticasProducts} />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}