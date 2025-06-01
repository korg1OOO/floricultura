"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  lastCart?: CartItem[];
}

interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  image: string;
  quantity: number;
  originalPrice?: number;
  installments: string;
  discount?: number;
  category: string[];
}

export default function CheckoutClient() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPayment = searchParams.get("fromPayment") === "true";
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "pix" | null>("pix");
  const [isRestoring, setIsRestoring] = useState(false);
  const [hasRestored, setHasRestored] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hasRestored") === "true";
    }
    return false;
  });
  const hasFetched = useRef(false);
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false);

  // Handle auth loading timeout
  useEffect(() => {
    if (authLoading) {
      const timeout = setTimeout(() => {
        console.error("CheckoutClient: Auth loading is taking too long. Please check AuthContext.");
        toast.error("Erro ao carregar autenticação. Por favor, recarregue a página.");
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [authLoading]);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || hasFetched.current) {
      console.log("CheckoutClient: Skipping fetchCart, already fetched or not authenticated");
      return;
    }

    hasFetched.current = true;
    console.log("CheckoutClient: Running fetchCart...");

    try {
      console.log("CheckoutClient: Fetching cart from /api/cart");
      const response = await fetch("/api/cart", { credentials: "include" });
      console.log("CheckoutClient: Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch /api/cart: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("CheckoutClient: Cart data:", data);

      if (fromPayment && data.lastCart && data.lastCart.length > 0 && data.items.length === 0 && !hasRestored) {
        setIsRestoring(true);
        try {
          console.log("CheckoutClient: Attempting to restore cart...");
          const restoreResponse = await fetch("/api/cart/restore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!restoreResponse.ok) {
            throw new Error(`Failed to fetch /api/cart/restore: ${restoreResponse.status} ${restoreResponse.statusText}`);
          }
          const restoredData = await restoreResponse.json();
          if (restoredData.error) {
            throw new Error(restoredData.error);
          }
          console.log("CheckoutClient: Restored cart:", restoredData);
          setCart(restoredData);
          setHasRestored(true);
          toast.success("Carrinho restaurado!");
        } catch (error: unknown) {
          console.error("CheckoutClient: Error during cart restoration:", error);
          setCart(data);
          if (error instanceof Error && error.message !== "No previous cart to restore") {
            toast.error(error.message || "Erro ao restaurar o carrinho.");
          }
        } finally {
          setIsRestoring(false);
        }
      } else {
        console.log("CheckoutClient: Cart fetch successful, setting cart:", data);
        setCart(data);
      }
    } catch (error: unknown) {
      console.error("CheckoutClient: Error fetching cart:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao carregar o carrinho.");
    }
  }, [isAuthenticated, hasRestored, fromPayment]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hasRestored", hasRestored.toString());
    }
  }, [hasRestored]);

  useEffect(() => {
    if (authLoading) {
      console.log("CheckoutClient: Still loading auth state");
      return;
    }
    console.log("CheckoutClient: Auth loading complete, hasLoadedAuth:", hasLoadedAuth);
    setHasLoadedAuth(true);
    if (!isAuthenticated) {
      console.log("CheckoutClient: Not authenticated, redirecting to login");
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!hasLoadedAuth) {
      console.log("CheckoutClient: Waiting for auth to load, hasLoadedAuth:", hasLoadedAuth);
      return;
    }
    if (!isAuthenticated) {
      console.log("CheckoutClient: Not authenticated, skipping fetchCart");
      return;
    }
    console.log("CheckoutClient: Authenticated and auth loaded, fetching cart - should only run once");
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoadedAuth, isAuthenticated]);

  useEffect(() => {
    return () => {
      console.log("CheckoutClient: Component unmounting, resetting hasFetched");
      hasFetched.current = false;
    };
  }, []);

  const cartProducts = cart.items
    .map((item: CartItem) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((product): product is Product => product !== null);

  const handleRemoveItem = async (productId: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
        toast.success("Item removido do carrinho!");
      } else {
        toast.error(data.error || "Erro ao remover item do carrinho.");
      }
    } catch (error) {
      console.error("CheckoutClient: Error removing item:", error);
      toast.error("Erro ao remover item do carrinho.");
    }
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
        toast.success("Quantidade atualizada!");
      } else {
        toast.error(data.error || "Erro ao atualizar quantidade.");
      }
    } catch (error) {
      console.error("CheckoutClient: Error updating quantity:", error);
      toast.error("Erro ao atualizar quantidade.");
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Por favor, faça login para finalizar a compra.");
      router.push("/login");
      return;
    }
    if (!paymentMethod) {
      toast.error("Por favor, selecione um método de pagamento.");
      return;
    }
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethod }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCart({ items: [], total: 0 });
        setHasRestored(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("hasRestored", "false");
          localStorage.setItem("paymentMethod", paymentMethod);
          localStorage.setItem("orderId", data.order._id);
        }
        router.push("/address");
      } else {
        toast.error(data.error || "Erro ao finalizar a compra.");
      }
    } catch (error) {
      console.error("CheckoutClient: Error during checkout:", error);
      toast.error("Erro ao finalizar a compra.");
    }
  };

  if (authLoading) {
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

  if (isRestoring) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-12">
          <div className="container mx-auto px-4 py-8">Restaurando carrinho...</div>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
          {isAuthenticated && cartProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Itens no Carrinho
                </h2>
                {cartProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center bg-gray-50 p-4 rounded-lg mb-4 shadow-sm"
                  >
                    <div className="relative w-20 h-20 mr-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-gray-600">{product.code}</p>
                      <p className="text-lg font-bold text-gray-800">
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                          className="text-gray-600 hover:text-gray-800 mr-2"
                          disabled={product.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="text-gray-600">Quantidade: {product.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                          className="text-gray-600 hover:text-gray-800 ml-2"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        className="text-red-600 hover:text-red-800 mt-2"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Resumo do Pedido
                </h2>
                <p className="text-gray-600 mb-2">
                  Total de Itens: {cartProducts.reduce((sum, product) => sum + product.quantity, 0)}
                </p>
                <p className="text-lg font-bold text-gray-800 mb-4">
                  Total: {cart.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Método de Pagamento
                  </h3>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === "creditCard"}
                      onChange={() => setPaymentMethod("creditCard")}
                      className="mr-2"
                      disabled
                    />
                    <label htmlFor="creditCard" className="text-gray-600">
                      Cartão de Crédito <span className="text-red-500 text-sm">(em manutenção)</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="pix"
                      name="paymentMethod"
                      value="pix"
                      checked={paymentMethod === "pix"}
                      onChange={() => setPaymentMethod("pix")}
                      className="mr-2"
                    />
                    <label htmlFor="pix" className="text-gray-600">
                      PIX
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600 mb-4">Seu carrinho está vazio.</p>
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