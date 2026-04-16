import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CyberBackground } from '../components/svg/CyberBackground';
import { KaliLogo } from '../components/svg/KaliLogo';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <CyberBackground />
      <div className="relative z-10 text-center px-4">
        <motion.div
          animate={{ filter: ['drop-shadow(0 0 8px #a855f7)', 'drop-shadow(0 0 25px #d946ef)', 'drop-shadow(0 0 8px #a855f7)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto mb-6 w-fit"
        >
          <KaliLogo size={80} />
        </motion.div>
        <motion.h1
          className="font-black font-mono text-6xl mb-2"
          style={{ color: '#d946ef' }}
          animate={{ x: [-2, 2, -1, 0] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
        >
          404
        </motion.h1>
        <p className="font-mono text-lg mb-2" style={{ color: '#a855f7' }}>PÁGINA NO ENCONTRADA</p>
        <p className="font-mono text-sm mb-8" style={{ color: '#39ff14' }}>
          {'>'} Error: ruta desconocida en la red cyber-barrio
        </p>
        <motion.button
          onClick={() => navigate('/home')}
          className="px-8 py-3 font-mono font-bold text-sm tracking-wider"
          style={{
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(168,85,247,0.3)',
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(168,85,247,0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          ← VOLVER AL INICIO
        </motion.button>
      </div>
    </div>
  );
}
