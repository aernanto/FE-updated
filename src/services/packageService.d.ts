declare module '@/services/packageService' {
  export interface PackageData {
    packageName: string;
    startDate: string;
    endDate: string;
    quota: number;
    price: number;
    status: string;
  }

  export interface Package {
    id: string;
    packageName: string;
    startDate: string;
    endDate: string;
    quota: number;
    price: number;
    status: string;
  }

  export interface ApiResponse<T = unknown> {
    data?: T;
    id?: string;
    message?: string;
  }

  const packageService: {
    getAllPackages: () => Promise<ApiResponse<Package[]>>;
    getPackageById: (id: string | null) => Promise<ApiResponse<Package>>;
    createPackage: (packageData: PackageData) => Promise<ApiResponse<Package>>;
    updatePackage: (id: string | null, packageData: PackageData) => Promise<ApiResponse<Package>>;
    deletePackage: (id: string) => Promise<ApiResponse<void>>;
  };

  export default packageService;
}
