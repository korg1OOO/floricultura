// data/products.ts
import type { Product } from "@/components/ProductSection";

import item1 from "../src/assets/item1.jpeg";
import item2 from "../src/assets/item2.jpeg";
import item3 from "../src/assets/item3.jpeg";
import item4 from "../src/assets/item4.jpeg";
import item5 from "../src/assets/item5.jpeg";
import item6 from "../src/assets/item6.jpeg";
import item7 from "../src/assets/item7.jpeg";
import item8 from "../src/assets/item8.jpeg";
import item9 from "../src/assets/item9.jpeg";
import item10 from "../src/assets/item10.jpeg";
import item11 from "../src/assets/item11.jpeg";
import item12 from "../src/assets/item12.jpeg";
import item13 from "../src/assets/item13.jpeg";
import item14 from "../src/assets/item14.jpeg";
import item15 from "../src/assets/item15.jpeg";
import item16 from "../src/assets/item16.jpeg";
import item17 from "../src/assets/item17.jpeg";
import item18 from "../src/assets/item18.jpeg";
import item19 from "../src/assets/item19.jpeg";

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Cesta Romântica com Fotos, Ferrero Rocher e Flor no Balão",
    code: "Código: CRFF-AMOR",
    image: item1.src,
    price: 149.90, // Adjusted: Photos + Ferrero Rocher
    originalPrice: 189.90,
    installments: "4x de R$ 37,48",
    discount: 21,
    category: ["cestas", "cestas-romanticas", "datas-comemorativas"],
  },
  {
    id: 2,
    name: "Cesta Romântica com Doces e Foto",
    code: "Código: CRFD-MEUS",
    image: item6.src,
    price: 119.90, // Adjusted: Candies + balloon
    installments: "3x de R$ 39,97",
    category: ["cestas", "cestas-romanticas", "datas-comemorativas"],
  },
  {
    id: 3,
    name: "Cesta de Doces e Quadro Customizado",
    code: "Código: CRUF-AMOR",
    image: item3.src,
    price: 139.90, // Adjusted: Teddy bear + Ferrero Rocher
    originalPrice: 179.90,
    installments: "4x de R$ 34,98",
    discount: 22,
    category: ["cestas", "cestas-romanticas", "datas-comemorativas"],
  },
  {
    id: 4,
    name: "Cesta Romântica de Chocolates",
    code: "Código: CRBF-FELIZ",
    image: item4.src,
    price: 129.90, // Adjusted: Balloon + chocolates
    installments: "3x de R$ 43,30",
    category: ["cestas", "cestas-romanticas", "destaques"],
  },
  {
    id: 5,
    name: "Cesta com Chocolates e Balão",
    code: "Código: BRCB-FELIZ",
    image: item18.src,
    price: 89.90, // Adjusted: Chocolates + balloon
    installments: "2x de R$ 44,95",
    category: ["cestas", "datas-comemorativas"],
  },
  {
    id: 6,
    name: "Cesta Romântica com Ursinho e Cartas",
    code: "Código: CRUD-AMOR",
    image: item2.src,
    price: 129.90, // Adjusted: Teddy bear + candies
    installments: "3x de R$ 43,30",
    category: ["cestas", "cestas-romanticas", "destaques"],
  },
  {
    id: 7,
    name: "Combo de Rosas com Rafaello, Ferrero Rocher e Ursinho",
    code: "Código: BRFR-AMOR",
    image: item19.src,
    price: 299.90, // Adjusted: Ferrero Rocher + pillow
    installments: "3x de R$ 100,00",
    category: ["cestas", "mais-vendidos"],
  },
  {
    id: 8,
    name: "Café da Manhã Especial",
    code: "Código: CRFB-FELIZ",
    image: item15.src,
    price: 139.90, // Adjusted: Photos + chocolates
    installments: "4x de R$ 34,98",
    category: ["cestas", "cestas-romanticas", "datas-comemorativas"],
  },
  {
    id: 9,
    name: "Cesta Romântica com Ursinho, Fotos e Chocolates",
    code: "Código: CRDU-AMOR",
    image: item8.src,
    price: 159.90, // Adjusted: Teddy bear + balloon
    installments: "4x de R$ 39,98",
    category: ["cestas", "cestas-romanticas", "destaques"],
  },
  {
    id: 10,
    name: "Buquê de Rafaello com Almofada",
    code: "Código: BFRR-AMOR",
    image: item10.src,
    price: 79.90, // Adjusted: Ferrero Rocher bouquet
    installments: "2x de R$ 34,95",
    category: ["buques", "mais-vendidos"],
  },
  {
    id: 11,
    name: "Cesta Romântica com Pelúcia Stitch, Balão e Carta",
    code: "Código: CRBC-AMOR",
    image: item11.src,
    price: 139.90, // Adjusted: Stitch plush + chocolates
    originalPrice: 219.90,
    installments: "5x de R$ 35,98",
    discount: 18,
    category: ["cestas", "cestas-romanticas", "datas-comemorativas"],
  },
  {
    id: 12,
    name: "Cesta Tropical e Caixa de Chocolates",
    code: "Código: CRPF-AMOR",
    image: item12.src,
    price: 199.90, // Adjusted: Flowers + card
    installments: "5x de R$ 39,98",
    category: ["cestas", "cestas-romanticas", "destaques"],
  },
  {
    id: 13,
    name: "Buquê Elegante",
    code: "Código: CRSU-AMOR",
    image: item17.src,
    price: 169.90, // Adjusted: Teddy bear + blue balloon
    installments: "4x de R$ 42,48",
    category: ["cestas", "cestas-romanticas", "mais-vendidos"],
  },
  {
    id: 14,
    name: "Cesta Romântica com Balão",
    code: "Código: CRLB-AMOR",
    image: item9.src,
    price: 109.90, // Adjusted: Balloon + teddy bear
    installments: "3x de R$ 36,63",
    category: ["cestas", "cestas-romanticas", "destaques"],
  },
  {
    id: 15,
    name: "Buquê de Ferrero Rocher",
    code: "Código: CRBF-AMOR",
    image: item14.src,
    price: 79.90, // Adjusted: Ferrero Rocher bouquet
    installments: "2x de R$ 39,95",
    category: ["buques", "datas-comemorativas"],
  },
  {
    id: 16,
    name: "Buquê de Ferrero Rocher e Flores",
    code: "Código: CRFC-FELIZ",
    image: item16.src,
    price: 109.90, // Adjusted: Ferrero Rocher + flowers
    installments: "2x de R$ 54,95",
    category: ["buques", "mais-vendidos"],
  },
  {
    id: 17,
    name: "Cesta Romântica Stitch com Led",
    code: "Código: CRUB-VERM",
    image: item13.src,
    price: 80.90, // Adjusted: Teddy bear + roses
    installments: "2x de R$ 39,97",
    category: ["cestas", "cestas-romanticas", "destaques"],
  },
  {
    id: 18,
    name: "Cesta Romântica com Ursinho e Ferrero Rocher",
    code: "Código: BRVF-AMOR",
    image: item7.src,
    price: 99.90, // Adjusted: Roses + chocolates
    installments: "3x de R$ 33,30",
    category: ["buques", "flores", "datas-comemorativas"],
  },
  {
    id: 19,
    name: "Cesta Romântica com Ursinho e Champanhe",
    code: "Código: CRDF-AMOR",
    image: item5.src,
    price: 139.90, // Adjusted: Teddy bear + Ferrero Rocher
    originalPrice: 179.90,
    installments: "4x de R$ 34,98",
    discount: 22,
    category: ["cestas", "cestas-romanticas", "destaques"],
  },
];