export const convertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Only convert images
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }
    
    // If it's already webp, just return it
    if (file.type === 'image/webp') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not found'));
        
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Conversion failed'));
          
          // Ensure the name ends with .webp
          const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
          
          const webpFile = new File([blob], newName, {
            type: 'image/webp'
          });
          console.log('Converted to WebP:', webpFile.name, webpFile.type, webpFile.size);
          resolve(webpFile);
        }, 'image/webp', 0.8); // Slightly lower quality for better compression
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};
