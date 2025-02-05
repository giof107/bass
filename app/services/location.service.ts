import { Observable, BehaviorSubject } from 'rxjs';
import { SearchResult } from '../models/settings';

export class LocationService {
  private searchResults = new BehaviorSubject<SearchResult[]>([]);

  async searchLocations(query: string): Promise<SearchResult[]> {
    // OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10`
    );
    
    const results = await response.json();
    const mappedResults: SearchResult[] = results.map(r => ({
      id: r.place_id,
      name: r.display_name.split(',')[0],
      address: r.display_name,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
      type: r.type
    }));
    
    this.searchResults.next(mappedResults);
    return mappedResults;
  }

  getSearchResults(): Observable<SearchResult[]> {
    return this.searchResults.asObservable();
  }
}