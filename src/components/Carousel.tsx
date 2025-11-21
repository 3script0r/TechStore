import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];

interface CarouselProps {
  products: Product[];
}

export const Carousel = ({ products }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg mb-12">
      <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      <div className="h-full flex items-center">
        <div className="w-full grid md:grid-cols-2 gap-8 px-8 md:px-16">
          <div className="flex flex-col justify-center">
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
              NUEVO
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentProduct.name}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {currentProduct.description}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                ${currentProduct.price.toFixed(2)}
              </span>
              <span className="text-green-600 font-medium">
                {currentProduct.stock} disponibles
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-full h-80 rounded-lg overflow-hidden shadow-xl">
              <img
                src={currentProduct.image_url}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
