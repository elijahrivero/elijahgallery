import { useState, useEffect, useCallback } from 'react';
import { Photo } from './types';

interface UsePhotosReturn {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  newPhotosCount: number;
}

export function usePhotos(): UsePhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPhotosCount, setNewPhotosCount] = useState(0);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gallery', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const data = await response.json();
      
      // Transform Cloudinary images to Photo format
      const transformedPhotos: Photo[] = (data.images || []).map((img: any, index: number) => {
        const uploadDate = new Date(img.created_at || Date.now());
        const albumName = img.album || 'Gallery';
        
        return {
          id: img.id,
          title: `Photograph ${index + 1}`,
          description: `A beautiful photograph captured with professional equipment`,
          category: getCategoryFromAlbum(img.album),
          imageUrl: img.url,
          thumbnailUrl: img.url.replace('/upload/', '/upload/w_800,h_auto,c_fill,q_auto,f_auto/'),
          albumName: albumName,
          uploadDate: uploadDate,
          createdAt: uploadDate.toISOString(),
          featured: index < 3, // First 3 photos are featured
          size: getRandomSize(),
          priority: index + 1
        };
      });
      
      // Check for new photos
      const previousCount = photos.length;
      setPhotos(transformedPhotos);
      
      if (previousCount > 0 && transformedPhotos.length > previousCount) {
        setNewPhotosCount(transformedPhotos.length - previousCount);
        // Clear the notification after 5 seconds
        setTimeout(() => setNewPhotosCount(0), 5000);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  }, [photos.length]);

  const refetch = useCallback(async () => {
    await fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    fetchPhotos();
    
    // Set up polling for real-time updates every 5 seconds
    const interval = setInterval(fetchPhotos, 5000);
    
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  return { photos, loading, error, refetch, newPhotosCount };
}

// Helper function to determine category from album name
function getCategoryFromAlbum(album: string): 'portrait' | 'landscape' | 'street' | 'event' {
  const albumLower = album.toLowerCase();
  if (albumLower.includes('portrait') || albumLower.includes('people')) return 'portrait';
  if (albumLower.includes('landscape') || albumLower.includes('nature')) return 'landscape';
  if (albumLower.includes('street') || albumLower.includes('urban')) return 'street';
  if (albumLower.includes('event') || albumLower.includes('wedding')) return 'event';
  return 'portrait'; // Default fallback
}

// Helper function to get random size for visual variety
function getRandomSize(): 'small' | 'medium' | 'large' | 'wide' {
  const sizes: ('small' | 'medium' | 'large' | 'wide')[] = ['small', 'medium', 'large', 'wide'];
  return sizes[Math.floor(Math.random() * sizes.length)];
}
