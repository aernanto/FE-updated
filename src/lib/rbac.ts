import type { CurrentUser } from '@/interface/auth.interface';
import { getLocalStorage, getAuthToken } from './auth';

export enum UserRole {
  SUPERADMIN = 'Superadmin',
  ACCOMMODATION_OWNER = 'Accommodationowner',
  FLIGHT_AIRLINE = 'Flightairline',
  CUSTOMER = 'Customer',
  INSURANCE_PROVIDER = 'Insuranceprovider',
  TOUR_PACKAGE_VENDOR = 'Tourpackagevendor',
  RENTAL_VENDOR = 'RENTALVENDOR'
}

/**
 * Retrieves the current user from localStorage.
 * @returns The current user object or null if not found.
 */
export function getCurrentUser(): CurrentUser | null {
  return getLocalStorage<CurrentUser>('user');
}

/**
 * Checks if the user is authenticated.
 * @returns True if authenticated, false otherwise.
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
}

/**
 * Checks if the current user has admin role.
 * @returns True if the user is an admin, false otherwise.
 */

export function getRole(): string | null {
  const user = getCurrentUser();
  return user?.roleName?.toUpperCase() ?? null;
}

export function isSuperAdmin(): boolean {
  return getRole() === UserRole.SUPERADMIN;
}

export function isAccommodationOwner(): boolean {
  return getRole() === UserRole.ACCOMMODATION_OWNER;
}

export function isFlightAirline(): boolean {
  return getRole() === UserRole.FLIGHT_AIRLINE;
}

export function isCustomer(): boolean {
  return getRole() === UserRole.CUSTOMER;
}

export function isInsuranceProvider(): boolean {
  return getRole() === UserRole.INSURANCE_PROVIDER;
}

export function isTourPackageVendor(): boolean {
  return getRole() === UserRole.TOUR_PACKAGE_VENDOR;
}

export function isRentalVendor(): boolean {
  return getRole() === UserRole.RENTAL_VENDOR;
}

/** Checks if the current user can access a specific profile.
 * @param profileId - The ID of the profile to check access for.
 * @returns True if the user can access the profile, false otherwise.
 */
export function canAccessProfile(profileId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (isSuperAdmin()) return true; // Admin can access any profile

  // Regular users can only access their own profile
  return user.id === profileId;
}

/** Checks if the current user can access the profile list.
 * @returns True if the user can access the profile list, false otherwise.
 */
export function canAccessProfileList(): boolean {
  return isSuperAdmin();
}

/** Checks if the current user can create a new profile.
 * @returns True if the user can create a profile, false otherwise.
 */
// export function canCreateProfile(): boolean {
//   return isUser()
// }

