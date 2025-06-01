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
  pixKey?: string;
}

// Define the params type for the dynamic route
interface PixParams {
  orderId: string;
}

// Define the props type expected by Next.js for a dynamic page
interface PixPaymentPageProps {
  params: Promise<PixParams>;
}

export default function PixPayment({ params }: PixPaymentPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [pixData, setPixData] = useState<{ chavePix: string; amount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<PixParams | null>(null);

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
          console.log("Fetched order:", data.order);
          setOrder(data.order);
          setPixData({ chavePix: data.order.pixKey || "385e84bb-09e4-4c38-a812-c7c4e1378383", amount: data.order.total });
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

  const handleCopyChavePix = () => {
    if (pixData?.chavePix) {
      navigator.clipboard.writeText(pixData.chavePix);
      toast.success("Chave PIX copiada para a área de transferência!");
    }
  };

  const handleBackToCheckout = () => {
    router.push("/checkout?fromPayment=true");
  };

  if (!resolvedParams) {
    return <div>Carregando parâmetros...</div>;
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!order || !pixData) {
    return <div>Pedido não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Pague com PIX
          </h1>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pedido #{order._id}
            </h2>
            <p className="text-lg font-bold text-gray-800 mb-4">
              Total: {pixData.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            <p className="text-gray-600 mb-4">
              Use a chave PIX abaixo para realizar o pagamento no seu aplicativo de banco:
            </p>
            <div className="mb-4">
              <p className="text-gray-600 font-mono break-all mb-2">{pixData.chavePix}</p>
              <button
                onClick={handleCopyChavePix}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copiar Chave PIX
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Após realizar o pagamento, envie o comprovante e personalize seu item enviando uma mensagem para o nosso WhatsApp{" "}
              <a
                href="https://wa.me/5564981187808"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                +55 64 98118-7808
              </a>.
              <br />
              Você também pode verificar o status do pedido em{" "}
              <a href="/meus-pedidos" className="text-blue-600 hover:underline">
                Meus Pedidos
              </a>.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackToCheckout}
                className="w-1/2 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => router.push("/meus-pedidos")}
                className="w-1/2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}