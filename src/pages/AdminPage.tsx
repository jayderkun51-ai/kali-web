import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CyberBackground } from '../components/svg/CyberBackground';
import { RoleBadgeInline } from '../components/svg/RoleBadge';
import { KaliLogo } from '../components/svg/KaliLogo';
import { ShieldIcon, BanIcon, CrownIcon, AlertIcon, AdminIcon, CloseIcon } from '../components/svg/Icons';
import type { UserRole } from '../lib/supabase';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  banned: boolean;
  word_count: number;
  photo_count: number;
  joined: string;
}

type AdminTab = 'usuarios' | 'anuncios' | 'stats';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tab, setTab] = useState<AdminTab>('usuarios');
  const [announcement, setAnnouncement] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [confirmBan, setConfirmBan] = useState<AdminUser | null>(null);
  const [glitch, setGlitch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [announcementSending, setAnnouncementSending] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  if (!user || user.role !== 'dios_admin') {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <CyberBackground />
        <div className="relative z-10 text-center p-8">
          <ShieldIcon size={64} color="#ef4444" className="mx-auto mb-4" />
          <h1 className="font-black font-mono text-2xl mb-2" style={{ color: '#ef4444' }}>ACCESO DENEGADO</h1>
          <p className="font-mono text-sm mb-6" style={{ color: '#6b7280' }}>No eres el Dios Admin, causa.</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 font-mono font-bold"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const mapAdminUser = (row: any): AdminUser => ({
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    banned: row.banned,
    word_count: row.word_count,
    photo_count: row.photo_count,
    joined: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '-',
  });

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id,username,email,role,banned,word_count,photo_count,created_at')
      .order('created_at', { ascending: true });
    if (data) setUsers(data.map(mapAdminUser));
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      await loadUsers();
      if (mounted) setLoading(false);
    };
    init();

    const channel = supabase
      .channel('admin_profiles_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        loadUsers();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleBan = async (targetUser: AdminUser) => {
    if (targetUser.role === 'dios_admin') return;
    setActionUserId(targetUser.id);
    await supabase
      .from('profiles')
      .update({ banned: !targetUser.banned })
      .eq('id', targetUser.id);
    await loadUsers();
    setConfirmBan(null);
    setActionUserId(null);
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    setActionUserId(userId);
    await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    await loadUsers();
    setActionUserId(null);
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.trim()) return;
    setAnnouncementSending(true);
    setGlitch(true);
    await supabase.from('global_announcements').update({ active: false }).eq('active', true);
    const { error } = await supabase.from('global_announcements').insert({
      content: announcement.trim(),
      active: true,
      created_by: user.id,
    });
    setGlitch(false);
    if (!error) {
      setAnnouncementSent(true);
      setAnnouncement('');
      setTimeout(() => setAnnouncementSent(false), 3000);
    }
    setAnnouncementSending(false);
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'dios_admin').length,
    pros: users.filter(u => u.role === 'compi_pro').length,
    pobres: users.filter(u => u.role === 'super_pobre').length,
    banned: users.filter(u => u.banned).length,
  };

  return (
    <div className="min-h-screen relative">
      <CyberBackground />

      {/* Glitch overlay */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ background: 'rgba(217,70,239,0.08)' }}
          >
            <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: '3px', background: '#d946ef', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: '1px', background: '#39ff14', opacity: 0.4 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 pt-20 md:pt-16 pb-16 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            animate={{ filter: ['drop-shadow(0 0 8px #d946ef)', 'drop-shadow(0 0 20px #a855f7)', 'drop-shadow(0 0 8px #d946ef)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <KaliLogo size={60} />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <AdminIcon size={20} color="#f97316" />
              <h1 className="font-black font-mono text-2xl" style={{ color: '#d946ef' }}>PANEL DE CONTROL</h1>
            </div>
            <p className="font-mono text-xs" style={{ color: '#39ff14' }}>
              {'>'} Dios Admin Mode · Full Access · root@kali-web
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Usuarios', value: stats.total, color: '#a855f7', icon: '👥' },
            { label: 'Compi Pro', value: stats.pros, color: '#fbbf24', icon: '⭐' },
            { label: 'Super Pobres', value: stats.pobres, color: '#6b7280', icon: '💀' },
            { label: 'Baneados', value: stats.banned, color: '#ef4444', icon: '🚫' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(10,0,25,0.7)',
                border: `1px solid ${stat.color}33`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 20px ${stat.color}11`,
              }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-black font-mono text-2xl" style={{ color: stat.color }}>{stat.value}</div>
              <div className="font-mono text-xs mt-1" style={{ color: '#4c1d95' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(['usuarios', 'anuncios', 'stats'] as AdminTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 font-mono font-bold text-xs tracking-wider rounded-lg transition-all"
              style={{
                background: tab === t ? 'rgba(217,70,239,0.2)' : 'rgba(0,0,0,0.4)',
                border: `1px solid ${tab === t ? '#d946ef' : 'rgba(168,85,247,0.2)'}`,
                color: tab === t ? '#f0abfc' : '#6b21a8',
                cursor: 'pointer',
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab: Usuarios */}
        {tab === 'usuarios' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {loading && (
              <div className="mb-3 font-mono text-xs" style={{ color: '#39ff14' }}>
                {'>'} Cargando usuarios...
              </div>
            )}
            <div className="space-y-3">
              {users.map(u => (
                <motion.div
                  key={u.id}
                  whileHover={{ scale: 1.005 }}
                  className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{
                    background: u.banned ? 'rgba(239,68,68,0.07)' : 'rgba(10,0,25,0.7)',
                    border: `1px solid ${u.banned ? 'rgba(239,68,68,0.3)' : 'rgba(168,85,247,0.2)'}`,
                    backdropFilter: 'blur(10px)',
                    opacity: u.banned ? 0.7 : 1,
                  }}
                >
                  {/* Avatar + info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-black text-sm flex-shrink-0"
                      style={{
                        background: u.role === 'dios_admin' ? 'linear-gradient(135deg,#7c3aed,#d946ef)' : u.role === 'compi_pro' ? 'linear-gradient(135deg,#92400e,#b45309)' : 'rgba(55,65,81,0.8)',
                        color: '#fff',
                        boxShadow: u.banned ? 'none' : u.role === 'dios_admin' ? '0 0 10px rgba(217,70,239,0.4)' : 'none',
                      }}
                    >
                      {u.banned ? '🚫' : u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm" style={{ color: u.role === 'dios_admin' ? '#d946ef' : u.role === 'compi_pro' ? '#fbbf24' : '#9ca3af' }}>
                          {u.username}
                        </span>
                        <RoleBadgeInline role={u.role} />
                        {u.banned && <span className="text-xs font-mono" style={{ color: '#ef4444' }}>🚫 BANEADO</span>}
                      </div>
                      <p className="font-mono text-xs" style={{ color: '#4c1d95' }}>{u.email}</p>
                      {u.role === 'super_pobre' && (
                        <p className="font-mono text-xs" style={{ color: '#374151' }}>
                          Chat: {u.word_count}/50w · Fotos: {u.photo_count}/5
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {u.id !== user.id && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Role selector */}
                      <select
                        value={u.role}
                        onChange={e => handleChangeRole(u.id, e.target.value as UserRole)}
                        disabled={actionUserId === u.id}
                        className="px-3 py-1.5 font-mono text-xs rounded-lg outline-none"
                        style={{
                          background: 'rgba(0,0,0,0.6)',
                          border: '1px solid rgba(168,85,247,0.3)',
                          color: '#a855f7',
                          cursor: actionUserId === u.id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <option value="super_pobre">💀 Super Pobre</option>
                        <option value="compi_pro">⭐ Compi Pro</option>
                        <option value="dios_admin">👑 Dios Admin</option>
                      </select>

                      {/* Ban button */}
                      <motion.button
                        onClick={() => setConfirmBan(u)}
                        disabled={actionUserId === u.id}
                        className="flex items-center gap-1 px-3 py-1.5 font-mono text-xs font-bold rounded-lg"
                        style={{
                          background: u.banned ? 'rgba(57,255,20,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${u.banned ? 'rgba(57,255,20,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          color: u.banned ? '#39ff14' : '#ef4444',
                          cursor: actionUserId === u.id ? 'not-allowed' : 'pointer',
                          opacity: actionUserId === u.id ? 0.6 : 1,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <BanIcon size={12} color={u.banned ? '#39ff14' : '#ef4444'} />
                        {u.banned ? 'Desbanear' : 'Banear'}
                      </motion.button>
                    </div>
                  )}

                  {u.id === user.id && (
                    <div className="flex items-center gap-2">
                      <CrownIcon size={18} color="#fbbf24" />
                      <span className="font-mono text-xs" style={{ color: '#fbbf24' }}>Tu cuenta admin</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab: Anuncios */}
        {tab === 'anuncios' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="p-6 rounded-xl"
              style={{
                background: 'rgba(10,0,25,0.8)',
                border: '1px solid rgba(217,70,239,0.3)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 30px rgba(217,70,239,0.1)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertIcon size={20} color="#d946ef" />
                <h2 className="font-black font-mono text-lg" style={{ color: '#d946ef' }}>
                  ANUNCIO GLOBAL
                </h2>
              </div>

              <p className="font-mono text-xs mb-4" style={{ color: '#6b21a8' }}>
                {'>'} El mensaje aparecerá en pantalla completa para TODOS los usuarios con efectos de glitch.
              </p>

              <textarea
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                placeholder="Escribe el anuncio global aquí... (ej: ¡Todos a la reunión ahora!)"
                rows={4}
                className="w-full px-4 py-3 mb-4 font-mono text-sm outline-none rounded-xl resize-none"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(217,70,239,0.3)',
                  color: '#e9d5ff',
                }}
                onFocus={e => e.target.style.borderColor = '#d946ef'}
                onBlur={e => e.target.style.borderColor = 'rgba(217,70,239,0.3)'}
              />

              <AnimatePresence>
                {announcementSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 rounded-lg font-mono text-xs text-center"
                    style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)', color: '#39ff14' }}
                  >
                    ✓ Anuncio global enviado con éxito — todos los usuarios lo verán
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleSendAnnouncement}
                disabled={!announcement.trim() || announcementSending}
                className="w-full py-4 font-mono font-black text-sm tracking-widest"
                style={{
                  background: announcement.trim() && !announcementSending ? 'linear-gradient(135deg,#7c3aed,#d946ef)' : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${announcement.trim() && !announcementSending ? '#d946ef' : 'rgba(168,85,247,0.2)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: announcement.trim() && !announcementSending ? 'pointer' : 'not-allowed',
                  boxShadow: announcement.trim() && !announcementSending ? '0 0 30px rgba(217,70,239,0.4)' : 'none',
                  opacity: announcement.trim() && !announcementSending ? 1 : 0.5,
                }}
                whileHover={announcement.trim() && !announcementSending ? { scale: 1.02, boxShadow: '0 0 50px rgba(217,70,239,0.6)' } : {}}
                whileTap={announcement.trim() && !announcementSending ? { scale: 0.98 } : {}}
              >
                {announcementSending ? 'Enviando anuncio...' : '📡 LANZAR ANUNCIO GLOBAL A TODOS'}
              </motion.button>

              <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="font-mono text-xs" style={{ color: '#fca5a5' }}>
                  ⚠ Úsalo con responsabilidad, causa. Este mensaje interrumpe a todos los usuarios en tiempo real con efectos de glitch.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab: Stats */}
        {tab === 'stats' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Users breakdown */}
              <div className="p-5 rounded-xl" style={{ background: 'rgba(10,0,25,0.7)', border: '1px solid rgba(168,85,247,0.2)', backdropFilter: 'blur(10px)' }}>
                <h3 className="font-mono font-bold text-sm mb-4" style={{ color: '#a855f7' }}>DISTRIBUCIÓN DE ROLES</h3>
                <div className="space-y-3">
                  {[
                    { label: '👑 Dios Admin', count: stats.admins, total: stats.total, color: '#d946ef' },
                    { label: '⭐ Compi Pro', count: stats.pros, total: stats.total, color: '#fbbf24' },
                    { label: '💀 Super Pobre', count: stats.pobres, total: stats.total, color: '#6b7280' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-xs" style={{ color: item.color }}>{item.label}</span>
                        <span className="font-mono text-xs" style={{ color: item.color }}>{item.count}/{item.total}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(55,65,81,0.5)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / item.total) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System info */}
              <div className="p-5 rounded-xl" style={{ background: 'rgba(10,0,25,0.7)', border: '1px solid rgba(57,255,20,0.2)', backdropFilter: 'blur(10px)' }}>
                <h3 className="font-mono font-bold text-sm mb-4" style={{ color: '#39ff14' }}>SISTEMA</h3>
                <div className="space-y-2 font-mono text-xs" style={{ color: '#39ff14' }}>
                  {[
                    ['Sistema', 'ONLINE ✓'],
                    ['DB', 'PostgreSQL (Supabase)'],
                    ['Auth', 'OTP Email'],
                    ['Storage', 'Supabase Buckets'],
                    ['Realtime', 'WebSocket activo'],
                    ['Versión', 'Kali-Web v2.4.7'],
                    ['Deploy', 'Vercel Edge'],
                    ['Encriptación', 'TLS 1.3'],
                  ].map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1" style={{ borderBottom: '1px solid rgba(57,255,20,0.07)' }}>
                      <span style={{ color: '#4c1d95' }}>{key}:</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Ban Confirmation Modal */}
      <AnimatePresence>
        {confirmBan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="p-6 rounded-xl max-w-sm w-full"
              style={{
                background: 'rgba(10,0,25,0.98)',
                border: `1px solid ${confirmBan.banned ? 'rgba(57,255,20,0.4)' : 'rgba(239,68,68,0.4)'}`,
                boxShadow: `0 0 40px ${confirmBan.banned ? 'rgba(57,255,20,0.15)' : 'rgba(239,68,68,0.15)'}`,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <BanIcon size={20} color={confirmBan.banned ? '#39ff14' : '#ef4444'} />
                  <h3 className="font-black font-mono text-base" style={{ color: confirmBan.banned ? '#39ff14' : '#ef4444' }}>
                    {confirmBan.banned ? 'DESBANEAR' : 'BANEAR'} USUARIO
                  </h3>
                </div>
                <button onClick={() => setConfirmBan(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CloseIcon size={16} />
                </button>
              </div>
              <p className="font-mono text-sm mb-6" style={{ color: '#e9d5ff' }}>
                ¿{confirmBan.banned ? 'Desbanear' : 'Banear'} a <strong style={{ color: '#a855f7' }}>{confirmBan.username}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmBan(null)}
                  className="flex-1 py-2 font-mono text-xs"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', color: '#6b21a8', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleToggleBan(confirmBan)}
                  className="flex-1 py-2 font-mono font-bold text-xs"
                  style={{
                    background: confirmBan.banned ? 'rgba(57,255,20,0.15)' : 'rgba(239,68,68,0.15)',
                    border: `1px solid ${confirmBan.banned ? '#39ff14' : '#ef4444'}`,
                    borderRadius: '8px',
                    color: confirmBan.banned ? '#39ff14' : '#ef4444',
                    cursor: 'pointer',
                  }}
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
