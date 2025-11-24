export interface OrderedQuantity {
  id: string;
  activityName: string;
  activityItem: string;
  orderedQuota: number;
  price: number;
}

export interface Plan {
  id: string;
  activityType: string;
  status: string;
  price: number;
  startLocation: string;
  endLocation: string;
  startDate: string;
  orderedQuantities: OrderedQuantity[];
}

export interface Package {
  id: string;
  packageName: string;
  userId: string;
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
}

export interface RevenueStats {
  period: string;
  totalRevenue: number;
}

export interface Coupon {
  id: string;
  name: string;
  description: string;
  points: number;
  percentOff: number;
}

export interface PurchasedCoupon {
  id: string;
  uniqueCode: string;
  isUsed: boolean;
  coupon: Coupon;
}
