"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  code: string;
  image: string;
  price: number;
  originalPrice?: number;
  installments: string;
  discount?: number;
  category: string[];
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
  const router = useRouter();
  const [cart, setCart] = useState<{ items: { productId: number; quantity: number; name: string; price: number }[], total: number }>({ items: [], total: 0 });
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Load cart from MongoDB only if authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      setCart({ items: [], total: 0 });
      return;
    }
    if (isAuthenticated === true) {
      const fetchCart = async () => {
        try {
          const response = await fetch("/api/cart");
          const data = await response.json();
          if (response.ok) {
            setCart(data);
          } else {
            setCart({ items: [], total: 0 }); // Silently handle failure
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          setCart({ items: [], total: 0 });
        }
      };
      fetchCart();
    }
  }, [isAuthenticated]);

  // Load favorites from MongoDB only if authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      setFavorites([]);
      return;
    }
    if (isAuthenticated === true) {
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
    }
  }, [isAuthenticated]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const generateWhatsAppLink = (productName: string) => {
    const phoneNumber = "+556481187808";
    const message = encodeURIComponent(`Olá! Gostaria de pedir: ${productName}`);
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  const addToCart = async (productId: number, productName: string, price: number) => {
    if (!isAuthenticated) {
      toast.error("Por favor, faça login para adicionar ao carrinho.");
      router.push("/login");
      return;
    }
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1, name: productName, price }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data);
        toast.success(`${productName} foi adicionado ao seu carrinho!`, {
          duration: 3000,
        });
        router.push("/checkout");
      } else {
        toast.error(data.error || "Erro ao adicionar ao carrinho.");
      }
    } catch (error) {
      toast.error("Erro ao adicionar ao carrinho.");
    }
  };

  const toggleFavorite = async (productId: number, productName: string) => {
  if (!isAuthenticated) {
    toast.error("Por favor, faça login para adicionar aos favoritos.");
    router.push("/login");
    return;
  }
  const action = favorites.includes(productId) ? "remove" : "add";
  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, action }),
      credentials: "include", // Ensure cookies are sent
    });

    const data = await response.json();
    if (response.ok) {
      setFavorites(data);
      if (action === "remove") {
        toast(`${productName} foi removido dos seus favoritos.`, {
          duration: 3000,
        });
      } else {
        toast.success(`${productName} foi adicionado aos seus favoritos!`, {
          duration: 3000,
        });
      }
      } else {
        toast.error(data.error || "Erro ao atualizar os favoritos.");
        // Optionally, check if the error is 401 and avoid logging out
        if (response.status === 401) {
          console.error("Unauthorized: Token may be invalid or expired");
        }
      }
    } catch (error) {
      toast.error("Erro ao atualizar os favoritos.");
      console.error("Error in toggleFavorite:", error);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  {product.discount && (
                    <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full"
                    onClick={() => toggleFavorite(product.id, product.name)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(product.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{product.code}</p>
                  <div className="mb-3">
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through mr-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-gray-800">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    até {product.installments} sem juros
                  </p>
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                      size="sm"
                      onClick={() => addToCart(product.id, product.name, product.price)}
                    >
                      Comprar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 font-semibold flex items-center justify-center space-x-2"
                      size="sm"
                      asChild
                    >
                      <a
                        href={generateWhatsAppLink(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Pedido via WhatsApp</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export type { Product };