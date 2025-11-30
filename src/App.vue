<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed } from 'vue';
import { authService } from '@/services/authService';

const route = useRoute();
const router = useRouter();

const showNavbar = computed(() => route.path !== '/login');

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<template>
  <div class="app-container">
    <nav v-if="showNavbar" class="navbar">
      <div class="nav-content">
        <div class="nav-brand">
          <span class="brand-icon">✈️</span>
          <span class="brand-text">TourPackage App</span>
        </div>
        <div class="nav-links">
          <RouterLink to="/packages" class="nav-link" active-class="active">Packages</RouterLink>
          <RouterLink to="/activities" class="nav-link" active-class="active">Activities</RouterLink>
          <RouterLink to="/statistics" class="nav-link" active-class="active">Statistics</RouterLink>
          <RouterLink to="/coupons" class="nav-link" active-class="active">Coupons</RouterLink>
          <a href="#" @click.prevent="handleLogout" class="nav-link logout-link">Logout</a>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--background-color);
  font-family: 'Inter', sans-serif;
  color: var(--text-primary);
}

.navbar {
  background-color: white;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.brand-icon {
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: #eff6ff;
}

.nav-link.active {
  color: var(--primary-color);
  background-color: #eff6ff;
  font-weight: 600;
}

.logout-link {
  color: var(--error-color);
}

.logout-link:hover {
  color: #991b1b;
  background-color: #fef2f2;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    height: auto;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
}
</style>
