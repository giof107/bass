import { SqliteDatabase } from '@nativescript-community/sqlite';

export class DatabaseService {
  private database: SqliteDatabase;

  async init() {
    this.database = await new SqliteDatabase('transit.db');
    await this.createTables();
  }

  private async createTables() {
    await this.database.execute(`
      CREATE TABLE IF NOT EXISTS stops (
        stop_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS routes (
        route_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id TEXT NOT NULL,
        stop_id TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        FOREIGN KEY (route_id) REFERENCES routes (route_id),
        FOREIGN KEY (stop_id) REFERENCES stops (stop_id)
      );
    `);
  }

  async getStopsNear(lat: number, lon: number, radius: number): Promise<any[]> {
    return await this.database.select(
      `SELECT *, (
        6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )
      ) AS distance
      FROM stops
      HAVING distance < ?
      ORDER BY distance
      LIMIT 10`,
      [lat, lon, lat, radius]
    );
  }
}