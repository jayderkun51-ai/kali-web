import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { RoleBadgeInline } from '../components/svg/RoleBadge';
import { UploadIcon } from '../components/svg/Icons';
import { supabase } from '../lib/supabase';
import { compressAvatarFile } from '../utils/avatarImage';

export default function PerfilPage() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!user) return null;

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;
    if (user.is_demo) {
      setErr('La foto de perfil solo con cuenta real (Supabase).');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setErr('Elige una imagen.');
      return;
    }

    setBusy(true);
    setErr('');
    try {
      const blob = await compressAvatarFile(file);
      const path = `${user.id}/avatar.jpg`;
      const { error: upErr } = await supabase.storage.from('kali-avatars').upload(path, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from('kali-avatars').getPublicUrl(path);
      const url = `${pub.publicUrl}?t=${Date.now()}`;

      const { error: dbErr } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      if (dbErr) throw dbErr;

      await refreshUser();
    } catch (e: any) {
      const raw = String(e?.message ?? e ?? '');
      if (/bucket not found|not found/i.test(raw)) {
        setErr(
          'Falta el bucket en Supabase (no es el tipo de foto). Ve a Storage → New bucket → nombre exacto: kali-avatars → público. Luego ejecuta supabase/storage_avatars.sql en el SQL Editor.',
        );
      } else {
        setErr(raw || 'No se pudo subir la imagen.');
      }
    } finally {
      setBusy(false);
    }
  };

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
          <div className="flex items-start justify-between gap-4 flex-wrap">
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

          {/* Avatar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="w-28 h-28 rounded-2xl object-cover"
                  style={{ border: '2px solid rgba(168,85,247,0.45)', boxShadow: '0 0 20px rgba(168,85,247,0.2)' }}
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center font-mono font-black text-3xl"
                  style={{
                    background: 'linear-gradient(135deg,#1f2937,#111827)',
                    border: '2px dashed rgba(168,85,247,0.35)',
                    color: '#9ca3af',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              <button
                type="button"
                disabled={busy || !!user.is_demo}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs font-bold w-full sm:w-auto transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(124,58,237,0.2)',
                  border: '1px solid rgba(168,85,247,0.4)',
                  color: '#e9d5ff',
                  cursor: user.is_demo ? 'not-allowed' : 'pointer',
                }}
              >
                <UploadIcon size={18} />
                {busy ? 'Subiendo...' : user.is_demo ? 'Avatar (solo cuenta real)' : 'Subir foto de perfil'}
              </button>
              {err && (
                <p className="font-mono text-[11px] mt-2" style={{ color: '#f87171' }}>
                  {err}
                </p>
              )}
              <p className="font-mono text-[10px] mt-2" style={{ color: '#4c1d95' }}>
                Bucket Storage: <span style={{ color: '#6b21a8' }}>kali-avatars</span> (público). Ver{' '}
                <code className="text-[10px]">supabase/storage_avatars.sql</code>
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
              <p className="font-mono font-bold mt-1 break-all" style={{ color: '#e9d5ff' }}>
                {user.email}
              </p>
            </div>
          </div>

          {user.role === 'super_pobre' && (
            <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(55,65,81,0.25)', border: '1px solid rgba(55,65,81,0.55)' }}>
              <p className="font-mono text-xs" style={{ color: '#9ca3af' }}>
                Chat: <span className="font-bold">{user.word_count}</span>/{user.is_demo ? 10 : 50} palabras
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
