import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { KaliLogo } from './svg/KaliLogo';
import { RoleBadgeInline } from './svg/RoleBadge';
import { HomeIcon, ChatIcon, PhotoIcon, AdminIcon, LogoutIcon, UserIcon } from './svg/Icons';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { path: '/home', label: 'MURO', icon: <HomeIcon size={18} color={location.pathname === '/home' ? '#a855f7' : '#6b21a8'} /> },
    { path: '/chat', label: 'CHAT', icon: <ChatIcon size={18} color={location.pathname === '/chat' ? '#a855f7' : '#6b21a8'} /> },
    { path: '/fotos', label: 'FOTOS', icon: <PhotoIcon size={18} color={location.pathname === '/fotos' ? '#a855f7' : '#6b21a8'} /> },
    { path: '/perfil', label: 'PERFIL', icon: <UserIcon size={18} color={location.pathname === '/perfil' ? '#a855f7' : '#6b21a8'} /> },
    ...(user.role === 'dios_admin' ? [{ path: '/admin', label: 'ADMIN', icon: <AdminIcon size={18} color={location.pathname === '/admin' ? '#f97316' : '#6b21a8'} /> }] : []),
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(5,0,15,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(168,85,247,0.25)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo + Brand */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 transition-all hover:opacity-80"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <KaliLogo size={36} />
          <div className="hidden sm:block">
            <span className="font-black font-mono text-lg tracking-widest" style={{ color: '#a855f7' }}>
              KALI<span style={{ color: '#39ff14' }}>-</span>WEB
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all rounded-lg"
              style={{
                background: location.pathname === item.path ? 'rgba(168,85,247,0.15)' : 'transparent',
                border: location.pathname === item.path ? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent',
                color: location.pathname === item.path ? '#e9d5ff' : '#4c1d95',
                cursor: 'pointer',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Online indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: '#39ff14', boxShadow: '0 0 6px #39ff14' }} />
            </motion.div>
            <span className="text-xs font-mono" style={{ color: '#39ff14' }}>ONLINE</span>
          </div>

          {/* User badge */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
            style={{
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.2)',
              cursor: 'pointer',
            }}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs"
              style={{
                background: user.role === 'dios_admin' ? 'linear-gradient(135deg,#7c3aed,#d946ef)' : user.role === 'compi_pro' ? 'linear-gradient(135deg,#92400e,#b45309)' : 'rgba(55,65,81,0.8)',
                color: '#fff',
                boxShadow: user.role === 'dios_admin' ? '0 0 10px rgba(217,70,239,0.5)' : user.role === 'compi_pro' ? '0 0 10px rgba(251,191,36,0.3)' : 'none',
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-xs font-mono font-bold" style={{ color: user.role === 'dios_admin' ? '#d946ef' : user.role === 'compi_pro' ? '#fbbf24' : '#9ca3af' }}>
              {user.username.substring(0, 12)}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div
        className="md:hidden flex items-center justify-around border-t"
        style={{ borderColor: 'rgba(168,85,247,0.15)', padding: '8px 0' }}
      >
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 px-4 py-1 transition-all"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {item.icon}
            <span className="text-xs font-mono" style={{ color: location.pathname === item.path ? '#a855f7' : '#4c1d95', fontSize: '9px' }}>
              {item.label}
            </span>
          </button>
        ))}
        <button
          onClick={signOut}
          className="flex flex-col items-center gap-1 px-4 py-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogoutIcon size={18} />
          <span className="text-xs font-mono" style={{ color: '#ef4444', fontSize: '9px' }}>SALIR</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-4"
            style={{
              background: 'rgba(10,0,25,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168,85,247,0.3)',
              borderRadius: '10px',
              padding: '12px',
              minWidth: '200px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
            }}
          >
            <div className="mb-3 pb-3" style={{ borderBottom: '1px solid rgba(168,85,247,0.15)' }}>
              <p className="text-xs font-mono font-bold" style={{ color: user.role === 'dios_admin' ? '#d946ef' : user.role === 'compi_pro' ? '#fbbf24' : '#9ca3af' }}>
                @{user.username}
              </p>
              <div className="mt-1">
                <RoleBadgeInline role={user.role} />
              </div>
              <p className="text-xs font-mono mt-1" style={{ color: '#4c1d95' }}>{user.email}</p>
            </div>

            {user.role === 'super_pobre' && (
              <div className="mb-3 p-2 rounded" style={{ background: 'rgba(55,65,81,0.3)', border: '1px solid rgba(55,65,81,0.5)' }}>
                <p className="text-xs font-mono" style={{ color: '#9ca3af' }}>Chat: {user.word_count}/50 palabras</p>
                <p className="text-xs font-mono" style={{ color: '#9ca3af' }}>Fotos: {user.photo_count}/5</p>
              </div>
            )}

            <button
              onClick={() => { signOut(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded font-mono text-xs font-bold transition-all"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}
            >
              <LogoutIcon size={14} /> CERRAR SESIÓN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
