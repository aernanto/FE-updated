<template>
  <div class="create-plan-view">
    <button @click="goBack" class="btn-back">
      ← Back to Package
    </button>

    <div class="form-container">
      <h1>{{ isEdit ? '✏️ Edit Plan' : '➕ Add New Plan' }}</h1>

      <div class="package-info" v-if="packageData">
        <span class="label">For Package:</span>
        <span class="package-name">{{ packageData.packageName }}</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Plan Name -->
        <div class="form-group">
          <label for="planName">Plan Name *</label>
          <input
            id="planName"
            v-model="formData.planName"
            type="text"
            placeholder="e.g., Day 1: Tanah Lot Temple Visit"
            required
          />
          <span v-if="errors.planName" class="error">{{ errors.planName }}</span>
        </div>

        <!-- Date Range -->
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Start Date *</label>
            <input
              id="startDate"
              v-model="formData.startDate"
              type="date"
              :min="packageData?.startDate"
              :max="packageData?.endDate"
              required
            />
            <span v-if="errors.startDate" class="error">{{ errors.startDate }}</span>
          </div>

          <div class="form-group">
            <label for="endDate">End Date *</label>
            <input
              id="endDate"
              v-model="formData.endDate"
              type="date"
              :min="formData.startDate || packageData?.startDate"
              :max="packageData?.endDate"
              required
            />
            <span v-if="errors.endDate" class="error">{{ errors.endDate }}</span>
          </div>
        </div>

        <!-- Price -->
        <div class="form-group">
          <label for="price">Price (Rp) *</label>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g., 500000"
            required
          />
          <div class="price-preview" v-if="formData.price">
            = Rp {{ formatPrice(formData.price) }}
          </div>
          <span v-if="errors.price" class="error">{{ errors.price }}</span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            placeholder="Describe the plan activities, destinations, meals included, etc."
          ></textarea>
        </div>

        <!-- Submit Buttons -->
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn-submit" :disabled="submitting">
            <span v-if="submitting">
              <div class="spinner-small"></div>
              {{ isEdit ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ isEdit ? '✅ Update Plan' : '✅ Create Plan' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import planService from '@/services/planService';
import packageService from '@/services/packageService';

interface PackageData {
  packageName: string;
  startDate: string;
  endDate: string;
}

interface PlanFormData {
  planName: string;
  startDate: string;
  endDate: string;
  price: number | null;
  description: string;
}

interface FormErrors {
  planName: string;
  startDate: string;
  endDate: string;
  price: string;
}

export default defineComponent({
  name: 'CreatePlanView',
  data() {
    return {
      isEdit: false as boolean,
      packageId: '' as string,
      planId: '' as string,
      packageData: null as PackageData | null,
      formData: {
        planName: '',
        startDate: '',
        endDate: '',
        price: null,
        description: ''
      } as PlanFormData,
      errors: {
        planName: '',
        startDate: '',
        endDate: '',
        price: ''
      } as FormErrors,
      submitting: false as boolean
    };
  },
  mounted() {
    const pkgParam = this.$route.params.packageId;
    this.packageId = Array.isArray(pkgParam) ? (pkgParam[0] ?? '') : (pkgParam ?? '');
    this.fetchPackageData();
    this.checkEditMode();
  },
  methods: {
    checkEditMode() {
      const param = this.$route.params.planId;
      const planId = Array.isArray(param) ? param[0] : (param || '');
      if (planId) {
        this.isEdit = true;
        this.planId = planId;
        this.fetchPlanData();
      }
    },

    async fetchPackageData() {
      try {
        const response: unknown = await packageService.getPackageById(this.packageId);
        const pkg = (response as { data?: PackageData; packageName?: string; startDate?: string; endDate?: string }).data || response as PackageData;
        this.packageData = {
          packageName: pkg.packageName || '',
          startDate: pkg.startDate || '',
          endDate: pkg.endDate || ''
        };
      } catch (err) {
        alert('❌ Failed to load package data');
        console.error(err);
        this.goBack();
      }
    },

    async fetchPlanData() {
      try {
        const response: unknown = await planService.getPlanById(this.planId);
        const plan = (response as { data?: PlanFormData; planName?: string; startDate?: string; endDate?: string; price?: number; description?: string; planDescription?: string }).data || response as PlanFormData;

        this.formData = {
          planName: plan.planName || '',
          startDate: this.formatDateForInput(plan.startDate),
          endDate: this.formatDateForInput(plan.endDate),
          price: plan.price ?? null,
          description: plan.description || ''
        };
      } catch (err) {
        alert('❌ Failed to load plan data');
        console.error(err);
        this.goBack();
      }
    },

    formatDateForInput(dateString: string): string {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0] ?? '';
    },

    formatPrice(price: number | null): string {
      return new Intl.NumberFormat('id-ID').format(price || 0);
    },

    validateForm(): boolean {
      this.errors = {
        planName: '',
        startDate: '',
        endDate: '',
        price: ''
      };
      let isValid = true;

      if (!this.formData.planName.trim()) {
        this.errors.planName = 'Plan name is required';
        isValid = false;
      }

      if (!this.formData.startDate) {
        this.errors.startDate = 'Start date is required';
        isValid = false;
      }

      if (!this.formData.endDate) {
        this.errors.endDate = 'End date is required';
        isValid = false;
      }

      // Check if dates are within package range
      if (this.packageData && this.formData.startDate) {
        const planStart = new Date(this.formData.startDate);
        const pkgStart = new Date(this.packageData.startDate);
        const pkgEnd = new Date(this.packageData.endDate);

        if (planStart < pkgStart || planStart > pkgEnd) {
          this.errors.startDate = 'Start date must be within package dates';
          isValid = false;
        }
      }

      if (this.formData.startDate && this.formData.endDate) {
        if (new Date(this.formData.endDate) < new Date(this.formData.startDate)) {
          this.errors.endDate = 'End date must be after or equal to start date';
          isValid = false;
        }
      }

      if (this.formData.price === null || this.formData.price === undefined || this.formData.price < 0) {
        this.errors.price = 'Price must be at least 0';
        isValid = false;
      }

      return isValid;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.submitting = true;

      const planData = {
        packageId: this.packageId,
        planName: this.formData.planName,
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        price: this.formData.price || 0,
        description: this.formData.description,
        planDate: this.formData.startDate,
        planTime: '00:00',
        planDescription: this.formData.description || '',
        planLocation: ''
      };

      try {
        if (this.isEdit) {
          if (this.planId) {
            await planService.updatePlan(this.planId, planData);
            alert('✅ Plan updated successfully!');
          } else {
            alert('❌ Plan ID is missing. Cannot update plan.');
            return;
          }
        } else {
          await planService.createPlan(planData);
          alert('✅ Plan created successfully!');
        }
        this.goBack();
      } catch (err: unknown) {
        const errorMessage = (err as { message?: string })?.message || 'Unknown error';
        alert('❌ Failed to save plan: ' + errorMessage);
        console.error('Error saving plan:', err);
      } finally {
        this.submitting = false;
      }
    },

    goBack() {
      this.$router.push(`/packages/${this.packageId}`);
    }
  }
});
</script>

<style scoped>
.create-plan-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.btn-back {
  padding: 10px 20px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #e5e7eb;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-container h1 {
  margin: 0 0 16px 0;
  font-size: 28px;
  color: #111;
}

.package-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 32px;
}

.package-info .label {
  color: #666;
  font-size: 14px;
}

.package-info .package-name {
  font-weight: 600;
  color: #111;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.price-preview {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
}

.error {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #ef4444;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #e5e7eb;
  color: #333;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-submit {
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  background: #059669;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
