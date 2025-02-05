import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { LocationService } from './services/location.service';
import { SettingsService } from './services/settings.service';
import { SearchResult, Location } from './models/settings';

export class MainViewModel extends Observable {
  private locationService: LocationService;
  private settingsService: SettingsService;
  private _startLocation: string = '';
  private _endLocation: string = '';
  private _mapUrl: string;
  private _currentLocation = {
    latitude: 41.0082,
    longitude: 28.9784,
    zoom: 13
  };

  constructor() {
    super();
    this.locationService = new LocationService();
    this.settingsService = new SettingsService();
    this.updateMapUrl();
  }

  private updateMapUrl() {
    // Using OpenStreetMap with Leaflet
    this._mapUrl = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${this._currentLocation.latitude}, ${this._currentLocation.longitude}], ${this._currentLocation.zoom});
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Add current location marker
          L.marker([${this._currentLocation.latitude}, ${this._currentLocation.longitude}]).addTo(map);
        </script>
      </body>
      </html>
    `;
    this.notifyPropertyChange('mapUrl', this._mapUrl);
  }

  get mapUrl(): string {
    return this._mapUrl;
  }

  get startLocation(): string {
    return this._startLocation;
  }

  set startLocation(value: string) {
    if (this._startLocation !== value) {
      this._startLocation = value;
      this.notifyPropertyChange('startLocation', value);
    }
  }

  get endLocation(): string {
    return this._endLocation;
  }

  set endLocation(value: string) {
    if (this._endLocation !== value) {
      this._endLocation = value;
      this.notifyPropertyChange('endLocation', value);
    }
  }

  showLocationSearch() {
    Frame.topmost().navigate({
      moduleName: 'pages/search-page',
      animated: true
    });
  }

  async setCurrentLocation() {
    try {
      const location = await getCurrentLocation({
        desiredAccuracy: 3,
        maximumAge: 5000,
        timeout: 10000
      });
      
      this._currentLocation.latitude = location.latitude;
      this._currentLocation.longitude = location.longitude;
      this.updateMapUrl();
      
      this.startLocation = `${location.latitude}, ${location.longitude}`;
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  filterByType(args) {
    const button = args.object;
    const filterType = button.text;
    console.log('Filter by:', filterType);
  }

  navigateToSearch() {
    Frame.topmost().navigate({
      moduleName: 'pages/search-page',
      animated: true
    });
  }

  navigateToRoutes() {
    console.log('Navigate to routes');
  }

  navigateToFavorites() {
    console.log('Navigate to favorites');
  }

  navigateToProfile() {
    console.log('Navigate to profile');
  }

  openSettings() {
    Frame.topmost().navigate({
      moduleName: 'pages/settings-page',
      animated: true
    });
  }
}