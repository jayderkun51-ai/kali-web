import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CyberBackground } from '../components/svg/CyberBackground';
import { KaliLogo } from '../components/svg/KaliLogo';

export default function AdminLoginPage() {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginDemo } = useAuth();

  const hint = useMemo(() => 'root@kali-web:~# sudo -S ./enter_admin', []);

  const handleEnter = () => {
    setError('');
    // Phase 1: local-only gate for your personal admin access (demo).
    // Phase 2 will replace this with real Supabase auth + role checks.
    if (pass.trim().length < 4) {
      setError('Clave muy corta. Mete algo, causa.');
      return;
    }
    loginDemo('admin@kali.web');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <CyberBackground />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <KaliLogo size={86} />
          <h1 className="mt-3 font-black font-mono text-2xl tracking-widest glitch-text" data-text="ADMIN ACCESS" style={{ color: '#d946ef' }}>
            ADMIN ACCESS
          </h1>
          <p className="font-mono text-xs mt-1" style={{ color: '#39ff14' }}>
            {'>'} {hint}
          </p>
        </div>

        <div
          className="glass-card rounded-2xl p-6"
          style={{
            borderColor: 'rgba(217,70,239,0.35)',
            boxShadow: '0 0 50px rgba(217,70,239,0.12)',
          }}
        >
          {error && (
            <div className="mb-4 p-3 rounded font-mono text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5' }}>
              ⚠ {error}
            </div>
          )}

          <label className="block text-xs font-mono mb-2" style={{ color: '#d946ef' }}>
            CLAVE (solo tú)
          </label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
            style={{
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(217,70,239,0.35)',
              borderRadius: '12px',
              color: '#e9d5ff',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleEnter();
            }}
          />

          <motion.button
            onClick={handleEnter}
            className="w-full mt-4 py-3 font-mono font-bold text-sm tracking-wider"
            style={{
              background: 'linear-gradient(135deg,#7c3aed,#d946ef)',
              border: '1px solid rgba(217,70,239,0.4)',
              borderRadius: '12px',
              color: '#fff',
              boxShadow: '0 0 22px rgba(217,70,239,0.25)',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(217,70,239,0.45)' }}
            whileTap={{ scale: 0.98 }}
          >
            ▶ ENTRAR A /admin
          </motion.button>

          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full mt-3 text-xs font-mono py-2 transition-all"
            style={{ color: '#6b21a8', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Volver al login normal
          </button>
        </div>
      </motion.div>
    </div>
  );
}

