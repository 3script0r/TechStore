import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Database } from '../lib/supabase';
import { Plus, Edit2, Trash2, Package, Heart, LogOut } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Wish = Database['public']['Tables']['wishes']['Row'];

export const AdminPage = () => {
  const { signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'wishes'>('products');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsRes, categoriesRes, wishesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('wishes').select('*').order('created_at', { ascending: false }),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (wishesRes.data) setWishes(wishesRes.data);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    await supabase.from('products').delete().eq('id', id);
    loadData();
  };

  const handleDeleteWish = async (id: string) => {
    await supabase.from('wishes').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5" />
            Productos
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'wishes'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-5 h-5" />
            Solicitudes ({wishes.length})
          </button>
        </div>

        {/* ------------------------ TABLA DE PRODUCTOS ------------------------ */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Gestión de Productos</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Agregar Producto
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3">Precio</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold">${product.price.toFixed(2)}</div>
                      </td>

                      <td className="px-6 py-4">{product.stock}</td>

                      <td className="px-6 py-4">
                        {product.is_new && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Nuevo
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------ SOLICITUDES ------------------------ */}
        {activeTab === 'wishes' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Solicitudes de Productos</h2>

            <div className="grid gap-4">
              {wishes.map((wish) => (
                <div key={wish.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{wish.user_name}</h3>
                      <p className="text-sm text-gray-500">{wish.user_email}</p>
                      <p className="mt-2">{wish.product_description}</p>

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(wish.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteWish(wish.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {wishes.length === 0 && (
                <div className="text-center py-12 text-gray-500">No hay solicitudes</div>
              )}
            </div>
          </div>
        )}
      </main>

      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setShowProductForm(false);
            setEditingProduct(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------
   ------------------- MODAL COMPLETO ---------------------
   ------------------------------------------------------- */

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

const ProductFormModal = ({ product, categories, onClose, onSave }: ProductFormModalProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    category_id: product?.category_id || categories[0]?.id || '',
    image_url: product?.image_url || '',
    is_new: product?.is_new || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // SUBIR IMAGEN AL STORAGE
  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    const ext = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, imageFile);

    if (error) {
      alert('Error subiendo la imagen');
      return formData.image_url;
    }

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await uploadImage();

    const payload = {
      ...formData,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-6">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Precio</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium">Categoría</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium">Imagen del producto</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full"
            />

            {formData.image_url && (
              <img
                src={formData.image_url}
                className="w-24 h-24 mt-2 rounded object-cover"
              />
            )}
          </div>

          {/* Nuevo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_new}
              onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
            />
            <span>Marcar como nuevo</span>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 py-3 rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? 'Guardando…' : product ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
