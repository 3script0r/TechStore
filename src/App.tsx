import { useAuth } from './contexts/AuthContext';
import { StorePage } from './pages/StorePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (window.location.pathname === '/admin') {
    if (!user) {
      return <LoginPage />;
    }
    if (isAdmin) {
      return <AdminPage />;
    }
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos de administrador</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Volver a la tienda
          </a>
        </div>
      </div>
    );
  }

  return <StorePage />;
}

export default App;
