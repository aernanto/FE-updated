import { createRouter, createWebHistory } from 'vue-router';
import PackageView from '@/views/package/PackageView.vue';
import PackageDetailView from '@/views/package/PackageDetailView.vue';
import CreatePackageView from '@/views/package/CreatePackageView.vue';
import CreatePlanView from '@/views/plan/CreatePlanView.vue';

const routes = [
  {
    path: '/',
    redirect: '/packages'
  },
  {
    path: '/packages',
    name: 'Packages',
    component: PackageView,
    meta: { requiresAuth: true }
  },
  {
    path: '/packages/create',
    name: 'CreatePackage',
    component: CreatePackageView,
    meta: { requiresAuth: true }
  },
  {
    path: '/packages/:id',
    name: 'PackageDetail',
    component: PackageDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/packages/:id/edit',
    name: 'EditPackage',
    component: CreatePackageView,
    meta: { requiresAuth: true }
  },
  {
    path: '/packages/:packageId/plans/create',
    name: 'CreatePlan',
    component: CreatePlanView,
    meta: { requiresAuth: true }
  },
  {
    path: '/packages/:packageId/plans/:planId/edit',
    name: 'EditPlan',
    component: CreatePlanView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
