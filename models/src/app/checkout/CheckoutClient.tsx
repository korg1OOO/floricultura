"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { allProducts } from "@data/products";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutClient() {
  const [cart, setCart] = useState<{ items: { productId: number; quantity: number; name: string; price: number }[], total: number }>({ items: [], total: 0 });
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "pix" | null>(null);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Load cart from MongoDB only if authenticated
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      setCart({ items: [], total: 0 });
      return;
    }
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart", { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
          setCart(data);
        } else {
          setCart({ items: [], total: 0 });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart({ items: [], total: 0 });
      }
    };
    fetchCart();
  }, [loading, isAuthenticated]);

  const cartProducts = cart.items.map((item: any) => {
    const product = allProducts.find((p) => p.id === item.productId);
    return { ...product, quantity: item.quantity };
  }).filter((product: any) => product);

  // Remove an item from the cart
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
      console.error("Error removing item:", error);
      toast.error("Erro ao remover item do carrinho.");
    }
  };

  // Update the quantity of an item in the cart
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
      console.error("Error updating quantity:", error);
      toast.error("Erro ao atualizar quantidade.");
    }
  };

  const handleCopyPixKey = () => {
    const pixKey = "385e84bb-09e4-4c38-a812-c7c4e1378383";
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave PIX copiada para a área de transferência!");
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
        setCart({ items: [], total: 0 }); // Clear the cart on the client side
        if (paymentMethod === "pix") {
          router.push(`/pix-payment/${data.order._id}`);
        } else if (paymentMethod === "creditCard") {
          router.push(`/credit-card-payment/${data.order._id}`);
        }
      } else {
        toast.error(data.error || "Erro ao finalizar a compra.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Erro ao finalizar a compra.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
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
                {cartProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center bg-gray-50 p-4 rounded-lg mb-4 shadow-sm"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
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
                  Total de Itens: {cartProducts.reduce((sum: number, product: any) => sum + product.quantity, 0)}
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
                    />
                    <label htmlFor="creditCard" className="text-gray-600">
                      Cartão de Crédito
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
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
                  {paymentMethod === "pix" && (
                    <div className="mt-4">
                      <p className="text-gray-600 font-mono break-all mb-2">
                        Chave PIX: 385e84bb-09e4-4c38-a812-c7c4e1378383
                      </p>
                      <button
                        onClick={handleCopyPixKey}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Copiar Chave PIX
                      </button>
                    </div>
                  )}
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