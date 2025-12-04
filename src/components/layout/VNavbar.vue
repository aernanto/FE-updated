<template>
  <nav class="bg-white shadow sticky top-0 z-50">
    <!-- NAVBAR V1: Home / Activities / Packages / Statistics / Loyalty -->
    <div
      v-if="!isProfileSection"
      class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center"
    >
      <!-- Logo -->
      <RouterLink
        to="/"
        class="text-2xl font-bold text-purple-600 tracking-tight"
      >
        Tour Package Management
      </RouterLink>

      <!-- Menu -->
      <div class="flex gap-8 text-gray-700 font-medium">
        <!-- HOME (public) -->
        <RouterLink
          to="/"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/')"
        >
          Home
        </RouterLink>

        <!-- ACTIVITIES -->
        <RouterLink
          v-if="canSeeActivities"
          to="/activities"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/activities')"
        >
          Activities
        </RouterLink>

        <!-- PACKAGES -->
        <RouterLink
          v-if="canSeePackages"
          to="/packages"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/packages')"
        >
          Packages
        </RouterLink>

        <!-- STATISTICS -->
        <RouterLink
          v-if="canSeeStatistics"
          to="/statistics"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/statistics')"
        >
          Statistics
        </RouterLink>

        <!-- LOYALTY (Customer only) -->
        <RouterLink
          v-if="isCustomer()"
          to="/loyalty"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/loyalty')"
        >
          Loyalty
        </RouterLink>
      </div>

      <!-- Auth Buttons -->
      <div v-if="isAuthenticated()">
        <VLogoutButton />
      </div>

      <RouterLink v-else to="/login" :class="getLinkClass('/login')">
        <VButton
          class="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded-xs"
        >
          Login
        </VButton>
      </RouterLink>
    </div>

    <!-- NAVBAR V2: Profile Section -->
    <div
      v-else
      class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center"
    >
      <RouterLink
        to="/profile"
        class="text-2xl font-bold text-purple-600 tracking-tight"
      >
        Profile Management
      </RouterLink>

      <div class="flex gap-8 text-gray-700 font-medium">
        <!-- My Profile -->
        <RouterLink
          to="/profile"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/profile')"
        >
          My Profile
        </RouterLink>

        <!-- USER MANAGEMENT -->
        <RouterLink
          v-if="canSeeUserManagement"
          to="/users"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/users')"
        >
          User Management
        </RouterLink>

        <!-- CUSTOMERS -->
        <RouterLink
          v-if="canSeeCustomerList"
          to="/customers"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/customers')"
        >
          Customers
        </RouterLink>

        <!-- COUPON MANAGEMENT (Superadmin only) -->
        <RouterLink
          v-if="isSuperAdmin()"
          to="/loyalty/coupons/manage"
          class="hover:text-purple-600 transition-all"
          :class="getActive('/loyalty/coupons/manage')"
        >
          Coupon Management
        </RouterLink>
      </div>

      <div v-if="isAuthenticated()">
        <VLogoutButton />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import VLogoutButton from "../auth/VLogoutButton.vue";
import VButton from "../common/VButton.vue";

import {
  isAuthenticated,
  isSuperAdmin,
  isCustomer,
  isFlightAirline,
  isAccommodationOwner,
  isInsuranceProvider,
  isTourPackageVendor,
  isRentalVendor,
} from "@/lib/rbac";

const route = useRoute();

const getActive = (path: string) =>
  route.path === path
    ? "text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
    : "";

const getLinkClass = (path: string) =>
  route.path === path
    ? "text-purple-600"
    : "text-black hover:text-purple-600";

// Profile section detector
const isProfileSection = computed(() => {
  return (
    route.path.startsWith("/profile") ||
    route.path.startsWith("/users") ||
    route.path.startsWith("/customers") ||
    route.path.startsWith("/loyalty/coupons/manage")
  );
});

// RBAC navigation logic
const canSeeActivities = computed(() =>
  isSuperAdmin() ||
  isTourPackageVendor() ||
  isRentalVendor() ||
  isAccommodationOwner() ||
  isFlightAirline() ||
  isCustomer()
);

const canSeePackages = computed(() =>
  isSuperAdmin() ||
  isCustomer() ||
  isTourPackageVendor()
);

const canSeeStatistics = computed(() =>
  isSuperAdmin() || isTourPackageVendor()
);

const canSeeUserManagement = computed(() => isSuperAdmin());

const canSeeCustomerList = computed(() =>
  isSuperAdmin() ||
  isFlightAirline() ||
  isAccommodationOwner() ||
  isInsuranceProvider() ||
  isTourPackageVendor() ||
  isRentalVendor()
);
</script>
