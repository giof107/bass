import { Observable } from '@nativescript/core';
import { LocationService } from '../services/location.service';
import { SettingsService } from '../services/settings.service';
import { SearchResult, SavedLocation, RecentSearch } from '../models/settings';

export class SearchViewModel extends Observable {
  private locationService: LocationService;
  private settingsService: SettingsService;
  
  private _searchQuery: string = '';
  private _searchResults: SearchResult[] = [];
  private _savedLocations: SavedLocation[] = [];
  private _recentSearches: RecentSearch[] = [];
  private _showSavedLocations: boolean = true;
  private _showRecent: boolean = true;

  constructor() {
    super();
    
    this.locationService = new LocationService();
    this.settingsService = new SettingsService();
    
    this.settingsService.getSettings().subscribe(settings => {
      this._savedLocations = settings.favoriteLocations;
      this._recentSearches = settings.recentSearches;
      this.notifyPropertyChange('savedLocations', this._savedLocations);
      this.notifyPropertyChange('recentSearches', this._recentSearches);
    });
    
    this.locationService.getSearchResults().subscribe(results => {
      this._searchResults = results;
      this.notifyPropertyChange('searchResults', results);
    });
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    if (this._searchQuery !== value) {
      this._searchQuery = value;
      this.notifyPropertyChange('searchQuery', value);
    }
  }

  get searchResults(): SearchResult[] {
    return this._searchResults;
  }

  get savedLocations(): SavedLocation[] {
    return this._savedLocations;
  }

  get recentSearches(): RecentSearch[] {
    return this._recentSearches;
  }

  get showSavedLocations(): boolean {
    return this._showSavedLocations;
  }

  get showRecent(): boolean {
    return this._showRecent;
  }

  async search(query: string) {
    if (!query) return;
    
    this._showSavedLocations = false;
    this._showRecent = false;
    this.notifyPropertyChange('showSavedLocations', false);
    this.notifyPropertyChange('showRecent', false);
    
    this.settingsService.addRecentSearch(query);
    await this.locationService.searchLocations(query);
  }

  startVoiceSearch() {
    // Implement voice search functionality
    console.log('Voice search started');
  }

  goBack() {
    // Implement navigation back
    console.log('Navigate back');
  }
}