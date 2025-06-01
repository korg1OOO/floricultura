"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function AddressClient() {
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast.error("Por favor, preencha todos os campos do endereço.");
      return;
    }

    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Endereço salvo com sucesso!");
        // Redirect to the payment page after saving the address
        const paymentMethod = localStorage.getItem("paymentMethod");
        const orderId = localStorage.getItem("orderId");
        if (paymentMethod && orderId) {
          if (paymentMethod === "pix") {
            router.push(`/pix-payment/${orderId}`);
          } else if (paymentMethod === "creditCard") {
            router.push(`/credit-card-payment/${orderId}`);
          }
        } else {
          toast.error("Erro ao redirecionar para o pagamento.");
          router.push("/checkout");
        }
      } else {
        toast.error(data.error || "Erro ao salvar o endereço.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Erro ao salvar o endereço.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Informe seu Endereço
          </h1>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="street" className="block text-gray-600 mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-gray-600 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="state" className="block text-gray-600 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="zipCode" className="block text-gray-600 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Salvar e Continuar
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}