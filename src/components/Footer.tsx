import { Facebook, Instagram, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import Image from "next/image"; // Import Image component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Newsletter section */}
      <div className="bg-green-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              Receba nossas ofertas por e-mail! Cadastre-se em nossa lista de e-mail de cupons, narra das promoções, eventos de flores e buquês
            </h3>
            <div className="flex justify-center items-center space-x-4 mt-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="bg-white text-black"
              />
              <Button variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact info */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Contato</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>São Paulo, SP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>(64) 98118-7808</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Seg - Sex: 8h às 18h</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button type="button" className="hover:text-green-600 text-left">Cestas de Café da Manhã</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Buquês e Flores</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Cestas</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Cestas Românticas</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Arranjos</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Datas Comemorativas</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Cestas de Chocolate</button></li>
              </ul>
            </div>

            {/* Institutional */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Institucional</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button type="button" className="hover:text-green-600 text-left">Sobre Nós</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Política de Entrega</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Devolução e Troca</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Termos de Uso</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Política de Privacidade</button></li>
                <li><button type="button" className="hover:text-green-600 text-left">Fale Conosco</button></li>
              </ul>
            </div>

            {/* Payment and security */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Formas de Pagamento</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="relative h-8">
                    <Image
                      src="https://ext.same-assets.com/1148377775/629563960.png"
                      alt="Visa"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="relative h-8">
                    <Image
                      src="https://ext.same-assets.com/1148377775/3832675979.png"
                      alt="Mastercard"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="relative h-8">
                    <Image
                      src="https://ext.same-assets.com/1148377775/1555632808.png"
                      alt="Elo"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="relative h-8">
                    <Image
                      src="https://ext.same-assets.com/1148377775/1584880037.png"
                      alt="PIX"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="relative h-12">
                    <Image
                      src="https://ext.same-assets.com/1148377775/1559868665.png"
                      alt="Site Seguro"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-2">Siga-nos</h5>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="p-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 Flor de Lima. Todos os direitos reservados.</p>
            <p className="mt-1">Floricultura SP - Floricultura São Paulo</p>
          </div>
        </div>
      </div>
    </footer>
  );
}