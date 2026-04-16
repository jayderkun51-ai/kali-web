import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { RoleBadgeInline } from '../components/svg/RoleBadge';

export default function PerfilPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card rounded-2xl p-6"
          style={{
            borderColor: 'rgba(168,85,247,0.3)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-black font-mono text-2xl tracking-widest" style={{ color: '#a855f7' }}>
                PERFIL
              </h1>
              <p className="font-mono text-xs mt-1" style={{ color: '#39ff14' }}>
                {'>'} identity --secure
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block">
                <RoleBadgeInline role={user.role} />
              </div>
              <p className="font-mono text-xs mt-2" style={{ color: '#4c1d95' }}>
                {user.created_at ? new Date(user.created_at).toLocaleString() : ''}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(168,85,247,0.18)' }}>
              <p className="font-mono text-[10px] tracking-widest" style={{ color: '#6b21a8' }}>
                USERNAME
              </p>
              <p className="font-mono font-bold mt-1" style={{ color: '#e9d5ff' }}>
                @{user.username}
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(168,85,247,0.18)' }}>
              <p className="font-mono text-[10px] tracking-widest" style={{ color: '#6b21a8' }}>
                EMAIL
              </p>
              <p className="font-mono font-bold mt-1" style={{ color: '#e9d5ff' }}>
                {user.email}
              </p>
            </div>
          </div>

          {user.role === 'super_pobre' && (
            <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(55,65,81,0.25)', border: '1px solid rgba(55,65,81,0.55)' }}>
              <p className="font-mono text-xs" style={{ color: '#9ca3af' }}>
                Chat: <span className="font-bold">{user.word_count}</span>/50 palabras
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: '#9ca3af' }}>
                Fotos: <span className="font-bold">{user.photo_count}</span>/5
              </p>
              <p className="font-mono text-[11px] mt-3" style={{ color: '#39ff14' }}>
                {'>'} upgrade --yape --amount 5.00
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

