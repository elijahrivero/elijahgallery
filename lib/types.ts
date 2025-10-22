export interface Photo {
  id: string;
  title: string;
  description: string;
  category: 'portrait' | 'landscape' | 'street' | 'event';
  imageUrl: string;
  thumbnailUrl: string;
  metadata?: {
    camera: string;
    lens: string;
    settings: string;
    location?: string;
    date: string;
  };
  createdAt: string;
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
