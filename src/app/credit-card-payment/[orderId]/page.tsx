"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { toast } from "react-hot-toast";

// Define the Order type
interface Order {
  _id: string;
  total: number;
}

// Define the params type for the dynamic route
interface CreditCardParams {
  orderId: string;
}

// Define the props type expected by Next.js for a dynamic page
interface CreditCardPaymentPageProps {
  params: Promise<CreditCardParams>;
}

export default function CreditCardPayment({ params }: CreditCardPaymentPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    cpf: "",
  });
  const [parcelas, setParcelas] = useState<number>(1);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [resolvedParams, setResolvedParams] = useState<CreditCardParams | null>(null);

  const banks = [
    { value: "banco-do-brasil", label: "Banco do Brasil" },
    { value: "bradesco", label: "Bradesco" },
    { value: "itau", label: "Itaú" },
    { value: "santander", label: "Santander" },
    { value: "caixa", label: "Caixa Econômica Federal" },
  ];

  // Resolve the params Promise
  useEffect(() => {
    const resolveParams = async () => {
      const { orderId } = await params;
      setResolvedParams({ orderId });
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!resolvedParams?.orderId) return;

      try {
        const response = await fetch(`/api/orders/${resolvedParams.orderId}`, {
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

    if (resolvedParams?.orderId) {
      fetchOrder();
    }
  }, [resolvedParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in cardDetails) {
      let formattedValue = value;

      if (name === "cardNumber") {
        formattedValue = value.replace(/\D/g, "").slice(0, 16);
        formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
      }

      if (name === "expiryDate") {
        formattedValue = value.replace(/\D/g, "").slice(0, 4);
        if (formattedValue.length >= 3) {
          formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
        }
      }

      if (name === "cvv") {
        formattedValue = value.replace(/\D/g, "").slice(0, 4);
      }

      if (name === "cpf") {
        formattedValue = value.replace(/\D/g, "").slice(0, 11);
        formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
        formattedValue = formattedValue.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        formattedValue = formattedValue.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      }

      setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "bank") {
      setSelectedBank(value);
    } else if (name === "parcelas") {
      setParcelas(Number(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resolvedParams?.orderId) return;

    const { cardNumber, expiryDate, cvv, cardholderName, cpf } = cardDetails;
    if (
      !cardNumber ||
      cardNumber.replace(/\s/g, "").length !== 16 ||
      !expiryDate ||
      expiryDate.replace(/\//g, "").length !== 4 ||
      !cvv ||
      (cvv.length !== 3 && cvv.length !== 4) ||
      !cardholderName ||
      !cpf ||
      cpf.replace(/[\.\-]/g, "").length !== 11 ||
      !selectedBank
    ) {
      toast.error("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: resolvedParams.orderId,
          paymentMethod: "creditCard",
          cardNumber: cardNumber.replace(/\s/g, ""),
          cardHolder: cardholderName,
          expiryDate: expiryDate.replace(/\//g, ""),
          cvv,
          cpf: cpf.replace(/[\.\-]/g, ""),
          parcelas,
          bank: selectedBank,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Dados do pagamento salvos com sucesso!");
        router.push(`/bank-login/${selectedBank}?orderId=${resolvedParams.orderId}`);
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

  const handleChangeBank = () => {
    setSelectedBank("");
  };

  if (!resolvedParams) {
    return <div>Carregando parâmetros...</div>;
  }

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
            Pagamento com Cartão de Crédito
          </h1>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pedido #{order._id}
            </h2>
            <p className="text-lg font-bold text-gray-800 mb-4">
              Total: {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-gray-600 mb-2">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  maxLength={19}
                  required
                />
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label htmlFor="expiryDate" className="block text-gray-600 mb-2">
                    Data de Validade
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cvv" className="block text-gray-600 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="cardholderName" className="block text-gray-600 mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={handleInputChange}
                  placeholder="Nome Completo"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cpf" className="block text-gray-600 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={cardDetails.cpf}
                  onChange={handleInputChange}
                  placeholder="123.456.789-00"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  maxLength={14}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="parcelas" className="block text-gray-600 mb-2">
                  Número de Parcelas
                </label>
                <select
                  id="parcelas"
                  name="parcelas"
                  value={parcelas}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
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
                <label htmlFor="bank" className="block text-gray-600 mb-2">
                  Selecione o Banco
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    id="bank"
                    name="bank"
                    value={selectedBank}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                    disabled={!!selectedBank}
                  >
                    <option value="">Selecione um banco</option>
                    {banks.map((bank) => (
                      <option key={bank.value} value={bank.value}>
                        {bank.label}
                      </option>
                    ))}
                  </select>
                  {selectedBank && (
                    <button
                      type="button"
                      onClick={handleChangeBank}
                      className="bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Voltar
                    </button>
                  )}
                </div>
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
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}