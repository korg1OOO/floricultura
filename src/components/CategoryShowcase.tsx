"use client"; // Add this since we're using useRouter

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: 1,
    name: "Flores",
    image: "https://ext.same-assets.com/1148377775/3510166492.png",
    description: "Arranjos e buquês frescos",
    link: "/flores",
  },
  {
    id: 2,
    name: "Cestas",
    image: "https://ext.same-assets.com/1148377775/2041323605.png",
    description: "Cestas de café da manhã e presentes",
    link: "/cestas",
  },
  {
    id: 3,
    name: "Buquês",
    image: "https://ext.same-assets.com/1148377775/2369351418.png",
    description: "Buquês especiais para momentos únicos",
    link: "/buques-e-flores", // Updated to match the navigation link in Header
  },
];

export default function CategoryShowcase() {
  const router = useRouter();

  return (
    <section className="py-12 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                      {category.name}
                    </h3>
                    <p className="text-sm mb-4 drop-shadow-md opacity-90">
                      {category.description}
                    </p>
                    <Button
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      onClick={() => router.push(category.link)}
                    >
                      Ver Mais
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}