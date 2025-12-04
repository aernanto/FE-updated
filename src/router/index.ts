import { createRouter, createWebHistory } from 'vue-router'
import PackagesView from '@/views/package/PackagesView.vue'
import PackageDetailView from '@/views/package/PackageDetailView.vue'
import CreatePackageView from '@/views/package/CreatePackageView.vue'
import EditPackageView from '@/views/package/EditPackageView.vue'
import CreatePlanView from '@/views/package/plan/CreatePlanView.vue'
import DetailPlanView from '@/views/package/plan/DetailPlanView.vue'
import EditPlanView from '@/views/package/plan/EditPlanView.vue'
import StatisticView from '@/views/statistic/StatisticView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import { getCurrentUser, isAuthenticated, UserRole } from '@/lib/rbac'
import { toast } from 'vue-sonner'
import UserManagementView from '@/views/users/UserManagementView.vue'
import CustomerListView from '@/views/users/CustomerListView.vue'
import UserDetailView from '@/views/users/UserDetailView.vue'
import UserEditView from '@/views/users/UserEditView.vue'
import RegisterView from '@/views/users/RegisterView.vue'
import ActivitiesView from '@/views/activities/ActivitiesView.vue'
import CreateActivityView from '@/views/activities/CreateActivityView.vue'
import ActivityDetailView from '@/views/activities/ActivityDetailView.vue'
import EditActivityView from '@/views/activities/EditActivityView.vue'
import LoyaltyDashboardView from '@/views/loyalty/LoyaltyDashboardView.vue'
import CouponManagementView from '@/views/loyalty/CouponManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "HomeView",
      component: HomeView,
    },

    // ⭐ Loyalty
    {
      path: "/loyalty",
      name: "LoyaltyDashboard",
      component: LoyaltyDashboardView,
      meta: {
        requiresAuth: true,
        roles: [UserRole.CUSTOMER],
      },
    },
    {
      path: "/loyalty/coupons/manage",
      name: "CouponManagement",
      component: CouponManagementView,
      meta: {
        requiresAuth: true,
        roles: [UserRole.SUPERADMIN],
      },
    },

    {
      path: "/packages",
      name: "PackagesView",
      component: PackagesView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.CUSTOMER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/packages/:id",
      name: "PackageDetailView",
      component: PackageDetailView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.CUSTOMER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/packages/create",
      name: "CreatePackageView",
      component: CreatePackageView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.CUSTOMER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/packages/:id/edit",
      name: "EditPackageView",
      component: EditPackageView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.CUSTOMER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/packages/:id/plans/create",
      name: "CreatePlanView",
      component: CreatePlanView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.CUSTOMER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/plans/:id",
      name: "PlanDetail",
      component: DetailPlanView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.CUSTOMER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/plans/:id/edit",
      name: "EditPlanView",
      component: EditPlanView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.CUSTOMER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/statistics",
      name: "StatisticView",
      component: StatisticView,
      meta: {
        requiresAuth: true,
        roles: [UserRole.SUPERADMIN, UserRole.TOUR_PACKAGE_VENDOR],
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/users",
      name: "UserManagementView",
      component: UserManagementView,
      meta: { requiresAuth: true, roles: [UserRole.SUPERADMIN] },
    },
    {
      path: "/customers",
      name: "CustomerListView",
      component: CustomerListView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.FLIGHT_AIRLINE,
          UserRole.ACCOMMODATION_OWNER,
          UserRole.RENTAL_VENDOR,
          UserRole.INSURANCE_PROVIDER,
          UserRole.TOUR_PACKAGE_VENDOR,
        ],
      },
    },
    {
      path: "/profile",
      name: "MyProfileView",
      component: UserDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: "/users/:id",
      name: "UserDetailView",
      component: UserDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: "/users/:id/edit",
      name: "UserEditView",
      component: UserEditView,
      meta: { requiresAuth: true },
    },
    {
      path: "/activities",
      name: "ActivitiesView",
      component: ActivitiesView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.TOUR_PACKAGE_VENDOR,
          UserRole.RENTAL_VENDOR,
          UserRole.ACCOMMODATION_OWNER,
          UserRole.FLIGHT_AIRLINE,
          UserRole.CUSTOMER,
        ],
      },
    },
    {
      path: "/activities/create",
      name: "CreateActivityView",
      component: CreateActivityView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.TOUR_PACKAGE_VENDOR,
          UserRole.RENTAL_VENDOR,
          UserRole.ACCOMMODATION_OWNER,
          UserRole.FLIGHT_AIRLINE,
        ],
      },
    },
    {
      path: "/activities/:id",
      name: "ActivityDetailView",
      component: ActivityDetailView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.CUSTOMER,
          UserRole.SUPERADMIN,
          UserRole.TOUR_PACKAGE_VENDOR,
          UserRole.RENTAL_VENDOR,
          UserRole.ACCOMMODATION_OWNER,
          UserRole.FLIGHT_AIRLINE,
        ],
      },
    },
    {
      path: "/activities/:id/edit",
      name: "EditActivityView",
      component: EditActivityView,
      meta: {
        requiresAuth: true,
        roles: [
          UserRole.SUPERADMIN,
          UserRole.TOUR_PACKAGE_VENDOR,
          UserRole.RENTAL_VENDOR,
          UserRole.ACCOMMODATION_OWNER,
          UserRole.FLIGHT_AIRLINE,
        ],
      },
    },
  ],
})

export default router;

router.beforeEach((to, from, next) => {
  const publicPaths = new Set<string>(["/", "/login", "/register"]);
  const auth = isAuthenticated();

  if (publicPaths.has(to.path)) {
    if ((to.path === "/login" || to.path === "/register") && auth) {
      return next("/");
    }
    return next();
  }

  if (!auth) {
    toast.error("Session expired. Please log in again.");
    return next("/login");
  }

  const currentUser = getCurrentUser();
  const roleUpper = currentUser?.roleName?.toUpperCase();
  const isSuperAdminUser = roleUpper === UserRole.SUPERADMIN;

  const allowedRoles = to.meta.roles as string[] | undefined;
  if (allowedRoles && roleUpper && !allowedRoles.includes(roleUpper)) {
    toast.error("You are not authorized to view this page");
    return next("/");
  }

  if ((to.name === "UserDetailView" || to.name === "UserEditView") && !isSuperAdminUser) {
    const paramId = to.params.id as string | undefined;
    if (paramId && currentUser && paramId !== currentUser.id) {
      toast.error("Unauthorized access to another user's profile");
      return next("/profile");
    }
  }

  next();
});
