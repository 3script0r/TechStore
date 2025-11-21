import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WishFormProps {
  onClose: () => void;
}

export const WishForm = ({ onClose }: WishFormProps) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    productDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('wishes').insert({
      user_name: formData.userName,
      user_email: formData.userEmail,
      product_description: formData.productDescription,
    });

    setLoading(false);

    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Solicitud de Producto</h2>
            <p className="text-gray-600 text-sm">Cuéntanos qué buscas</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Solicitud Enviada</h3>
            <p className="text-gray-600">Te contactaremos pronto con más información</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Tu Nombre
              </label>
              <input
                id="userName"
                type="text"
                required
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Tu Email
              </label>
              <input
                id="userEmail"
                type="email"
                required
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Producto
              </label>
              <textarea
                id="productDescription"
                required
                value={formData.productDescription}
                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Describe el producto que buscas..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
