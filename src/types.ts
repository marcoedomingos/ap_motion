export type CategoryType = 'all' | 'motion-design' | 'edited-videos' | 'flyers';

export type ProjectCategory = 'motion-design' | 'edited-videos' | 'flyers';

export type MediaType = 'video' | 'image';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  category: ProjectCategory;
  mediaType: MediaType;
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:5';
  videoUrl?: string;
  posterUrl?: string;
  imageUrl?: string;
  fallbackSvg?: string;
  isUploadedWork?: boolean;
  videoType?: 'yango' | 'heetch' | 'fussion' | 'imobiliaria' | 'matchbox' | 'ap-intro' | 'ao-ponto' | 'setembro-promo';
  duration?: string;
  dimensions: string;
  year: string;
  description: string;
  tags: string[];
  accentColor: string;
  highlight?: string;
  isProofOfProduct?: boolean;
  voiceoverText?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tools: string[];
  deliverable: string;
}
