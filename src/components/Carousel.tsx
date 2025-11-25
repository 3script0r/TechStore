import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Database } from "../lib/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface CarouselProps {
  products: Product[];
}

export const Carousel = ({ products }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  // 📱 Eventos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    // Si el movimiento es suficiente (>50px), cambiar de slide
    if (distance > 50) goToNext();
    else if (distance < -50) goToPrevious();

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div
      className="relative w-full h-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg mb-12"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 🔘 Flechas */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* 🖼 Contenido */}
      <div className="flex flex-col md:grid md:grid-cols-2 items-center justify-center px-4 sm:px-8 md:px-16 py-6 md:py-0 gap-6 select-none">
        {/* Imagen (visible en todos los tamaños) */}
        <div className="flex items-center justify-center w-full order-1 md:order-2">
          <div className="w-full sm:w-3/4 md:w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <img
              src={currentProduct.image_url}
              alt={currentProduct.name}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-center text-center md:text-left order-2 md:order-1">
          <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit mx-auto md:mx-0">
            NUEVO
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentProduct.name}
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-6">
            {currentProduct.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 md:gap-4">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              ${currentProduct.price.toFixed(2)}
            </span>
            <span className="text-green-600 font-medium">
              {currentProduct.stock} disponibles
            </span>
          </div>
        </div>
      </div>

      {/* 🔵 Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-400"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
