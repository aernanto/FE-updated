import { createRouter, createWebHistory } from 'vue-router'
import PackageView from '@/views/package/PackageView.vue'
import CreatePackageView from '@/views/package/CreatePackageView.vue'
import PackageDetailView from '@/views/package/PackageDetailView.vue'
import CreatePlanView from '@/views/plan/CreatePlanView.vue'
import OrderedQuantityForm from '@/views/ordered-quantity/OrderedQuantityForm.vue'
import ActivityListView from '@/views/activity/ActivityList.vue'
import ActivityCreateView from '@/views/activity/CreateActivityView.vue'
import StatisticsView from '@/views/statistics/StatisticsView.vue'
import CouponView from '@/views/coupon/CouponView.vue'
import CouponAdminView from '@/views/coupon/CouponAdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/packages' },
    { path: '/packages', component: PackageView },
    { path: '/packages/create', component: CreatePackageView },
    { path: '/packages/:id', component: PackageDetailView },
    { path: '/packages/:id/edit', component: CreatePackageView },
    { path: '/packages/:packageId/plans/create', component: CreatePlanView },
    { path: '/packages/:packageId/plans/:planId/ordered-quantity/create', component: OrderedQuantityForm },
    { path: '/activities', component: ActivityListView },
    { path: '/activities/create', component: ActivityCreateView },
    { path: '/statistics', component: StatisticsView },
    { path: '/coupons', component: CouponView },
    { path: '/coupons/create', component: CouponAdminView },
  ]
})
export default router
