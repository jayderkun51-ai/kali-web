import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FotosPage from './pages/FotosPage';
import AdminPage from './pages/AdminPage';
import PerfilPage from './pages/PerfilPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [loadingTooLong, setLoadingTooLong] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLoadingTooLong(false);
      return;
    }
    const t = setTimeout(() => setLoadingTooLong(true), 9000);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#000' }}
      >
        <div className="text-center font-mono">
          <div
            className="text-2xl font-black mb-3"
            style={{ color: '#a855f7', animation: 'neon-pulse 1s infinite' }}
          >
            KALI-WEB
          </div>
          <div style={{ color: '#39ff14', fontSize: '12px' }}>
            {'>'} Loading protocols...
            <span className="cursor-blink">█</span>
          </div>
          {loadingTooLong && (
            <div className="mt-5 space-y-3">
              <div className="text-xs" style={{ color: '#6b21a8' }}>
                {'>'} Si esto se queda pegado, recarga o vuelve a login.
              </div>
              <button
                onClick={() => window.location.assign('/')}
                className="px-4 py-2 font-mono text-xs font-bold"
                style={{
                  background: 'rgba(168,85,247,0.12)',
                  border: '1px solid rgba(168,85,247,0.35)',
                  borderRadius: '10px',
                  color: '#e9d5ff',
                  cursor: 'pointer',
                }}
              >
                Volver a Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || user.role !== 'dios_admin') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <LoginPage />}
        />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fotos"
          element={
            <ProtectedRoute>
              <FotosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
