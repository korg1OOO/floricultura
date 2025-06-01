"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { IMaskInput } from "react-imask";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

interface Address {
  recipientName: string;
  streetType: string;
  streetName: string;
  streetNumber: string;
  complement: string;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
}

export default function AddressClient() {
  const [address, setAddress] = useState<Address>({
    recipientName: "",
    streetType: "",
    streetName: "",
    streetNumber: "",
    complement: "",
    neighborhood: "",
    zipCode: "",
    city: "",
    state: "",
  });
  const router = useRouter();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));

    if (name === "zipCode" && /^\d{5}-\d{3}$/.test(value)) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value.replace("-", "")}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            streetType: data.logradouro?.split(" ")[0] || "",
            streetName: data.logradouro?.split(" ").slice(1).join(" ") || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        } else {
          toast.error("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Error fetching CEP data:", error);
        toast.error("Erro ao buscar dados do CEP.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof Address)[] = [
      "recipientName",
      "streetType",
      "streetName",
      "streetNumber",
      "neighborhood",
      "zipCode",
      "city",
      "state",
    ];

    for (const field of requiredFields) {
      if (!address[field]) {
        toast.error(`Por favor, preencha o campo: ${fieldToLabel[field]}`);
        return;
      }
    }

    const cepRegex = /^\d{5}-\d{3}$/;
    if (!cepRegex.test(address.zipCode)) {
      toast.error("Por favor, insira um CEP válido no formato 12345-678.");
      return;
    }

    if (address.state.length !== 2) {
      toast.error("A sigla do estado (UF) deve ter exatamente 2 letras.");
      return;
    }

    try {
      console.log("Sending address to /api/address:", address); // Debug: Log the address being sent
      const response = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
        credentials: "include",
      });

      console.log("Response status:", response.status); // Debug: Log the response status
      console.log("Response headers:", response.headers.get("content-type")); // Debug: Log the content type

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text(); // Get the raw response text
        console.error("Non-JSON response received:", text); // Debug: Log the raw response
        throw new Error("Expected JSON response, but received: " + text.slice(0, 100));
      }

      const data = await response.json();
      if (response.ok) {
        toast.success("Endereço salvo com sucesso!");
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
      console.error("Error during address submission:", error);
      toast.error("Erro ao salvar o endereço.");
    }
  };

  const fieldToLabel: Record<keyof Address, string> = {
    recipientName: "Nome do Destinatário",
    streetType: "Tipo de Logradouro",
    streetName: "Nome do Logradouro",
    streetNumber: "Número do Endereço",
    complement: "Complemento",
    neighborhood: "Bairro",
    zipCode: "CEP",
    city: "Cidade",
    state: "Sigla do Estado (UF)",
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
                <label htmlFor="recipientName" className="block text-gray-600 mb-2">
                  Nome do Destinatário
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={address.recipientName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="streetType" className="block text-gray-600 mb-2">
                  Tipo de Logradouro
                </label>
                <select
                  id="streetType"
                  name="streetType"
                  value={address.streetType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="Rua">Rua</option>
                  <option value="Avenida">Avenida</option>
                  <option value="Travessa">Travessa</option>
                  <option value="Praça">Praça</option>
                  <option value="Alameda">Alameda</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="streetName" className="block text-gray-600 mb-2">
                  Nome do Logradouro
                </label>
                <input
                  type="text"
                  id="streetName"
                  name="streetName"
                  value={address.streetName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="streetNumber" className="block text-gray-600 mb-2">
                  Número do Endereço
                </label>
                <input
                  type="text"
                  id="streetNumber"
                  name="streetNumber"
                  value={address.streetNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="complement" className="block text-gray-600 mb-2">
                  Complemento (opcional)
                </label>
                <input
                  type="text"
                  id="complement"
                  name="complement"
                  value={address.complement}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="neighborhood" className="block text-gray-600 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  value={address.neighborhood}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="zipCode" className="block text-gray-600 mb-2">
                  CEP (formato: 12345-678)
                </label>
                <IMaskInput
                  mask="00000-000"
                  value={address.zipCode}
                  onAccept={(value: string) =>
                    handleInputChange({
                      target: { name: "zipCode", value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="12345-678"
                  required
                  name="zipCode"
                  id="zipCode"
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
                  Sigla do Estado (UF)
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  maxLength={2}
                  placeholder="Ex.: SP"
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