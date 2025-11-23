<script lang="ts">
import { defineComponent } from 'vue';
import activityService, { type ActivityData } from '@/services/activityService';

export default defineComponent({
  name: 'ActivityCreate',
  data() {
    return {
      formData: {
        activityName: '',
        activityType: '',
        activityItem: '',
        capacity: 1,
        price: 0,
        startDate: '',
        endDate: '',
        startLocation: '',
        endLocation: ''
      } as ActivityData,
      loading: false,
      error: null as string | null,
      activityTypes: ['Flight', 'Accommodation', 'Vehicle Rental']
    };
  },
  methods: {
    async handleSubmit(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await activityService.createActivity(this.formData);
        this.$router.push('/activities');
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = 'Failed to create activity';
        }
      } finally {
        this.loading = false;
      }
    },
    handleCancel(): void {
      this.$router.push('/activities');
    }
  }
});
</script>

<template>
  <div class="create-container">
    <div class="create-header">
      <h1>Create New Activity</h1>
      <button @click="handleCancel" class="btn-back">
        <i class="fas fa-arrow-left"></i> Back to Activities
      </button>
    </div>

    <div v-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="create-form">
      <div class="form-row">
        <div class="form-group">
          <label for="activityName">Activity Name *</label>
          <input
            id="activityName"
            v-model="formData.activityName"
            type="text"
            required
            class="form-control"
            placeholder="e.g., Jakarta to Bali Flight"
          />
        </div>

        <div class="form-group">
          <label for="activityType">Activity Type *</label>
          <select
            id="activityType"
            v-model="formData.activityType"
            required
            class="form-control"
          >
            <option value="">-- Select Type --</option>
            <option v-for="type in activityTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="activityItem">Activity Item *</label>
        <input
          id="activityItem"
          v-model="formData.activityItem"
          type="text"
          required
          class="form-control"
          placeholder="e.g., Garuda Indonesia GA123"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="capacity">Capacity *</label>
          <input
            id="capacity"
            v-model.number="formData.capacity"
            type="number"
            min="1"
            required
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="price">Price (IDR) *</label>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            min="0"
            required
            class="form-control"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Start Date *</label>
          <input
            id="startDate"
            v-model="formData.startDate"
            type="date"
            required
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="endDate">End Date *</label>
          <input
            id="endDate"
            v-model="formData.endDate"
            type="date"
            required
            class="form-control"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startLocation">Start Location *</label>
          <input
            id="startLocation"
            v-model="formData.startLocation"
            type="text"
            required
            class="form-control"
            placeholder="e.g., Jakarta CGK"
          />
        </div>

        <div class="form-group">
          <label for="endLocation">End Location *</label>
          <input
            id="endLocation"
            v-model="formData.endLocation"
            type="text"
            required
            class="form-control"
            placeholder="e.g., Bali DPS"
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" :disabled="loading" class="btn btn-primary">
          <i class="fas fa-save"></i>
          {{ loading ? 'Creating...' : 'Create Activity' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.create-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f3f4f6;
}

.alert {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.create-form {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .create-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
