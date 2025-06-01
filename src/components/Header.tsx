"use client";

import Link from "next/link";
import Image from "next/image"; // Add Image import
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function Header() {
  const { user, setUser, refreshAuth } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        await refreshAuth();
        toast.success("Logout realizado com sucesso!", { duration: 3000 });
        window.location.href = "/login";
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao fazer logout.", { duration: 3000 });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Erro ao fazer logout.", { duration: 3000 });
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="https://cdn.awsli.com.br/400x300/1732/1732198/logo/d5ef4d0d4e.png"
            alt="Flor de Lima Logo"
            width={120} // Adjusted for header size
            height={48} // Maintains 400:300 aspect ratio (scaled down)
            className="object-contain"
            priority // Load eagerly since it's in the header
          />
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Início
          </Link>
          <Link href="/produtos" className="text-gray-600 hover:text-gray-800">
            Produtos
          </Link>
          <Link href="/carrinho" className="text-gray-600 hover:text-gray-800">
            Carrinho
          </Link>
          {user ? (
            <>
              <Link href="/meus-pedidos" className="text-gray-600 hover:text-gray-800">
                Meus Pedidos
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
          )}
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-800">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 py-2"
              onClick={toggleMenu}
            >
              Início
            </Link>
            <Link
              href="/produtos"
              className="text-gray-600 hover:text-gray-800 py-2"
              onClick={toggleMenu}
            >
              Produtos
            </Link>
            <Link
              href="/carrinho"
              className="text-gray-600 hover:text-gray-800 py-2"
              onClick={toggleMenu}
            >
              Carrinho
            </Link>
            {user ? (
              <>
                <Link
                  href="/meus-pedidos"
                  className="text-gray-600 hover:text-gray-800 py-2"
                  onClick={toggleMenu}
                >
                  Meus Pedidos
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-gray-600 hover:text-gray-800 py-2 text-left"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-800 py-2"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}