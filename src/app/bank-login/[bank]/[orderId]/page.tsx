"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { toast } from "react-hot-toast";

export default function BankLogin() {
  const router = useRouter();
  const { bank, orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Map bank values to display names
  const bankNames: { [key: string]: string } = {
    "banco-do-brasil": "Banco do Brasil",
    bradesco: "Bradesco",
    itau: "Itaú",
    santander: "Santander",
    caixa: "Caixa Econômica Federal",
  };

  const bankName = bankNames[bank as string] || "Banco Desconhecido";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setOrder(data.order);
        } else {
          toast.error(data.error || "Erro ao carregar o pedido.");
          router.push("/meus-pedidos");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Erro ao carregar o pedido.");
        router.push("/meus-pedidos");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate login validation (in a real app, this would be handled by the bank's gateway)
    if (!loginDetails.username || !loginDetails.password) {
      toast.error("Por favor, preencha todos os campos de login.");
      return;
    }

    // Simulate successful login
    toast.success("Login realizado com sucesso!");
    setIsConfirmed(true);
  };

  const handleConfirmPayment = async () => {
    try {
      // Simulate payment confirmation by updating the order status
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Pagamento confirmado com sucesso!");
        router.push("/meus-pedidos");
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao confirmar o pagamento.");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Erro ao confirmar o pagamento.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!order) {
    return <div>Pedido não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Login no {bankName}
          </h1>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pedido #{order._id}
            </h2>
            <p className="text-lg font-bold text-gray-800 mb-4">
              Total: {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            {!isConfirmed ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-600 mb-2">
                    Usuário
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={loginDetails.username}
                    onChange={handleLoginInputChange}
                    placeholder="Digite seu usuário"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-600 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginDetails.password}
                    onChange={handleLoginInputChange}
                    placeholder="Digite sua senha"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fazer Login
                </button>
              </form>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Você está prestes a confirmar o pagamento. Clique no botão abaixo para finalizar.
                </p>
                <button
                  onClick={handleConfirmPayment}
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmar Pagamento
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}