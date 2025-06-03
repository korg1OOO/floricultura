"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { toast } from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";

interface PixData {
  pixCode: string;
  amount: number;
}

interface PixParams {
  orderId: string;
}

interface PixPaymentPageProps {
  params: Promise<PixParams>;
}

export default function PixPayment({ params }: PixPaymentPageProps) {
  const router = useRouter();
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<PixParams | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // Track retry attempts
  const maxRetries = 3; // Maximum retry attempts

  useEffect(() => {
    const resolveParams = async () => {
      const { orderId } = await params;
      setResolvedParams({ orderId });
    };
    resolveParams();
  }, [params]);

  const fetchPixData = useCallback(async () => {
    if (!resolvedParams?.orderId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/pix-payment/${resolvedParams.orderId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched PIX data:", data);
        setPixData({ pixCode: data.pixCode, amount: data.amount });
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } else {
        if (response.status === 401) {
          toast.error("Você precisa estar logado para acessar esta página.");
          router.push("/login");
          return;
        }
        setError(data.details || data.error || "Erro ao carregar os dados do PIX.");
        toast.error(data.details || data.error || "Erro ao carregar os dados do PIX.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching PIX data:", error);
      setError(errorMessage || "Erro ao carregar os dados do PIX.");
      toast.error(errorMessage || "Erro ao carregar os dados do PIX.");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams?.orderId, router]);

  useEffect(() => {
    if (resolvedParams?.orderId) {
      fetchPixData();
    }
  }, [resolvedParams, fetchPixData]);

  const handleCopyPixCode = () => {
    if (pixData?.pixCode) {
      navigator.clipboard.writeText(pixData.pixCode);
      toast.success("Código PIX copiado para a área de transferência!");
    } else {
      toast.error("Código PIX não disponível para copiar.");
    }
  };

  const handleBackToCheckout = () => {
    router.push("/checkout?fromPayment=true");
  };

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      toast.error("Número máximo de tentativas atingido. Por favor, tente novamente mais tarde.");
      return;
    }
    setRetryCount(retryCount + 1);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
    fetchPixData();
  };

  if (!resolvedParams) {
    return <div>Carregando parâmetros...</div>;
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error || !pixData) {
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
                Erro ao carregar pagamento
              </h2>
              <p className="text-red-600 mb-4">
                {error || "Não foi possível carregar os dados do PIX. Tente novamente ou entre em contato com o suporte."}
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  type="button"
                  onClick={handleBackToCheckout}
                  className="w-1/3 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={loading || retryCount >= maxRetries}
                  className={`w-1/3 p-3 rounded-lg transition-colors ${
                    loading || retryCount >= maxRetries
                      ? "bg-blue-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Carregando..." : "Tentar Novamente"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/meus-pedidos")}
                  className="w-1/3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ver Meus Pedidos
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
              Pedido #{resolvedParams.orderId}
            </h2>
            <p className="text-lg font-bold text-gray-800 mb-4">
              Total: {pixData.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            <p className="text-gray-600 mb-4">
              Escaneie o QR Code abaixo ou copie o código PIX para realizar o pagamento no seu aplicativo de banco:
            </p>
            {pixData.pixCode && (
              <div className="mx-auto mb-4 max-w-xs">
                <QRCodeCanvas value={pixData.pixCode} size={256} />
              </div>
            )}
            <div className="mb-4">
              <p className="text-gray-600 font-mono break-all mb-2">{pixData.pixCode || "Código PIX não disponível"}</p>
              <button
                onClick={handleCopyPixCode}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copiar Código PIX
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
            <div className="flex space-x-4 justify-center">
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