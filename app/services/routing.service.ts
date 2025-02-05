import { Observable, BehaviorSubject } from 'rxjs';
import { TransitRoute, Location } from '../models/route';
import { DatabaseService } from './database.service';

export class RoutingService {
  private readonly db: DatabaseService;
  private routes = new BehaviorSubject<TransitRoute[]>([]);

  constructor() {
    this.db = new DatabaseService();
    this.init();
  }

  private async init() {
    await this.db.init();
  }

  async findRoutes(
    start: Location,
    end: Location,
    options: { maxTransfers?: number; maxWalkingDistance?: number } = {}
  ): Promise<TransitRoute[]> {
    // Get nearby stops
    const nearbyStartStops = await this.db.getStopsNear(
      start.latitude,
      start.longitude,
      0.5
    );
    const nearbyEndStops = await this.db.getStopsNear(
      end.latitude,
      end.longitude,
      0.5
    );

    // TODO: Implement routing algorithm
    // This is a placeholder that returns an empty array
    return [];
  }

  getRouteUpdates(): Observable<TransitRoute[]> {
    return this.routes.asObservable();
  }
}