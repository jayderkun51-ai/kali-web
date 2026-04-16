import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { KaliLogo } from '../components/svg/KaliLogo';
import { CyberBackground } from '../components/svg/CyberBackground';
import { MailIcon, KeyIcon, UserIcon, TerminalIcon, GlitchBarsIcon } from '../components/svg/Icons';

type AuthStep = 'boot' | 'choice' | 'login' | 'register' | 'otp';
const OTP_LEN = 8;

const BOOT_LINES = [
  '> Initializing KALI-WEB kernel v2.4.7...',
  '> Loading crypto modules [OK]',
  '> Connecting to secure node... [OK]',
  '> Verifying network integrity... [OK]',
  '> Establishing encrypted tunnel... [OK]',
  '> Cyber-Barrio protocols loaded [OK]',
  '> Authentication system online [READY]',
  '',
  '  ██╗  ██╗ █████╗ ██╗     ██╗',
  '  ██║ ██╔╝██╔══██╗██║     ██║',
  '  █████╔╝ ███████║██║     ██║',
  '  ██╔═██╗ ██╔══██║██║     ██║',
  '  ██║  ██╗██║  ██║███████╗██║',
  '  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  WEB',
  '',
  '> System ready. Awaiting credentials...',
];

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>('boot');
  const [bootIndex, setBootIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LEN }, () => ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [glitch, setGlitch] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { loginDemo, user, sendEmailOtp, verifyEmailOtp } = useAuth();

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  // Boot sequence
  useEffect(() => {
    if (step !== 'boot') return;
    if (bootIndex < BOOT_LINES.length) {
      const delay = bootIndex < 7 ? 180 : bootIndex < 14 ? 60 : 200;
      const timer = setTimeout(() => setBootIndex(i => i + 1), delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setStep('choice'), 600);
      return () => clearTimeout(timer);
    }
  }, [bootIndex, step]);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LEN - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setLoading(true);
    setGlitch(true);
    setTimeout(() => {
      loginDemo(demoEmail);
      setGlitch(false);
      setLoading(false);
      navigate('/home');
    }, 1200);
  };

  const handleSendOtp = async (mode: 'login' | 'register') => {
    if (!email.trim()) {
      setError('Ingresa tu correo, pata.');
      return;
    }
    if (mode === 'register' && !username.trim()) {
      setError('Pon tu nombre de usuario, causa.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendEmailOtp({ email, username, mode });
      setOtp(Array.from({ length: OTP_LEN }, () => ''));
      setStep('otp');
    } catch (e: any) {
      setError(e?.message || 'No se pudo enviar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('').replace(/\D/g, '').trim();
    // Supabase OTPs are typically 6 digits, but templates can use 8.
    if (!(code.length === 6 || code.length === 8)) {
      setError('Código inválido. Debe ser de 6 u 8 dígitos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Hard timeout so the UI never gets stuck on "Verificando..."
      await Promise.race([
        verifyEmailOtp({ email, token: code }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout verificando OTP. Reintenta.')), 15000)),
      ]);
      navigate('/home');
    } catch (e: any) {
      setError(e?.message || 'Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <CyberBackground />

      {/* Glitch overlay */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 50 }}
          >
            <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: '2px', background: '#39ff14', opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: '1px', background: '#d946ef', opacity: 0.5 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(168,85,247,0.03)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Boot Screen */}
        <AnimatePresence mode="wait">
          {step === 'boot' && (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="font-mono text-sm leading-relaxed"
              style={{
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid #39ff14',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 0 30px rgba(57,255,20,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #1a3a1a' }}>
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full" style={{ background: '#39ff14' }} />
                <span className="ml-2 text-xs" style={{ color: '#39ff14', opacity: 0.7 }}>kali-web — terminal</span>
              </div>
              {BOOT_LINES.slice(0, bootIndex).map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: line.startsWith('  ██') ? '#a855f7' : line.startsWith('  ╚') || line.startsWith('  ╔') ? '#a855f7' : line.includes('[OK]') ? '#39ff14' : line.includes('[READY]') ? '#39ff14' : line.includes('WEB') ? '#d946ef' : '#39ff14',
                    fontWeight: line.startsWith('  ██') || line.startsWith('  ╚') ? '700' : '400',
                    fontSize: line.startsWith('  ██') || line.startsWith('  ╚') ? '11px' : '12px',
                    whiteSpace: 'pre',
                    opacity: line === '' ? 1 : 1,
                  }}
                >
                  {line || '\u00A0'}
                </div>
              ))}
              {bootIndex <= BOOT_LINES.length && (
                <span style={{ color: '#39ff14' }}>
                  █
                </span>
              )}
            </motion.div>
          )}

          {/* Choice / Main Auth Screen */}
          {step === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  animate={{ filter: ['drop-shadow(0 0 8px #a855f7)', 'drop-shadow(0 0 20px #d946ef)', 'drop-shadow(0 0 8px #a855f7)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <KaliLogo size={110} />
                </motion.div>
                <motion.h1
                  className="mt-3 text-3xl font-black tracking-widest"
                  style={{ fontFamily: "'Courier New', monospace", color: '#a855f7' }}
                  animate={glitch ? { x: [-2, 2, -1, 0], skewX: [-2, 2, 0] } : {}}
                >
                  KALI<span style={{ color: '#39ff14' }}>-</span>WEB
                </motion.h1>
                <p className="text-xs mt-1 tracking-widest" style={{ color: '#6b21a8', fontFamily: 'monospace' }}>
                  CYBER-BARRIO NETWORK v2.4
                </p>
                <div className="mt-2">
                  <GlitchBarsIcon width={180} height={3} />
                </div>
              </div>

              {/* Glass card */}
              <div style={{
                background: 'rgba(10,0,20,0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 0 40px rgba(168,85,247,0.1), inset 0 1px 0 rgba(168,85,247,0.1)',
              }}>
                <div className="flex items-center gap-2 mb-6">
                  <TerminalIcon size={16} />
                  <span className="text-xs font-mono" style={{ color: '#39ff14' }}>
                    root@kali-web:~# ./auth --secure
                  </span>
                </div>

                <div className="space-y-3">
                  <motion.button
                    onClick={() => setStep('login')}
                    className="w-full py-3 px-4 font-mono font-bold text-sm tracking-wider transition-all"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.3))',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#e9d5ff',
                      boxShadow: '0 0 15px rgba(168,85,247,0.2)',
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(168,85,247,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ▶ INICIAR SESIÓN
                  </motion.button>

                  <motion.button
                    onClick={() => setStep('register')}
                    className="w-full py-3 px-4 font-mono font-bold text-sm tracking-wider transition-all"
                    style={{
                      background: 'linear-gradient(135deg, rgba(57,255,20,0.1), rgba(0,255,136,0.15))',
                      border: '1px solid #39ff14',
                      borderRadius: '8px',
                      color: '#39ff14',
                      boxShadow: '0 0 15px rgba(57,255,20,0.1)',
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(57,255,20,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    + CREAR CUENTA
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.2)' }} />
                  <span className="text-xs font-mono" style={{ color: '#4c1d95' }}>DEMO ACCESS</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.2)' }} />
                </div>

                {/* Demo logins */}
                <div className="space-y-2">
                  <p className="text-xs font-mono mb-2" style={{ color: '#6b21a8' }}>
                    {'>'} Selecciona rol para demo:
                  </p>
                  {[
                    { email: 'admin@kali.web', label: '👑 Dios Admin', color: '#d946ef', border: '#a855f7' },
                    { email: 'pro@kali.web', label: '⭐ Compi Pro', color: '#fbbf24', border: '#92400e' },
                    { email: 'free@kali.web', label: '💀 Super Pobre', color: '#6b7280', border: '#374151' },
                  ].map(({ email: demoEmail, label, color, border }) => (
                    <motion.button
                      key={demoEmail}
                      onClick={() => handleDemoLogin(demoEmail)}
                      disabled={loading}
                      className="w-full py-2 px-3 text-xs font-mono font-bold tracking-wider transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: `1px solid ${border}`,
                        borderRadius: '6px',
                        color,
                      }}
                      whileHover={{ scale: 1.01, background: 'rgba(168,85,247,0.05)' }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {loading ? '> Connecting...' : `> ${label}`}
                    </motion.button>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs mt-4 font-mono" style={{ color: '#2d1b69' }}>
                Encrypted · Secure · Solo para los compis
              </p>
            </motion.div>
          )}

          {/* Login Form */}
          {step === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <KaliLogo size={48} />
                <div>
                  <h2 className="text-xl font-black font-mono" style={{ color: '#a855f7' }}>LOGIN</h2>
                  <p className="text-xs font-mono" style={{ color: '#39ff14' }}>{'>'} Identifícate, compi</p>
                </div>
              </div>

              <div style={{
                background: 'rgba(10,0,20,0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 0 40px rgba(168,85,247,0.08)',
              }}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded font-mono text-xs"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5' }}
                  >
                    ⚠ {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono mb-2" style={{ color: '#a855f7' }}>EMAIL</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <MailIcon size={16} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full pl-10 pr-4 py-3 font-mono text-sm outline-none transition-all"
                        style={{
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(168,85,247,0.3)',
                          borderRadius: '8px',
                          color: '#e9d5ff',
                        }}
                        onFocus={e => e.target.style.borderColor = '#a855f7'}
                        onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.3)'}
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleSendOtp('login')}
                    disabled={loading}
                    className="w-full py-3 font-mono font-bold text-sm tracking-wider"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                    }}
                    whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(168,85,247,0.5)' } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? '> Enviando código...' : '> ENVIAR CÓDIGO OTP'}
                  </motion.button>
                </div>

                <button
                  onClick={() => { setStep('choice'); setError(''); }}
                  className="w-full mt-4 text-xs font-mono py-2 transition-all"
                  style={{ color: '#6b21a8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Volver
                </button>
              </div>
            </motion.div>
          )}

          {/* Register Form */}
          {step === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <KaliLogo size={48} />
                <div>
                  <h2 className="text-xl font-black font-mono" style={{ color: '#39ff14' }}>REGISTRO</h2>
                  <p className="text-xs font-mono" style={{ color: '#a855f7' }}>{'>'} Únete a la red, causa</p>
                </div>
              </div>

              <div style={{
                background: 'rgba(10,0,20,0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(57,255,20,0.2)',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 0 40px rgba(57,255,20,0.05)',
              }}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 rounded font-mono text-xs"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5' }}
                  >
                    ⚠ {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono mb-2" style={{ color: '#39ff14' }}>NOMBRE DE USUARIO</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <UserIcon size={16} color="#39ff14" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Tu nick en la red"
                        className="w-full pl-10 pr-4 py-3 font-mono text-sm outline-none"
                        style={{
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(57,255,20,0.2)',
                          borderRadius: '8px',
                          color: '#e9d5ff',
                        }}
                        onFocus={e => e.target.style.borderColor = '#39ff14'}
                        onBlur={e => e.target.style.borderColor = 'rgba(57,255,20,0.2)'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono mb-2" style={{ color: '#39ff14' }}>EMAIL</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <MailIcon size={16} color="#39ff14" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full pl-10 pr-4 py-3 font-mono text-sm outline-none"
                        style={{
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(57,255,20,0.2)',
                          borderRadius: '8px',
                          color: '#e9d5ff',
                        }}
                        onFocus={e => e.target.style.borderColor = '#39ff14'}
                        onBlur={e => e.target.style.borderColor = 'rgba(57,255,20,0.2)'}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded font-mono text-xs" style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.15)', color: '#6b7280' }}>
                    ℹ Entras como <span style={{ color: '#6b7280' }}>Super Pobre</span> (gratis).<br />
                    Límite: 50 palabras en chat · 5 fotos en muro.<br />
                    Upgrade por S/ 5 vía <span style={{ color: '#39ff14' }}>Yape</span>.
                  </div>

                  <motion.button
                    onClick={() => handleSendOtp('register')}
                    disabled={loading}
                    className="w-full py-3 font-mono font-bold text-sm tracking-wider"
                    style={{
                      background: 'linear-gradient(135deg, #065f46, #059669)',
                      border: '1px solid #39ff14',
                      borderRadius: '8px',
                      color: '#ecfdf5',
                      boxShadow: '0 0 20px rgba(57,255,20,0.2)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                    }}
                    whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(57,255,20,0.35)' } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? '> Enviando código...' : '> REGISTRARME + OTP'}
                  </motion.button>
                </div>

                <button
                  onClick={() => { setStep('choice'); setError(''); }}
                  className="w-full mt-4 text-xs font-mono py-2 transition-all"
                  style={{ color: '#6b21a8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Volver
                </button>
              </div>
            </motion.div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center mb-6">
                <KaliLogo size={70} />
                <h2 className="mt-3 text-xl font-black font-mono" style={{ color: '#a855f7' }}>CÓDIGO OTP</h2>
                <p className="text-xs font-mono mt-1 text-center" style={{ color: '#6b7280' }}>
                  Revisa tu correo · Código de 8 dígitos
                </p>
              </div>

              <div style={{
                background: 'rgba(10,0,20,0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(168,85,247,0.4)',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 0 50px rgba(168,85,247,0.1)',
              }}>
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <KeyIcon size={20} />
                  <span className="text-sm font-mono" style={{ color: '#39ff14' }}>
                    Código enviado a: <span style={{ color: '#a855f7' }}>{email}</span>
                  </span>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 rounded font-mono text-xs"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5' }}
                  >
                    ⚠ {error}
                  </motion.div>
                )}

                <div className="flex gap-3 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-black font-mono outline-none transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: `2px solid ${digit ? '#a855f7' : 'rgba(168,85,247,0.3)'}`,
                        borderRadius: '8px',
                        color: '#e9d5ff',
                        boxShadow: digit ? '0 0 10px rgba(168,85,247,0.3)' : 'none',
                      }}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3 font-mono font-bold text-sm tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(217,70,239,0.3)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                  whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(217,70,239,0.5)' } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? '> Verificando...' : '> VERIFICAR Y ENTRAR'}
                </motion.button>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setStep('choice')}
                    className="text-xs font-mono py-1 px-2"
                    style={{ color: '#6b21a8', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={() => handleSendOtp('login')}
                    className="text-xs font-mono py-1 px-2"
                    style={{ color: '#39ff14', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Reenviar código →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
