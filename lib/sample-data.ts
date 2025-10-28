import { Photo } from './types';

export const samplePhotos: Photo[] = [
  {
    id: '1',
    title: 'Golden Hour Portrait',
    description: 'A beautiful portrait captured during the golden hour with natural lighting.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
    metadata: {
      camera: 'Canon EOS R5',
      lens: '85mm f/1.4',
      settings: 'f/1.4, 1/125s, ISO 100',
      location: 'Central Park, NYC',
      date: '2024-01-15'
    },
    createdAt: '2024-01-15T10:30:00Z',
    featured: true,
    size: 'large'
  },
  {
    id: '2',
    title: 'Mountain Vista',
    description: 'Breathtaking mountain landscape at sunrise.',
    category: 'landscape',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    metadata: {
      camera: 'Sony A7R IV',
      lens: '24-70mm f/2.8',
      settings: 'f/8, 1/60s, ISO 200',
      location: 'Swiss Alps',
      date: '2024-01-20'
    },
    createdAt: '2024-01-20T06:00:00Z',
    featured: true,
    size: 'wide',
    priority: 1
  },
  {
    id: '3',
    title: 'Urban Life',
    description: 'Street photography capturing the essence of city life.',
    category: 'street',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
    metadata: {
      camera: 'Fujifilm X-T4',
      lens: '35mm f/1.4',
      settings: 'f/2.8, 1/250s, ISO 400',
      location: 'Tokyo, Japan',
      date: '2024-01-25'
    },
    createdAt: '2024-01-25T14:30:00Z',
    size: 'medium',
    priority: 3
  },
  {
    id: '4',
    title: 'Wedding Moment',
    description: 'Emotional moment during a wedding ceremony.',
    category: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    metadata: {
      camera: 'Canon EOS R6',
      lens: '70-200mm f/2.8',
      settings: 'f/2.8, 1/200s, ISO 800',
      location: 'Napa Valley, CA',
      date: '2024-02-01'
    },
    createdAt: '2024-02-01T16:00:00Z',
    featured: true,
    size: 'large',
    priority: 2
  },
  {
    id: '5',
    title: 'Studio Portrait',
    description: 'Professional studio portrait with controlled lighting.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
    metadata: {
      camera: 'Nikon D850',
      lens: '105mm f/1.4',
      settings: 'f/2.8, 1/125s, ISO 100',
      location: 'Studio, NYC',
      date: '2024-02-05'
    },
    createdAt: '2024-02-05T11:00:00Z',
    size: 'small',
    priority: 4
  },
  {
    id: '6',
    title: 'Ocean Waves',
    description: 'Powerful ocean waves crashing against the shore.',
    category: 'landscape',
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop',
    metadata: {
      camera: 'Sony A7R IV',
      lens: '16-35mm f/2.8',
      settings: 'f/11, 1/8s, ISO 100',
      location: 'Big Sur, CA',
      date: '2024-02-10'
    },
    createdAt: '2024-02-10T17:30:00Z',
    size: 'wide',
    priority: 5
  },
  {
    id: '7',
    title: 'City Lights',
    description: 'Neon-lit streets of downtown at night.',
    category: 'street',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
    metadata: {
      camera: 'Sony A7 III',
      lens: '24mm f/1.4',
      settings: 'f/1.4, 1/60s, ISO 1600',
      location: 'New York, NY',
      date: '2024-02-15'
    },
    createdAt: '2024-02-15T20:00:00Z',
    size: 'medium',
    priority: 6
  },
  {
    id: '8',
    title: 'Forest Path',
    description: 'Mystical forest path with morning mist.',
    category: 'landscape',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    metadata: {
      camera: 'Canon EOS R5',
      lens: '24-70mm f/2.8',
      settings: 'f/5.6, 1/30s, ISO 400',
      location: 'Pacific Northwest',
      date: '2024-02-20'
    },
    createdAt: '2024-02-20T07:00:00Z',
    size: 'large',
    priority: 7
  },
  {
    id: '9',
    title: 'Corporate Headshot',
    description: 'Professional business portrait in modern office.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1200&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
    metadata: {
      camera: 'Nikon D850',
      lens: '85mm f/1.8',
      settings: 'f/2.8, 1/125s, ISO 200',
      location: 'Corporate Office',
      date: '2024-02-25'
    },
    createdAt: '2024-02-25T14:00:00Z',
    size: 'small',
    priority: 8
  },
  {
    id: '10',
    title: 'Birthday Celebration',
    description: 'Joyful moment at a birthday party.',
    category: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop',
    metadata: {
      camera: 'Canon EOS R6',
      lens: '50mm f/1.4',
      settings: 'f/2.0, 1/125s, ISO 800',
      location: 'Private Venue',
      date: '2024-03-01'
    },
    createdAt: '2024-03-01T18:00:00Z',
    size: 'medium',
    priority: 9
  }
];
