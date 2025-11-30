export interface CreatePlanRequest {
  planName: string;
  activityType: string;
  startDate: string; // ISO string (LocalDateTime)
  endDate: string;
  startLocation: string;
  endLocation: string;
}

export interface PlanResponse {
  id: string;
  planName: string;
  activityType: string;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
  status: string;
  price: number;
}

export interface OrderedActivity {
  id: string;
  activityName: string;
  activityId: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  price: number;
  quota: number;
  orderedQuota: number;
  totalPrice: number;
}

export interface TravelPlan {
  id: string;
  planName: string;
  activityType: string;
  status: string;
  totalPrice: number;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  startLocation: string;
  endLocation: string;
  packageId: string;
  packageName: string;
  packageStatus: string;
  orderedActivities: OrderedActivity[];
}

