import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { CyberBackground } from '../components/svg/CyberBackground';
import { RoleBadgeInline } from '../components/svg/RoleBadge';
import { TrophyIcon } from '../components/svg/Icons';
import { KaliLogo } from '../components/svg/KaliLogo';

type Achievement = {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
};

export default function RecompensasPage() {
  const { user } = useAuth();
  if (!user) return null;

  const limitWords = user.is_demo ? 10 : 50;
  const wc = user.word_count ?? 0;
  const pc = user.photo_count ?? 0;

  const achievements: Achievement[] = [
    {
      id: 'voice',
      title: 'Voz en el barrio',
      desc: 'Manda tu primera palabra al chat.',
      unlocked: wc >= 1,
    },
    {
      id: 'chatter',
      title: 'Cotorreo nivel Dios',
      desc: `Llega a ${Math.min(25, limitWords)} palabras en el chat.`,
      unlocked: wc >= Math.min(25, limitWords),
    },
    {
      id: 'cap',
      title: user.is_demo ? 'Cupón demo lleno' : 'Tope Super Pobre',
      desc: user.is_demo
        ? `Llega a ${limitWords} palabras en modo demo.`
        : `Agota tu cupo de ${limitWords} palabras en plan gratis (o haz upgrade).`,
      unlocked: user.role === 'super_pobre' && wc >= limitWords,
    },
    {
      id: 'first_photo',
      title: 'Primera evidencia',
      desc: 'Sube tu primera foto al muro.',
      unlocked: pc >= 1,
    },
    {
      id: 'wall',
      title: 'Curador del muro',
      desc: 'Sube 5 fotos al muro (tope gratis).',
      unlocked: pc >= 5,
    },
    {
      id: 'pro',
      title: 'Compi de verdad',
      desc: 'Rango Compi Pro o Dios Admin.',
      unlocked: user.role === 'compi_pro' || user.role === 'dios_admin',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen relative pt-20 pb-24 px-4">
      <CyberBackground />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-3">
            <KaliLogo size={72} />
          </div>
          <div className="inline-flex items-center gap-2 justify-center">
            <TrophyIcon size={28} color="#fbbf24" />
            <h1 className="font-black font-mono text-2xl tracking-widest" style={{ color: '#a855f7' }}>
              RECOMPENSAS
            </h1>
          </div>
          <p className="font-mono text-xs mt-2" style={{ color: '#39ff14' }}>
            {'>'} logros del cyber-barrio · {unlockedCount}/{achievements.length} desbloqueados
          </p>
          <div className="mt-3 flex justify-center">
            <RoleBadgeInline role={user.role} />
          </div>
        </motion.div>

        <div className="grid gap-4">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5 font-mono text-left"
              style={{
                background: a.unlocked ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.45)',
                border: `1px solid ${a.unlocked ? 'rgba(168,85,247,0.45)' : 'rgba(55,65,81,0.5)'}`,
                boxShadow: a.unlocked ? '0 0 24px rgba(168,85,247,0.15)' : 'none',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-widest" style={{ color: a.unlocked ? '#39ff14' : '#4b5563' }}>
                    {a.unlocked ? '● DESBLOQUEADO' : '○ BLOQUEADO'}
                  </p>
                  <p className="font-bold text-sm mt-1" style={{ color: a.unlocked ? '#e9d5ff' : '#6b7280' }}>
                    {a.title}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9ca3af' }}>
                    {a.desc}
                  </p>
                </div>
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: a.unlocked ? 'rgba(251,191,36,0.15)' : 'rgba(31,41,55,0.6)',
                    border: `1px solid ${a.unlocked ? 'rgba(251,191,36,0.4)' : 'rgba(55,65,81,0.8)'}`,
                  }}
                >
                  <TrophyIcon size={24} color={a.unlocked ? '#fbbf24' : '#4b5563'} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-mono text-[11px] mt-8" style={{ color: '#4c1d95' }}>
          Tip: los contadores de chat/fotos vienen de tu perfil en Supabase (cuenta real).
        </p>
      </div>
    </div>
  );
}
