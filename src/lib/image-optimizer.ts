/**
 * Image Optimization & Compression Utility for Showroom Mobile Camera Uploads
 * Compresses large 20-50MB mobile photos to fast, crisp ~300-500KB images preserving tile textures.
 */

export interface OptimizedImageResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
}

export async function optimizeImageFile(
  file: File,
  maxWidth: number = 2048,
  maxHeight: number = 2048,
  quality: number = 0.85
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not a supported image format.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to process image content.'));
      img.onload = () => {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Calculate new dimensions preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas 2D context unavailable.'));
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Failed to compress image blob.'));
            }

            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + (outputMime === 'image/png' ? '.png' : '.jpg'), {
              type: outputMime,
              lastModified: Date.now(),
            });

            const previewUrl = canvas.toDataURL(outputMime, quality);

            resolve({
              file: optimizedFile,
              previewUrl,
              originalSize: file.size,
              optimizedSize: optimizedFile.size,
              width,
              height,
            });
          },
          outputMime,
          quality
        );
      };

      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        reject(new Error('Invalid image result.'));
      }
    };

    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}
