export interface Settings {
  language: string;
  recentSearches: RecentSearch[];
  favoriteLocations: SavedLocation[];
}

export interface RecentSearch {
  query: string;
  timestamp: Date;
}

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'HOME' | 'WORK' | 'FAVORITE';
  icon?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  openingHours?: string;
  type?: string;
  icon?: string;
}