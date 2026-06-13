import imageCompression from 'browser-image-compression';

/**
 * Compresses an image to WebP format.
 * Generates a main high-res version and a small thumbnail version.
 * Optionally applies a text watermark before compression.
 */
export const optimizeImage = async (file, watermarkText = '') => {
  // 1. Compress & Resize FIRST (This makes the watermark canvas operation instant)
  const mainOptions = {
    maxSizeMB: 0.5, // Reduced for faster upload & lightweight
    maxWidthOrHeight: 1600, // Reduced from 1920 to 1600 for performance
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.7
  };
  let mainFile = await imageCompression(file, mainOptions);

  // 2. Apply Watermark to the ALREADY RESIZED image
  if (watermarkText) {
    mainFile = await applyWatermark(mainFile, watermarkText);
  }

  // 3. Compress Thumbnail from the already reduced mainFile (Lightning fast)
  const thumbOptions = {
    maxSizeMB: 0.05, // Very lightweight
    maxWidthOrHeight: 400,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.6
  };
  const thumbFile = await imageCompression(mainFile, thumbOptions);

  return {
    mainFile,
    thumbFile
  };
};

/**
 * Draws a text watermark on the image using HTML5 Canvas
 */
const applyWatermark = (file, text) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Configure watermark text
        const fontSize = Math.max(img.width * 0.03, 24); // Responsive font size
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        // Add subtle drop shadow for visibility
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 4;

        // Draw text in bottom right corner with padding
        const padding = fontSize;
        ctx.fillText(text, img.width - padding, img.height - padding);

        // Convert back to File
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const watermarkedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(watermarkedFile);
        }, 'image/jpeg', 0.95);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Optimizes a Cloudinary image URL by injecting transformation parameters.
 * 
 * @param {string} url - The raw Cloudinary URL.
 * @param {string} size - The desired size: 'thumbnail', 'medium', 'hd'.
 * @returns {string} - The optimized URL.
 */
export const getOptimizedUrl = (url, size = 'medium') => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;

  let widthParam = 'w_800';
  switch (size) {
    case 'thumbnail': widthParam = 'w_400'; break;
    case 'medium': widthParam = 'w_800'; break;
    case 'hd': widthParam = 'w_1920'; break;
    case 'full': widthParam = ''; break;
    default:
      if (size.startsWith('w_')) widthParam = size;
      break;
  }

  const transforms = `f_auto,q_auto${widthParam ? `,${widthParam}` : ''}`;
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex !== -1) {
    const baseUrl = url.substring(0, uploadIndex + 8);
    const restOfUrl = url.substring(uploadIndex + 8);
    return `${baseUrl}${transforms}/${restOfUrl}`;
  }
  return url;
};
