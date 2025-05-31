"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useAuth } from "@/context/AuthContext";

export default function MeusPedidosClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch orders from API
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          toast.error(data.error || "Erro ao carregar pedidos.");
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Erro ao carregar pedidos.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [authLoading, isAuthenticated]);

  const handleCopyPixKey = (pixKey: string) => {
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave PIX copiada para a área de transferência!");
  };

  if (authLoading || loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meus Pedidos</h1>
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <p className="text-gray-600 mb-2">
                    Pedido realizado em: {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-gray-600 mb-2">Status: {order.status}</p>
                  <p className="text-gray-600 mb-2">
                    Método de Pagamento: {order.paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}
                  </p>
                  <p className="text-lg font-bold text-gray-800 mb-4">
                    Total: {order.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  {order.paymentMethod === "pix" && (
                    <div className="mb-4">
                      <p className="text-gray-600 font-mono break-all mb-2">
                        Chave PIX: 385e84bb-09e4-4c38-a812-c7c4e1378383
                      </p>
                      <button
                        onClick={() => handleCopyPixKey("385e84bb-09e4-4c38-a812-c7c4e1378383")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Copiar Chave PIX
                      </button>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Itens:</h3>
                  {order.items.map((item: any) => (
                    <div key={item.productId} className="flex items-center mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-gray-600">Quantidade: {item.quantity}</p>
                        <p className="text-gray-600">
                          Preço: {(item.price * item.quantity).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600 mb-4">
                Nenhum pedido encontrado. Comece a comprar agora!
              </p>
              <div className="mt-6 text-center">
                <a
                  href="/produtos"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ver Produtos
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}