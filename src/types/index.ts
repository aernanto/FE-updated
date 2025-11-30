export interface OrderedQuantity {
  id: string;
  activityName: string;
  activityItem: string;
  orderedQuota: number;
  price: number;
  startDate: string;
  endDate: string;
  availableQuota?: number; // Calculated frontend-side or from backend
  activityId: string;
  planId: string;
}

export interface Plan {
  id: string;
  packageId: string;
  planName: string; // Added based on PBI-FE-T14
  activityType: string;
  status: string;
  price: number;
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  orderedActivities: OrderedQuantity[]; // Renamed from orderedQuantities to match PBI-FE-T14 description (list OrderedActivities)
}

export interface Package {
  id: string;
  packageName: string;
  userId: string; // Customer ID
  status: string;
  quota: number;
  price: number;
  startDate: string;
  endDate: string;
  plans: Plan[];
}

export interface Activity {
  id: string;
  activityName: string;
  activityType: string;
  activityItem: string;
  price: number;
  capacity: number;
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
}

export interface RevenueStats {
  period: string;
  totalRevenue: number;
  breakdown?: Record<string, number>; // For monthly breakdown
}

export interface Coupon {
  id: string;
  name: string;
  description: string;
  points: number;
  percentOff: number;
  isDeleted?: boolean; // Assuming soft delete might exist
}

export interface PurchasedCoupon {
  id: string;
  uniqueCode: string;
  isUsed: boolean;
  purchaseDate?: string; // Added based on PBI-FE-L2
  coupon: Coupon;
}

export interface CreateActivityRequest {
  activityName: string;
  activityType: string;
  price: number;
  capacity: number;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
  activityItem?: string;
}

export interface UpdateActivityRequest extends Partial<CreateActivityRequest> { }

export interface CreatePackageRequest {
  packageName: string;
  userId: string;
  quota: number;
  price: number;
  startDate: string;
  endDate: string;
  activityIdList?: string[]; // Optional initial activities
}

export interface CreatePlanRequest {
  planName: string;
  activityType: string;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
  price?: number;
}

export interface CreateOrderedActivityRequest {
  activityId: string;
  quota: number;
  price: number;
  orderedQuota: number;
  startDate: string;
  endDate: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  address: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}
