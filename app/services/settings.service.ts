import { Observable, BehaviorSubject } from 'rxjs';
import { Settings, SavedLocation } from '../models/settings';

export class SettingsService {
  private settings = new BehaviorSubject<Settings>({
    language: 'tr',
    recentSearches: [],
    favoriteLocations: []
  });

  getSettings(): Observable<Settings> {
    return this.settings.asObservable();
  }

  setLanguage(language: string) {
    const current = this.settings.getValue();
    this.settings.next({
      ...current,
      language
    });
  }

  addRecentSearch(query: string) {
    const current = this.settings.getValue();
    const searches = current.recentSearches.filter(s => s.query !== query);
    searches.unshift({ query, timestamp: new Date() });
    
    this.settings.next({
      ...current,
      recentSearches: searches.slice(0, 10)
    });
  }

  addFavoriteLocation(location: SavedLocation) {
    const current = this.settings.getValue();
    const locations = [...current.favoriteLocations];
    locations.push(location);
    
    this.settings.next({
      ...current,
      favoriteLocations: locations
    });
  }

  removeFavoriteLocation(id: string) {
    const current = this.settings.getValue();
    const locations = current.favoriteLocations.filter(l => l.id !== id);
    
    this.settings.next({
      ...current,
      favoriteLocations: locations
    });
  }
}