import { motion, AnimatePresence } from 'framer-motion';
import { QRIcon, CloseIcon, AlertIcon } from './svg/Icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'chat' | 'photos';
  chatWordLimit?: number;
}

export function UpgradeModal({ isOpen, onClose, reason, chatWordLimit }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(10,0,25,0.97)',
              border: '1px solid rgba(217,70,239,0.5)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 0 60px rgba(217,70,239,0.2), 0 0 120px rgba(168,85,247,0.1)',
            }}
          >
            {/* Glitch bar top */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #7c3aed, #d946ef, #39ff14, #d946ef, #7c3aed)', borderRadius: '2px', marginBottom: '20px', animation: 'none' }} />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertIcon size={24} color="#d946ef" />
                <div>
                  <h2 className="font-black font-mono text-lg" style={{ color: '#d946ef' }}>
                    LÍMITE ALCANZADO
                  </h2>
                  <p className="text-xs font-mono" style={{ color: '#6b21a8' }}>
                    {reason === 'chat'
                      ? `> Chat bloqueado (${chatWordLimit ?? 50} palabras)`
                      : '> Muro lleno (5 fotos)'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Info */}
            <div className="p-4 rounded-lg mb-5" style={{ background: 'rgba(217,70,239,0.07)', border: '1px solid rgba(217,70,239,0.2)' }}>
              <p className="font-mono text-sm" style={{ color: '#e9d5ff' }}>
                Eres <span style={{ color: '#6b7280', fontWeight: 'bold' }}>💀 Super Pobre</span>.<br />
                Para seguir usando sin límites, hazte <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>⭐ Compi Pro</span>.
              </p>

              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span style={{ color: '#39ff14', fontSize: '10px' }}>✓</span>
                  <span className="font-mono text-xs" style={{ color: '#6ee7b7' }}>Chat ilimitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#39ff14', fontSize: '10px' }}>✓</span>
                  <span className="font-mono text-xs" style={{ color: '#6ee7b7' }}>Fotos HD sin límite</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#39ff14', fontSize: '10px' }}>✓</span>
                  <span className="font-mono text-xs" style={{ color: '#6ee7b7' }}>Badge dorado ⭐</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-5">
              <div className="font-black font-mono text-3xl" style={{ color: '#39ff14', textShadow: '0 0 15px rgba(57,255,20,0.5)' }}>
                S/ 5.00
              </div>
              <p className="text-xs font-mono mt-1" style={{ color: '#6b21a8' }}>pago único · upgrade permanente</p>
            </div>

            {/* QR + Yape */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.1)',
                }}
              >
                <QRIcon size={100} color="#a855f7" />
                <div className="text-center mt-2">
                  <div className="font-black font-mono text-xl" style={{ color: '#39ff14', letterSpacing: '3px' }}>
                    YAPE
                  </div>
                  <div className="font-mono text-lg font-bold" style={{ color: '#a855f7' }}>
                    948 097 148
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg w-full" style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.15)' }}>
                <p className="font-mono text-xs text-center" style={{ color: '#39ff14' }}>
                  📱 Yapea S/5 al <strong>948 097 148</strong><br />
                  <span style={{ color: '#6b7280' }}>Envía captura al admin para activar tu Pro.</span>
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-full mt-4 py-2 font-mono text-xs tracking-wider transition-all"
              style={{
                background: 'transparent',
                border: '1px solid rgba(168,85,247,0.2)',
                borderRadius: '8px',
                color: '#6b21a8',
                cursor: 'pointer',
              }}
            >
              Cerrar [ESC]
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
