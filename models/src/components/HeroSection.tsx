"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    id: 1,
    image: "https://ext.same-assets.com/1148377775/4093631687.png",
    title: "FELIZ DIA dos Namorados",
    subtitle: "Presentes especiais para quem você ama",
    buttonText: "Ver Produtos",
    action: () => {
      const maisVendidosSection = document.getElementById("mais-vendidos");
      if (maisVendidosSection) {
        maisVendidosSection.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
  {
    id: 2,
    image: "https://ext.same-assets.com/1148377775/4093631687.png",
    title: "Buquês Especiais",
    subtitle: "Flores frescas entregues no mesmo dia",
    buttonText: "Comprar Agora",
    action: (router: ReturnType<typeof useRouter>) => router.push("/buques-e-flores"),
  },
  {
    id: 3,
    image: "https://ext.same-assets.com/1148377775/4093631687.png",
    title: "Cestas de Café da Manhã",
    subtitle: "Surpreenda com sabor e carinho",
    buttonText: "Ver Cestas",
    action: (router: ReturnType<typeof useRouter>) => router.push("/cestas"),
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-96 md:h-[500px] overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-6 drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
                      onClick={() => slide.action(router)}
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}