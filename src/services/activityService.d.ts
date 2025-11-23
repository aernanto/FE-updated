declare module '@/services/activityService' {
  export interface ActivityData {
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

  export interface Activity extends ActivityData {
    id: string;
    isDeleted?: boolean;
  }

  export interface ApiResponse<T = unknown> {
    data?: T;
    id?: string;
    message?: string;
  }

  const activityService: {
    getAllActivities: () => Promise<ApiResponse<Activity[]>>;
    getActivityById: (id: string) => Promise<ApiResponse<Activity>>;
    createActivity: (activityData: ActivityData) => Promise<ApiResponse<Activity>>;
    updateActivity: (
      id: string,
      activityData: ActivityData
    ) => Promise<ApiResponse<Activity>>;
    deleteActivity: (id: string) => Promise<ApiResponse<void>>;
    getActivitiesByType: (type: string) => Promise<ApiResponse<Activity[]>>;
  };

  export default activityService;
}
