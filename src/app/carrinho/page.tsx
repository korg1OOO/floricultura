"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Image from "next/image"; // Add Image import
import { allProducts } from "@data/products"; // Add allProducts import

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

export default function Carrinho() {
  const { isAuthenticated, loading, refreshAuth, setUser } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false);

  useEffect(() => {
    if (loading) {
      console.log("Carrinho: Still loading auth state");
      return;
    }
    console.log("Carrinho: Auth loading complete, hasLoadedAuth:", hasLoadedAuth);
    setHasLoadedAuth(true);
    if (!isAuthenticated) {
      console.log("Carrinho: Not authenticated, redirecting to /login");
      toast.error("Por favor, faça login para ver seu carrinho.");
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!hasLoadedAuth) {
        console.log("Carrinho: Waiting for auth to load, hasLoadedAuth:", hasLoadedAuth);
        return;
      }
      if (!isAuthenticated) {
        console.log("Carrinho: Not authenticated, skipping fetchCart");
        return;
      }

      try {
        console.log("Carrinho: Fetching cart from /api/cart");
        const response = await fetch("/api/cart", { credentials: "include" });
        console.log("Carrinho: Response status:", response.status);
        const data = await response.json();
        console.log("Carrinho: Cart data:", data);

        if (response.status === 401) {
          console.log("Carrinho: Received 401, session might be expired, revalidating...");
          await refreshAuth();
          if (!isAuthenticated) {
            console.log("Carrinho: Session confirmed expired, redirecting to /login");
            setUser(null);
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            router.push("/login");
            return;
          }
          const retryResponse = await fetch("/api/cart", { credentials: "include" });
          const retryData = await retryResponse.json();
          if (retryResponse.ok) {
            console.log("Carrinho: Cart fetch successful after revalidation, setting cart:", retryData);
            setCart(retryData);
          } else {
            console.log("Carrinho: Cart fetch failed after revalidation, resetting cart");
            setCart({ items: [], total: 0 });
            toast.error(retryData.error || "Erro ao carregar o carrinho.");
          }
        } else if (response.ok) {
          console.log("Carrinho: Cart fetch successful, setting cart:", data);
          setCart(data);
        } else {
          console.log("Carrinho: Cart fetch failed, resetting cart");
          setCart({ items: [], total: 0 });
          toast.error(data.error || "Erro ao carregar o carrinho.");
        }
      } catch (error) {
        console.error("Carrinho: Error fetching cart:", error);
        setCart({ items: [], total: 0 });
        toast.error("Erro ao carregar o carrinho.");
      }
    };

    fetchCart();
  }, [hasLoadedAuth, isAuthenticated, router, setUser]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const removeFromCart = async (productId: number) => {
    try {
      console.log("Carrinho: Removing item from cart:", productId);
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });

      console.log("Carrinho: Remove item response status:", response.status);
      const data = await response.json();
      console.log("Carrinho: Remove item response data:", data);

      if (response.status === 401) {
        console.log("Carrinho: Received 401 during remove, session might be expired, revalidating...");
        await refreshAuth();
        if (!isAuthenticated) {
          console.log("Carrinho: Session confirmed expired, redirecting to /login");
          setUser(null);
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          router.push("/login");
          return;
        }
        const retryResponse = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
          credentials: "include",
        });
        const retryData = await retryResponse.json();
        if (retryResponse.ok) {
          setCart(retryData);
          toast.success("Item removido do carrinho!", { duration: 3000 });
        } else {
          toast.error(retryData.error || "Erro ao remover o item.");
        }
      } else if (response.ok) {
        setCart(data);
        toast.success("Item removido do carrinho!", { duration: 3000 });
      } else {
        toast.error(data.error || "Erro ao remover o item.");
      }
    } catch (error) {
      console.error("Carrinho: Error removing from cart:", error);
      toast.error("Erro ao remover o item.");
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      console.log("Carrinho: Updating quantity for product:", { productId, quantity });
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include",
      });

      console.log("Carrinho: Update quantity response status:", response.status);
      const data = await response.json();
      console.log("Carrinho: Update quantity response data:", data);

      if (response.status === 401) {
        console.log("Carrinho: Received 401 during update, session might be expired, revalidating...");
        await refreshAuth();
        if (!isAuthenticated) {
          console.log("Carrinho: Session confirmed expired, redirecting to /login");
          setUser(null);
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          router.push("/login");
          return;
        }
        const retryResponse = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
          credentials: "include",
        });
        const retryData = await retryResponse.json();
        if (retryResponse.ok) {
          setCart(retryData);
          toast.success("Quantidade atualizada!", { duration: 3000 });
        } else {
          toast.error(retryData.error || "Erro ao atualizar a quantidade.");
        }
      } else if (response.ok) {
        setCart(data);
        toast.success("Quantidade atualizada!", { duration: 3000 });
      } else {
        toast.error(data.error || "Erro ao atualizar a quantidade.");
      }
    } catch (error) {
      console.error("Carrinho: Error updating quantity:", error);
      toast.error("Erro ao atualizar a quantidade.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-12">
          <div className="container mx-auto px-4 py-8">Carregando...</div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Seu Carrinho</h1>

          {cart.items.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Seu carrinho está vazio.</p>
              <Link href="/produtos">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Ver Produtos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => {
                  // Find the product in allProducts to get the image
                  const product = allProducts.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={item.productId}
                      className="flex items-center border-b pb-4"
                    >
                      {/* Product Image */}
                      {product && product.image ? (
                        <div className="relative w-20 h-20 mr-4">
                          <Image
                            src={product.image}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 mr-4 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Sem imagem</span>
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                        <p className="text-gray-600">{formatPrice(item.price)} (x{item.quantity})</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="text-gray-600 hover:text-gray-800 px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="text-gray-600 hover:text-gray-800 px-2"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove Button */}
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-bold text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Total: {formatPrice(cart.total)}
                </h2>
                <Link href="/checkout">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Finalizar Compra
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}