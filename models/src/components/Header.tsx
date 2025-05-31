"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, setUser, refreshAuth } = useAuth(); // Add refreshAuth

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      setUser(null); // Update the auth context
      await refreshAuth(); // Refresh auth state to confirm logout
      window.location.href = "/login";
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Image
              src="https://cdn.awsli.com.br/500x400/1732/1732198/logo/d5ef4d0d4e.png"
              alt="Flor de Lima Logo"
              width={100}
              height={50}
              className="cursor-pointer"
            />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 hidden md:block"></h1>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-green-600">
            Home
          </Link>
          <Link href="/produtos" className="text-gray-600 hover:text-green-600">
            Produtos
          </Link>
          <Link href="/buques-e-flores" className="text-gray-600 hover:text-green-600">
            Buquês e Flores
          </Link>
          <Link href="/cestas" className="text-gray-600 hover:text-green-600">
            Cestas
          </Link>
          <Link href="/datas-comemorativas" className="text-gray-600 hover:text-green-600">
            Datas Comemorativas
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/search">
            <Search className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer" />
          </Link>
          <Link href="/favoritos">
            <Heart className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer" />
          </Link>
          <Link href="/checkout">
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer" />
          </Link>
          {user ? (
            <div className="relative group">
              <User className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer" />
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg hidden group-hover:block">
                <Link href="/meus-pedidos">
                  <span className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Meus Pedidos
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <User className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer" />
            </Link>
          )}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link href="/produtos" className="text-gray-600 hover:text-green-600">
              Produtos
            </Link>
            <Link href="/buques-e-flores" className="text-gray-600 hover:text-green-600">
              Buquês e Flores
            </Link>
            <Link href="/cestas" className="text-gray-600 hover:text-green-600">
              Cestas
            </Link>
            <Link href="/datas-comemorativas" className="text-gray-600 hover:text-green-600">
              Datas Comemorativas
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}