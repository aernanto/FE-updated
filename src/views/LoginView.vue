<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import type { LoginRequest } from '@/types';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const loginData: LoginRequest = {
      email: email.value,
      password: password.value
    };

    const response = await authService.login(loginData);

    // Assuming the backend returns the token and user info in response.data.data based on AuthController
    // BaseResponseDTO structure: { status, message, timestamp, data: AuthResponseDTO }
    if (response.data && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      router.push('/packages');
    } else {
      error.value = 'Login failed: Invalid response from server';
    }
  } catch (err: any) {
    console.error(err);
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'An error occurred during login.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="card login-card">
      <div class="text-center mb-lg">
        <h1 class="heading-1">Welcome Back</h1>
        <p class="text-secondary">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="form-content">
        <div class="input-group">
          <label class="label" for="email">Email</label>
          <input id="email" v-model="email" class="input" placeholder="Enter your email" required />
        </div>

        <div class="input-group">
          <label class="label" for="password">Password</label>
          <input id="password" v-model="password" type="password" class="input" placeholder="Enter your password"
            required />
        </div>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading" class="spinner-sm"></span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-xl);
}

.text-center {
  text-align: center;
}

.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.text-secondary {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  padding: var(--spacing-md);
  background-color: #fef2f2;
  border-radius: var(--radius-md);
  border: 1px solid #fee2e2;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.spinner-sm {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: var(--spacing-sm);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
