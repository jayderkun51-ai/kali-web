import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { CyberBackground } from '../components/svg/CyberBackground';
import { RoleBadgeInline } from '../components/svg/RoleBadge';
import { SendIcon, WifiIcon, AlertIcon } from '../components/svg/Icons';
import { UpgradeModal } from '../components/UpgradeModal';

interface Message {
  id: string;
  username: string;
  role: 'super_pobre' | 'compi_pro' | 'dios_admin';
  content: string;
  time: string;
}

const MOCK_MESSAGES: Message[] = [
  { id: '1', username: 'KaliAdmin', role: 'dios_admin', content: '¡Bienvenidos a la red, compis! 👑 El sistema está activo.', time: '22:01' },
  { id: '2', username: 'CompiPro_777', role: 'compi_pro', content: 'Qué crack el sistema nuevo 🔥 Todo fluye rápido.', time: '22:03' },
  { id: '3', username: 'Pelado_Dev', role: 'super_pobre', content: 'Todo bonito pero sin feria pa upgrade jajaja 💀', time: '22:05' },
  { id: '4', username: 'KaliAdmin', role: 'dios_admin', content: 'Yapea noma pata, solo 5 soles 😂 948097148', time: '22:06' },
  { id: '5', username: 'CompiPro_777', role: 'compi_pro', content: 'Vale la pena la suscripción, las fotos en HD salen brutales.', time: '22:08' },
];

const GLOBAL_ANNOUNCEMENT = {
  active: false,
  content: '🚨 ANUNCIO GLOBAL: ¡Nuevo update disponible! El Admin manda saludos a todos los compis. 🎉',
};

