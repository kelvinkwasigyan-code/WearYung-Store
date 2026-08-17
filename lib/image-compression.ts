/**
 * Client-side image compression and resizing utility.
 * Optimizes high-resolution mobile camera uploads (JPEG, PNG, HEIC, WebP)
 * to fast, high-quality, lightweight images before transmitting over the network.
 */
export async function compressImage(file: File, maxDimension: number = 1920, quality: number = 0.85): Promise<File> {
  // If file is SVG or GIF (animations), don't compress via canvas
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas 2D context fails
          resolve(file);
          return;
        }

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to standard JPEG / WebP Blob
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Create new optimized File object
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + (outputType === 'image/png' ? '.png' : '.jpg');
            const compressedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => {
        // Fallback on decode failure
        resolve(file);
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        resolve(file);
      }
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
