export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  date: string;
  url: string;
}

export interface PlatformData {
  platform: 'tiktok' | 'youtube' | 'instagram';
  username: string;
  displayName: string;
  profilePicture: string;
  totalViews: number;
  followers: number;
  contents: ContentItem[];
  lastUpdated: string;
}

export interface ApiResponse {
  success: boolean;
  data?: PlatformData;
  error?: string;
  isDemo?: boolean;
}

export interface SearchInputs {
  tiktok: string;
  youtube: string;
  instagram: string;
}
