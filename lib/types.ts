export interface Photo {
  id: string;
  title: string;
  description: string;
  category: 'portrait' | 'landscape' | 'street' | 'event';
  imageUrl: string;
  thumbnailUrl: string;
  albumName?: string;
  uploadDate?: Date;
  createdAt: string;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large' | 'wide';
  priority?: number;
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    location?: string;
    date?: string;
  };
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  behance?: string;
}
