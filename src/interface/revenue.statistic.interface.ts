export interface RevenueStatisticResponse {
  activityType: string;
  totalRevenue: number;
}

export interface MonthlyRevenueResponse {
  month: number;       // 1..12
  totalRevenue: number;
}
