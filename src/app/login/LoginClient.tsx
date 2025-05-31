"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useAuth } from "@/context/AuthContext";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, refreshAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user); // Update the auth context
        await refreshAuth(); // Refresh auth state to confirm login
        toast.success("Login bem-sucedido!");
        router.push("/");
      } else {
        toast.error(data.error || "Erro ao fazer login.");
      }
    } catch (error) {
      toast.error("Erro ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h1>
          <form onSubmit={handleLogin} className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Entrar
            </button>
            <p className="mt-4 text-center">
              Não tem uma conta?{" "}
              <a href="/cadastro" className="text-green-600 hover:underline">
                Cadastre-se
              </a>
            </p>
          </form>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}