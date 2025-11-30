import { createRouter, createWebHistory } from 'vue-router'
import PackageView from '@/views/package/PackageView.vue'
import CreatePackageView from '@/views/package/CreatePackageView.vue'
import EditPackageView from '@/views/package/EditPackageView.vue'
import PackageDetailView from '@/views/package/PackageDetailView.vue'
import CreatePlanView from '@/views/plan/CreatePlanView.vue'
import OrderedQuantityForm from '@/views/ordered-quantity/OrderedQuantityForm.vue'
import ActivityListView from '@/views/activity/ActivityList.vue'
import ActivityCreateView from '@/views/activity/CreateActivityView.vue'
import ActivityEditView from '@/views/activity/EditActivityView.vue'
import ActivityDetailView from '@/views/activity/ActivityDetailView.vue'
import StatisticsView from '@/views/statistics/StatisticsView.vue'
import CouponView from '@/views/coupon/CouponView.vue'
import CouponAdminView from '@/views/coupon/CouponAdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    { path: '/', redirect: '/login' },
    { path: '/packages', component: PackageView },
    { path: '/packages/create', component: CreatePackageView },
    { path: '/packages/:id', component: PackageDetailView },
    { path: '/packages/:id/edit', component: EditPackageView },
    { path: '/packages/:packageId/plans/create', component: CreatePlanView },
    { path: '/packages/:packageId/plans/:planId/edit', component: () => import('@/views/plan/EditPlanView.vue') },
    { path: '/packages/:packageId/plans/:planId/ordered-quantity/create', component: OrderedQuantityForm },
    { path: '/packages/:packageId/plans/:planId/ordered-quantity/:oqId/edit', component: () => import('@/views/ordered-quantity/EditOrderedQuantityView.vue') },
    { path: '/activities', component: ActivityListView },
    { path: '/activities/create', component: ActivityCreateView },
    { path: '/activities/:id', component: ActivityDetailView },
    { path: '/activities/edit/:id', component: ActivityEditView },
    { path: '/statistics', component: StatisticsView },
    { path: '/coupons', component: CouponView },
    { path: '/coupons/create', component: CouponAdminView },
    { path: '/coupons/:id/edit', component: () => import('@/views/coupon/EditCouponView.vue') },
  ]
})
export default router
