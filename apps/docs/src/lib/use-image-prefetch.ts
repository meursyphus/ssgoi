import { useEffect } from 'react';

export function useImagePrefetch(imageUrls: string[]) {
  useEffect(() => {
    const prefetchImage = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Prefetch images after a short delay to not block initial page load
    const timeoutId = setTimeout(() => {
      imageUrls.forEach(url => {
        if (url) {
          prefetchImage(url);
        }
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [imageUrls]);
}

// Hook to preload images immediately (for visible images)
export function useImagePreload(imageUrl: string | undefined) {
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'anonymous';
    
    // Optional: you can add onload/onerror handlers if needed
    img.onload = () => {
      console.log(`Image preloaded: ${imageUrl}`);
    };
    img.onerror = () => {
      console.error(`Failed to preload image: ${imageUrl}`);
    };
  }, [imageUrl]);
}