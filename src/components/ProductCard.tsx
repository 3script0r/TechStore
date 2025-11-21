import { Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isLowStock = product.stock < 10;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

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
              <span className={`text-sm font-medium ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
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
  );
};
