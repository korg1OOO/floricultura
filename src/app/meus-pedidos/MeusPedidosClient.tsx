"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  pixKey?: string;
  total: number;
  items: CartItem[];
}

export default function MeusPedidosClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          setOrders([]);
          toast.error(data.error || "Erro ao carregar pedidos.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        toast.error("Erro ao carregar pedidos.");
      }
    };
    fetchOrders();
  }, [loading, isAuthenticated]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meus Pedidos</h1>
          {isAuthenticated && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <p className="text-gray-600 mb-2">Pedido #{order._id}</p>
                  <p className="text-gray-600 mb-2">
                    Pedido realizado em: {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-gray-600 mb-2">Status: {order.status}</p>
                  <p className="text-gray-600 mb-2">
                    Método de Pagamento: {order.paymentMethod === "creditCard" ? "Cartão de Crédito" : "PIX"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Chave Pix: {order.pixKey || "385e84bb-09e4-4c38-a812-c7c4e1378383"}
                  </p>
                  <p className="text-lg font-bold text-gray-800 mb-4">
                    Total: {order.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Itens:</h3>
                  {order.items.map((item) => (
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