"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";
import { useAuth } from "@/context/AuthContext";

export default function FavoritosClient() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Load favorites from MongoDB only if authenticated
  useEffect(() => {
    if (loading) return; // Wait for auth check to complete
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites");
        const data = await response.json();
        if (response.ok) {
          setFavorites(data);
        } else {
          setFavorites([]); // Silently handle failure
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [loading, isAuthenticated]);

  const favoriteProducts = allProducts.filter((product) =>
    favorites.includes(product.id)
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Favoritos</h1>
          {isAuthenticated && favoriteProducts.length > 0 ? (
            <ProductSection title="" products={favoriteProducts} />
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600 mb-4">
                Você ainda não tem produtos favoritos.
              </p>
              <a
                href="/produtos"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Explorar Produtos
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}