import { createRouter, createWebHistory } from 'vue-router'

// Pastikan path ini BENAR. Folder harus 'ordered-quantity'
import PackageView from '@/views/package/PackageView.vue'
import PackageDetailView from '@/views/package/PackageDetailView.vue'
import CreatePackageView from '@/views/package/CreatePackageView.vue'
import CreatePlanView from '@/views/plan/CreatePlanView.vue'
import OrderedQuantityForm from '@/views/ordered-quantity/OrderedQuantityForm.vue'
import ActivityListView from '@/views/activity/ActivityList.vue'
import ActivityCreate from '@/views/activity/CreateActivityView.vue'
// Jika file EditActivityView belum ada, hapus baris import ini sementara atau buat filenya
// import EditActivityView from '@/views/activity/EditActivityView.vue'
import StatisticsView from '@/views/statistics/StatisticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/packages' },
    { path: '/packages', name: 'Packages', component: PackageView },
    { path: '/packages/create', name: 'CreatePackage', component: CreatePackageView },
    { path: '/packages/:id', name: 'PackageDetail', component: PackageDetailView },
    { path: '/packages/:id/edit', name: 'EditPackage', component: CreatePackageView },
    { path: '/packages/:packageId/plans/create', name: 'CreatePlan', component: CreatePlanView },
    { path: '/packages/:packageId/plans/:planId/ordered-quantity/create', name: 'AddActivity', component: OrderedQuantityForm },
    { path: '/activities', name: 'Activities', component: ActivityListView },
    { path: '/activities/create', name: 'CreateActivity', component: ActivityCreate },
    // { path: '/activities/:id/edit', name: 'EditActivity', component: EditActivityView },
    { path: '/statistics', name: 'Stats', component: StatisticsView }
  ]
})

export default router
