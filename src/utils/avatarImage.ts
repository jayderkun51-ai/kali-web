/** Comprime a JPEG cuadrado máx ~512px para foto de perfil. */
export function compressAvatarFile(file: File, maxSide = 512, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(src);
        reject(new Error('Canvas no disponible'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        blob => {
          URL.revokeObjectURL(src);
          if (blob) resolve(blob);
          else reject(new Error('No se pudo comprimir'));
        },
        'image/jpeg',
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error('Imagen inválida'));
    };
    img.src = src;
  });
}
