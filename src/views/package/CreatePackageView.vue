<template>
  <div class="create-package-view">
    <button @click="goBack" class="btn-back">
      ← Back
    </button>

    <div class="form-container">
      <h1>{{ isEdit ? '✏️ Edit Package' : '➕ Create New Package' }}</h1>

      <form @submit.prevent="handleSubmit">
        <!-- Package Name -->
        <div class="form-group">
          <label for="packageName">Package Name *</label>
          <input
            id="packageName"
            v-model="formData.packageName"
            type="text"
            placeholder="e.g., Bali Adventure Tour"
            required
          />
          <span v-if="errors.packageName" class="error">{{ errors.packageName }}</span>
        </div>

        <!-- Date Range -->
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Start Date *</label>
            <input
              id="startDate"
              v-model="formData.startDate"
              type="date"
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
              required
            />
            <span v-if="errors.endDate" class="error">{{ errors.endDate }}</span>
          </div>
        </div>

        <!-- Quota -->
        <div class="form-group">
          <label for="quota">Quota (People) *</label>
          <input
            id="quota"
            v-model.number="formData.quota"
            type="number"
            min="1"
            placeholder="e.g., 20"
            required
          />
          <span v-if="errors.quota" class="error">{{ errors.quota }}</span>
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
            placeholder="e.g., 5000000"
            required
          />
          <div class="price-preview" v-if="formData.price">
            = Rp {{ formatPrice(formData.price) }}
          </div>
          <span v-if="errors.price" class="error">{{ errors.price }}</span>
        </div>

        <!-- Status -->
        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" v-model="formData.status" required>
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Processed">Processed</option>
          </select>
          <span v-if="errors.status" class="error">{{ errors.status }}</span>
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
              {{ isEdit ? '✅ Update Package' : '✅ Create Package' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import packageService from '@/services/packageService';

export default defineComponent({
  name: 'CreatePackageView',
  data() {
    return {
      isEdit: false as boolean,
      packageId: null as string | null,
      formData: {
        packageName: '',
        startDate: '',
        endDate: '',
        quota: null as number | null,
        price: null as number | null,
        status: 'Pending'
      },
      errors: {} as Record<string, string>,
      submitting: false as boolean
    };
  },
  mounted() {
    this.checkEditMode();
  },
  methods: {
    checkEditMode() {
      const id = this.$route?.params?.id;
      if (id) {
        this.isEdit = true;
        const resolvedId = Array.isArray(id) ? id[0] : id;
        this.packageId = typeof resolvedId === 'string' ? resolvedId : null;
        this.fetchPackageData();
      }
    },

    async fetchPackageData() {
      try {
        interface PackageData {
          packageName?: string;
          startDate?: string;
          endDate?: string;
          quota?: number;
          price?: number;
          status?: string;
        }
        const response: { data?: PackageData } = await packageService.getPackageById(this.packageId);
        const pkg: PackageData = response.data ?? {};

        this.formData = {
          packageName: pkg.packageName ?? '',
          startDate: pkg.startDate ? (this.formatDateForInput(pkg.startDate) ?? '') : '',
          endDate: pkg.endDate ? (this.formatDateForInput(pkg.endDate) ?? '') : '',
          quota: pkg.quota ?? null,
          price: pkg.price ?? null,
          status: pkg.status ?? 'Pending'
        };
      } catch (err) {
        alert('❌ Failed to load package data');
        console.error(err);
        this.goBack();
      }
    },

    formatDateForInput(dateString: string) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    formatPrice(price?: number) {
      return new Intl.NumberFormat('id-ID').format(price || 0);
    },

    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.formData.packageName.trim()) {
        this.errors.packageName = 'Package name is required';
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

      if (this.formData.startDate && this.formData.endDate) {
        if (new Date(this.formData.endDate) <= new Date(this.formData.startDate)) {
          this.errors.endDate = 'End date must be after start date';
          isValid = false;
        }
      }

      if (!this.formData.quota || (this.formData.quota as number) < 1) {
        this.errors.quota = 'Quota must be at least 1';
        isValid = false;
      }

      if (this.formData.price === null || this.formData.price === undefined || (this.formData.price as number) < 0) {
        this.errors.price = 'Price must be at least 0';
        isValid = false;
      }

      if (!this.formData.status) {
        this.errors.status = 'Status is required';
        isValid = false;
      }

      return isValid;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.submitting = true;

      try {
        if (this.isEdit) {
          await packageService.updatePackage(this.packageId, {
            ...this.formData,
            quota: this.formData.quota ?? 1, // Ensure quota is a number
            price: this.formData.price ?? 0 // Ensure price is a number
          });
          alert('✅ Package updated successfully!');
          this.$router.push(`/packages/${this.packageId}`);
        } else {
          interface CreatePackageResponse {
            data?: { id?: string };
            id?: string;
          }
          const response: CreatePackageResponse = await packageService.createPackage({
            ...this.formData,
            quota: this.formData.quota ?? 1,
            price: this.formData.price ?? 0
          });
          const newId = response?.data?.id ?? response?.id;
          alert('✅ Package created successfully!');
          this.$router.push(`/packages/${newId}`);
        }
      } catch (err: unknown) {
        let errorMessage = 'Unknown error';
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
          errorMessage = (err as { message: string }).message;
        }
        alert('❌ Failed to save package: ' + errorMessage);
        console.error('Error saving package:', err);
      } finally {
        this.submitting = false;
      }
    },

    goBack() {
      if (this.isEdit) {
        this.$router.push(`/packages/${this.packageId}`);
      } else {
        this.$router.push('/packages');
      }
    }
  }
});
</script>

<style scoped>
.create-package-view {
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
  margin: 0 0 32px 0;
  font-size: 28px;
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
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
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
