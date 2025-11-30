export interface Activity {
  id: string;
  activityName: string;
  activityType: string; // "Flight" | "Accommodation" | "Vehicle Rental" | etc
  activityItem: string;
  capacity: number;
  price: number;
  startDate: string;   // ISO string
  endDate: string;     // ISO string
  startLocation: string;
  endLocation: string;
  deletedAt?: string | null;
}

export interface CreateActivityRequest {
  activityName: string;
  activityType: string;
  activityItem: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
}

export interface UpdateActivityRequest {
  activityName: string;
  activityItem: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
}

export interface ActivityFilterRequest {
  name?: string;
  activityType?: string;
  startLocation?: string;
  endLocation?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  includeDeleted?: boolean;
}