export default function HomePage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(GLOBAL_ANNOUNCEMENT);
  const [wordCount, setWordCount] = useState(user?.word_count || 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatWordLimit =
    user?.role === 'super_pobre'
      ? (user.is_demo ? 10 : 50)
      : null;

  useEffect(() => {
    if (!user) return;
    const key = `kali_chat_words:${user.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) setWordCount(parsed);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const key = `kali_chat_words:${user.id}`;
    localStorage.setItem(key, String(wordCount));
  }, [user, wordCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate realtime message from another user
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        username: 'CompiPro_777',
        role: 'compi_pro',
        content: '¿Alguien probando el chat en tiempo real? 🔴',
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const getWordCountFromText = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleSend = () => {
    if (!input.trim() || !user) return;

    const newWords = getWordCountFromText(input);
    const totalWords = wordCount + newWords;

    if (user.role === 'super_pobre' && chatWordLimit !== null && totalWords > chatWordLimit) {
      setUpgradeOpen(true);
      return;
    }

    const msg: Message = {
      id: Date.now().toString(),
      username: user.username,
      role: user.role,
      content: input.trim(),
      time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, msg]);
    setWordCount(w => w + newWords);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isBlocked =
    user?.role === 'super_pobre' &&
    chatWordLimit !== null &&
    wordCount >= chatWordLimit;

  const remaining =
    user?.role === 'super_pobre' && chatWordLimit !== null
      ? Math.max(0, chatWordLimit - wordCount)
      : null;

  const nameColor = (role: string) =>
    role === 'dios_admin' ? '#d946ef' : role === 'compi_pro' ? '#fbbf24' : '#9ca3af';

  return (
    <div className="min-h-screen relative">
      <CyberBackground />

      {/* Global Announcement */}
      <AnimatePresence>
        {announcement.active && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
          >
            <div
              className="max-w-lg w-full mx-4 p-8 rounded-xl text-center"
              style={{
                background: 'rgba(10,0,25,0.98)',
                border: '2px solid #d946ef',
                boxShadow: '0 0 80px rgba(217,70,239,0.4)',
              }}
            >
              <AlertIcon size={40} color="#d946ef" className="mx-auto mb-4" />
              <h2 className="font-black font-mono text-xl mb-4" style={{ color: '#d946ef' }}>
                📡 ANUNCIO GLOBAL
              </h2>
              <p className="font-mono" style={{ color: '#e9d5ff' }}>{announcement.content}</p>
              <button
                onClick={() => setAnnouncement(a => ({ ...a, active: false }))}
                className="mt-6 px-8 py-3 font-mono font-bold text-sm"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#d946ef)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                ENTENDIDO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 pt-16 md:pt-14 h-screen flex flex-col">
        {/* Chat header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(5,0,15,0.7)',
            borderBottom: '1px solid rgba(168,85,247,0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#39ff14', boxShadow: '0 0 6px #39ff14' }} />
              </motion.div>
              <span className="font-mono font-bold text-sm" style={{ color: '#39ff14' }}>LIVE CHAT</span>
            </div>
            <span className="text-xs font-mono hidden sm:block" style={{ color: '#4c1d95' }}>
              {messages.length} mensajes · {Math.floor(Math.random() * 5) + 3} online
            </span>
          </div>

          {user?.role === 'super_pobre' && (
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 rounded font-mono text-xs"
                style={{
                  background: remaining === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.4)',
                  border: `1px solid ${remaining === 0 ? '#ef4444' : 'rgba(168,85,247,0.2)'}`,
                  color: remaining === 0 ? '#ef4444' : '#6b7280',
                }}
              >
                {remaining === 0 ? '🔒 BLOQUEADO' : `${remaining} palabras`}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4c1d95 transparent' }}>
          {messages.map((msg, index) => {
            const isOwn = msg.username === user?.username;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, x: isOwn ? 15 : -15 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.3, delay: index < MOCK_MESSAGES.length ? 0 : 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div style={{ maxWidth: '80%' }}>
                  {/* Name + Badge */}
                  <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    {!isOwn && (
                      <>
                        <span className="font-mono font-bold text-xs" style={{ color: nameColor(msg.role) }}>
                          {msg.username}
                        </span>
                        <RoleBadgeInline role={msg.role} />
                      </>
                    )}
                    {isOwn && (
                      <>
                        <RoleBadgeInline role={msg.role} />
                        <span className="font-mono font-bold text-xs" style={{ color: nameColor(msg.role) }}>
                          Tú
                        </span>
                      </>
                    )}
                    <span className="font-mono text-xs" style={{ color: '#2d1b69' }}>{msg.time}</span>
                  </div>

                  {/* Bubble */}
                  <div
                    className="px-4 py-3 rounded-xl font-mono text-sm"
                    style={{
                      background: isOwn
                        ? 'rgba(124,58,237,0.25)'
                        : msg.role === 'dios_admin'
                        ? 'rgba(217,70,239,0.12)'
                        : 'rgba(10,0,25,0.7)',
                      border: isOwn
                        ? '1px solid rgba(168,85,247,0.4)'
                        : msg.role === 'dios_admin'
                        ? '1px solid rgba(217,70,239,0.3)'
                        : '1px solid rgba(168,85,247,0.1)',
                      color: '#e9d5ff',
                      backdropFilter: 'blur(10px)',
                      boxShadow: msg.role === 'dios_admin' ? '0 0 15px rgba(217,70,239,0.1)' : 'none',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 py-3"
          style={{
            background: 'rgba(5,0,15,0.85)',
            borderTop: '1px solid rgba(168,85,247,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {isBlocked ? (
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <button
                onClick={() => setUpgradeOpen(true)}
                className="w-full py-3 font-mono font-bold text-sm tracking-wider rounded-xl"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px dashed #ef4444',
                  color: '#ef4444',
                  cursor: 'pointer',
                }}
              >
                🔒 LÍMITE ALCANZADO · Haz click para hacer Upgrade →
              </button>
            </motion.div>
          ) : (
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`> ${user?.username}@kali:~# escribe tu mensaje...`}
                  rows={1}
                  className="w-full px-4 py-3 font-mono text-sm resize-none outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(168,85,247,0.3)',
                    borderRadius: '12px',
                    color: '#e9d5ff',
                    maxHeight: '120px',
                    scrollbarWidth: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#a855f7'}
                  onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.3)'}
                />
              </div>
              <motion.button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 rounded-xl transition-all"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${input.trim() ? '#a855f7' : 'rgba(168,85,247,0.2)'}`,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: input.trim() ? '0 0 15px rgba(168,85,247,0.3)' : 'none',
                }}
                whileHover={input.trim() ? { scale: 1.05 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
              >
                <SendIcon size={20} color={input.trim() ? '#fff' : '#4c1d95'} />
              </motion.button>
            </div>
          )}

          {/* Status bar */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <WifiIcon size={10} color="#39ff14" />
              <span className="text-xs font-mono" style={{ color: '#1a4a1a' }}>Realtime · Encriptado</span>
            </div>
            {input && user?.role === 'super_pobre' && (
              <span className="text-xs font-mono" style={{ color: '#4c1d95' }}>
                {getWordCountFromText(input)} palabras
              </span>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason="chat" chatWordLimit={chatWordLimit ?? undefined} />
    </div>
  );
}
