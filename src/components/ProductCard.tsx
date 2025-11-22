import { useState } from "react";
import { Database } from "../lib/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isLowStock = product.stock < 10;
  const [showImage, setShowImage] = useState(false);

  return (
    <>
      {/* 🧩 Tarjeta principal */}
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group relative">
        {/* Imagen del producto */}
        <div
          className="aspect-square overflow-hidden bg-gray-100 relative cursor-pointer"
          onClick={() => setShowImage(true)}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              product.stock === 0 ? "opacity-50 grayscale" : ""
            }`}
          />

          {/* 🔴 Texto “No disponible” si no hay stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-red-500 text-lg font-bold bg-white/80 px-3 py-1 rounded">
                No disponible
              </span>
            </div>
          )}
        </div>

        {/* Info del producto */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>

            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span
                  className={`text-sm font-medium ${
                    isLowStock ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {product.stock} en stock
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600">
                  Sin stock
                </span>
              )}
            </div>
          </div>

          {product.is_new && (
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                Nuevo
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🖼 Modal flotante de imagen */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImage(false)}
        >
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            />
            <button
              onClick={() => setShowImage(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};
