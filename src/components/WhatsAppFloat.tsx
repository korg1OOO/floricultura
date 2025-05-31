"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = "5564981187808"; // (31) 98905-1311
    const message = "Olá! Gostaria de mais informações sobre os produtos da Flor de Lima.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        <MessageCircle className="w-7 h-7" />
      </Button>
    </div>
  );
}