
export interface UserProfile {
  id: string;
  username: string;
  roleName: string;
  name: string;
  gender: boolean | null;
  email: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  saldo: number | null;
  phone: string | null;
  listOfLocations: string[] | null;
}

export interface AddUserProfileRequest {
  username: string;
  password: string;
  roleName: string;
  name: string;
  gender: boolean;
  email: string;
  phone?: string;
  listOfLocations?: string[];
}

export interface UpdateUserProfileRequest {
  id: string;
  username: string;
  name: string;
  password: string;
  gender: boolean;
  email: string;
  saldo?: number | null;
  phone?: string | null;
  listOfLocations?: string[] | null;
}
