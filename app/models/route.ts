export interface TransitRoute {
  id: string;
  startLocation: Location;
  endLocation: Location;
  segments: RouteSegment[];
  totalDuration: number;
  totalCost: number;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface RouteSegment {
  type: 'BUS' | 'TRAIN' | 'WALK' | 'INTERCITY_BUS';
  startLocation: Location;
  endLocation: Location;
  startTime: Date;
  endTime: Date;
  cost: number;
  provider?: string;
  lineNumber?: string;
}