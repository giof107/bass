import { Observable, Page } from '@nativescript/core';
import { getCurrentLocation } from '@nativescript/geolocation';
import { RoutingService } from './services/routing.service';
import { TransitRoute, Location } from './models/route';

export class MainViewModel extends Observable {
  private routingService: RoutingService;
  private _routes: TransitRoute[] = [];
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
    this.routingService = new RoutingService();
    
    this.routingService.getRouteUpdates().subscribe(routes => {
      this._routes = routes;
      this.notifyPropertyChange('routes', routes);
    });

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

  get routes(): TransitRoute[] {
    return this._routes;
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

  navigateToSearch() {
    console.log('Navigate to search');
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

  showDestinationSearch() {
    console.log('Show destination search');
  }

  openSettings() {
    console.log('Open settings');
  }

  async findRoutes() {
    const start: Location = {
      latitude: this._currentLocation.latitude,
      longitude: this._currentLocation.longitude,
      address: this.startLocation
    };

    const end: Location = {
      latitude: 0,
      longitude: 0,
      address: this.endLocation
    };

    const routes = await this.routingService.findRoutes(start, end);
    this._routes = routes;
    this.notifyPropertyChange('routes', routes);
  }
}