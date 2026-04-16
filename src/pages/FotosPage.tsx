import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { CyberBackground } from '../components/svg/CyberBackground';
import { RoleBadgeInline } from '../components/svg/RoleBadge';
import { UploadIcon, PhotoIcon, CloseIcon } from '../components/svg/Icons';
import { UpgradeModal } from '../components/UpgradeModal';

interface WallPhoto {
  id: string;
  username: string;
  role: 'super_pobre' | 'compi_pro' | 'dios_admin';
  url: string;
  caption: string;
  time: string;
  height: number;
}

// Mock photos with cyber/tech themed SVG data URLs
const generateSvgPhoto = (id: number) => {
  const colors = [
    ['#1a0033', '#a855f7', '#d946ef'],
    ['#001a0d', '#39ff14', '#00ff88'],
    ['#1a1000', '#fbbf24', '#f97316'],
    ['#001a1a', '#06b6d4', '#0ea5e9'],
    ['#1a000d', '#ec4899', '#f43f5e'],
  ];
  const c = colors[id % colors.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><defs><radialGradient id='g${id}' cx='50%' cy='50%' r='60%'><stop offset='0%' stop-color='${c[1]}' stop-opacity='0.3'/><stop offset='100%' stop-color='${c[0]}'/></radialGradient></defs><rect width='400' height='300' fill='${c[0]}'/><rect width='400' height='300' fill='url(%23g${id})'/><line x1='0' y1='50' x2='400' y2='50' stroke='${c[1]}' stroke-width='0.5' opacity='0.3'/><line x1='0' y1='150' x2='400' y2='150' stroke='${c[1]}' stroke-width='0.5' opacity='0.3'/><line x1='0' y1='250' x2='400' y2='250' stroke='${c[1]}' stroke-width='0.5' opacity='0.3'/><line x1='100' y1='0' x2='100' y2='300' stroke='${c[2]}' stroke-width='0.5' opacity='0.3'/><line x1='200' y1='0' x2='200' y2='300' stroke='${c[2]}' stroke-width='0.5' opacity='0.3'/><line x1='300' y1='0' x2='300' y2='300' stroke='${c[2]}' stroke-width='0.5' opacity='0.3'/><circle cx='200' cy='150' r='60' fill='none' stroke='${c[1]}' stroke-width='1' opacity='0.5'/><circle cx='200' cy='150' r='30' fill='${c[1]}' opacity='0.1'/><text x='200' y='158' font-family='monospace' font-size='14' fill='${c[1]}' text-anchor='middle' font-weight='bold'>KALI-WEB</text><text x='200' y='175' font-family='monospace' font-size='9' fill='${c[2]}' text-anchor='middle'>CYBER-BARRIO NET</text><text x='10' y='20' font-family='monospace' font-size='8' fill='${c[1]}' opacity='0.5'>0x${(id * 1337).toString(16).toUpperCase()}</text></svg>`;
  return `data:image/svg+xml,${svg}`;
};

const MOCK_PHOTOS: WallPhoto[] = [
  { id: '1', username: 'KaliAdmin', role: 'dios_admin', url: generateSvgPhoto(0), caption: 'El servidor nuevo está brutal 🖥️', time: '21:30', height: 200 },
  { id: '2', username: 'CompiPro_777', role: 'compi_pro', url: generateSvgPhoto(1), caption: 'Setup cyberpunk terminado 🎮', time: '21:45', height: 260 },
  { id: '3', username: 'Pelado_Dev', role: 'super_pobre', url: generateSvgPhoto(2), caption: 'Primer foto del muro jaja', time: '22:00', height: 180 },
  { id: '4', username: 'CompiPro_777', role: 'compi_pro', url: generateSvgPhoto(3), caption: 'La IA generando código solo 🤖', time: '22:10', height: 240 },
  { id: '5', username: 'KaliAdmin', role: 'dios_admin', url: generateSvgPhoto(4), caption: 'Red encriptada y funcionando 🔐', time: '22:20', height: 210 },
  { id: '6', username: 'CompiPro_777', role: 'compi_pro', url: generateSvgPhoto(0), caption: 'Monitor triple setup completo', time: '22:25', height: 190 },
];

export default function FotosPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<WallPhoto[]>(MOCK_PHOTOS);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [captionInput, setCaptionInput] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<WallPhoto | null>(null);
  const [photoCount, setPhotoCount] = useState(user?.photo_count || 0);
  const fileRef = useRef<HTMLInputElement>(null);

  const isBlocked = user?.role === 'super_pobre' && photoCount >= 5;

  const handleUploadClick = () => {
    if (isBlocked) {
      setUpgradeOpen(true);
      return;
    }
    setShowUpload(true);
  };

  const handlePhotoSubmit = () => {
    if (!user) return;
    const newPhoto: WallPhoto = {
      id: Date.now().toString(),
      username: user.username,
      role: user.role,
      url: generateSvgPhoto(Math.floor(Math.random() * 5)),
      caption: captionInput || 'Sin caption',
      time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      height: 180 + Math.floor(Math.random() * 80),
    };
    setPhotos(prev => [newPhoto, ...prev]);
    setPhotoCount(c => c + 1);
    setCaptionInput('');
    setShowUpload(false);
  };

  const nameColor = (role: string) =>
    role === 'dios_admin' ? '#d946ef' : role === 'compi_pro' ? '#fbbf24' : '#9ca3af';

  // Masonry columns
  const col1 = photos.filter((_, i) => i % 3 === 0);
  const col2 = photos.filter((_, i) => i % 3 === 1);
  const col3 = photos.filter((_, i) => i % 3 === 2);

  const PhotoCard = ({ photo }: { photo: WallPhoto }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(168,85,247,0.25)' }}
      onClick={() => setSelectedPhoto(photo)}
      className="cursor-pointer mb-4 rounded-xl overflow-hidden"
      style={{
        background: 'rgba(10,0,25,0.7)',
        border: '1px solid rgba(168,85,247,0.2)',
        backdropFilter: 'blur(10px)',
        transition: 'box-shadow 0.3s',
      }}
    >
      <img
        src={photo.url}
        alt={photo.caption}
        className="w-full object-cover"
        style={{ height: photo.height, display: 'block' }}
      />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono font-bold text-xs" style={{ color: nameColor(photo.role) }}>
            {photo.username}
          </span>
          <RoleBadgeInline role={photo.role} />
        </div>
        {photo.caption && (
          <p className="font-mono text-xs" style={{ color: '#c4b5fd' }}>{photo.caption}</p>
        )}
        <p className="font-mono text-xs mt-1" style={{ color: '#2d1b69' }}>{photo.time}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative">
      <CyberBackground />

      <div className="relative z-10 pt-20 md:pt-16 pb-20 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-black font-mono text-2xl" style={{ color: '#a855f7' }}>
              📸 MURO DE FOTOS
            </h1>
            <p className="text-xs font-mono" style={{ color: '#39ff14' }}>
              {'>'} {photos.length} fotos en el muro · Masonry grid
            </p>
          </div>

          <motion.button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 font-mono font-bold text-sm rounded-xl"
            style={{
              background: isBlocked ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.3))',
              border: `1px solid ${isBlocked ? '#ef4444' : '#a855f7'}`,
              color: isBlocked ? '#ef4444' : '#e9d5ff',
              cursor: 'pointer',
              boxShadow: isBlocked ? 'none' : '0 0 15px rgba(168,85,247,0.2)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <UploadIcon size={16} color={isBlocked ? '#ef4444' : '#a855f7'} />
            {isBlocked ? '🔒 LÍMITE' : 'SUBIR FOTO'}
          </motion.button>
        </div>

        {/* Quota bar for free users */}
        {user?.role === 'super_pobre' && (
          <div className="mb-5 p-3 rounded-xl font-mono text-xs flex items-center justify-between"
            style={{
              background: 'rgba(10,0,25,0.6)',
              border: '1px solid rgba(168,85,247,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ color: '#9ca3af' }}>💀 Super Pobre · Fotos: {photoCount}/5</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(55,65,81,0.5)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(photoCount / 5) * 100}%`,
                    background: photoCount >= 5 ? '#ef4444' : photoCount >= 4 ? '#f97316' : '#a855f7',
                    boxShadow: '0 0 6px rgba(168,85,247,0.5)',
                  }}
                />
              </div>
              <button
                onClick={() => setUpgradeOpen(true)}
                className="text-xs px-2 py-1 rounded font-bold"
                style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)', color: '#39ff14', cursor: 'pointer' }}
              >
                UPGRADE
              </button>
            </div>
          </div>
        )}

        {/* Upload Panel */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div
                className="p-5 rounded-xl"
                style={{
                  background: 'rgba(10,0,25,0.85)',
                  border: '1px solid rgba(168,85,247,0.4)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UploadIcon size={18} />
                    <span className="font-mono font-bold text-sm" style={{ color: '#a855f7' }}>SUBIR FOTO</span>
                    {user?.role !== 'compi_pro' && user?.role !== 'dios_admin' && (
                      <span className="text-xs font-mono" style={{ color: '#6b7280' }}>(compresión activa)</span>
                    )}
                    {(user?.role === 'compi_pro' || user?.role === 'dios_admin') && (
                      <span className="text-xs font-mono" style={{ color: '#fbbf24' }}>✨ HD</span>
                    )}
                  </div>
                  <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <CloseIcon size={16} />
                  </button>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-4 transition-all"
                  style={{ borderColor: 'rgba(168,85,247,0.3)', background: 'rgba(0,0,0,0.3)' }}
                >
                  <PhotoIcon size={32} color="#a855f7" className="mx-auto mb-2" />
                  <p className="font-mono text-sm" style={{ color: '#a855f7' }}>Click para seleccionar foto</p>
                  <p className="font-mono text-xs mt-1" style={{ color: '#4c1d95' }}>JPG, PNG, WEBP · Max 10MB</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                </div>

                <input
                  type="text"
                  value={captionInput}
                  onChange={e => setCaptionInput(e.target.value)}
                  placeholder="Caption (opcional)..."
                  className="w-full px-4 py-3 mb-4 font-mono text-sm outline-none rounded-xl"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(168,85,247,0.25)',
                    color: '#e9d5ff',
                  }}
                />

                <motion.button
                  onClick={handlePhotoSubmit}
                  className="w-full py-3 font-mono font-bold text-sm"
                  style={{
                    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ▲ PUBLICAR EN EL MURO
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>{col1.map(p => <PhotoCard key={p.id} photo={p} />)}</div>
          <div>{col2.map(p => <PhotoCard key={p.id} photo={p} />)}</div>
          <div className="hidden md:block">{col3.map(p => <PhotoCard key={p.id} photo={p} />)}</div>
        </div>
      </div>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
              className="max-w-lg w-full rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(168,85,247,0.4)', boxShadow: '0 0 60px rgba(168,85,247,0.2)' }}
            >
              <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full" />
              <div className="p-4" style={{ background: 'rgba(10,0,25,0.97)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono font-bold text-sm" style={{ color: nameColor(selectedPhoto.role) }}>
                    {selectedPhoto.username}
                  </span>
                  <RoleBadgeInline role={selectedPhoto.role} />
                </div>
                <p className="font-mono text-sm" style={{ color: '#c4b5fd' }}>{selectedPhoto.caption}</p>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="mt-3 w-full py-2 font-mono text-xs"
                  style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', color: '#6b21a8', cursor: 'pointer' }}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason="photos" />
    </div>
  );
}
