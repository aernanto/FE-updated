declare module '@/services/statisticsService' {
  export interface RevenueData {
    Flight: number;
    Accommodation: number;
    'Vehicle Rental': number;
  }

  export interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
  }

  const statisticsService: {
    getRevenueByActivityType: (
      year: number,
      month?: number
    ) => Promise<ApiResponse<RevenueData>>;
  };

  export default statisticsService;
}
