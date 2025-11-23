<template>
  <div class="package-view">
    <div class="header">
      <h1>📦 My Packages</h1>
      <button @click="goToCreate" class="btn-create">
        + Create Package
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading packages...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="fetchPackages" class="btn-retry">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="packages.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>No Packages Yet</h3>
      <p>Create your first tour package to get started!</p>
      <button @click="goToCreate" class="btn-create">
        Create Package
      </button>
    </div>

    <!-- Packages Grid -->
    <div v-else class="packages-grid">
      <PackageCard
        v-for="pkg in packages"
        :key="pkg.id"
        :pkg="pkg"
        @view="viewPackage"
        @edit="editPackage"
        @delete="confirmDelete"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal" @click.stop>
        <h3>⚠️ Confirm Delete</h3>
        <p>Are you sure you want to delete this package?</p>
        <p class="warning">This will also delete all associated plans!</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-cancel">
            Cancel
          </button>
          <button @click="deletePackage" class="btn-confirm-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PackageCard from '@/components/package/PackageCard.vue';
import packageService from '@/services/packageService.ts';

export default {
  name: 'PackageView',
  components: {
    PackageCard
  },
  data(): {
    packages: Array<{ id: number; packageName: string; status: string; startDate: string; endDate: string; quota: number }>,
    loading: boolean,
    error: string | null,
    showDeleteModal: boolean,
    packageToDelete: number | null
  } {
    return {
      packages: [],
      loading: false,
      error: null,
      showDeleteModal: false,
      packageToDelete: null
    };
  },
  mounted() {
    this.fetchPackages();
  },
  methods: {
    async fetchPackages() {
      this.loading = true;
      this.error = null;
      try {
        const response = await packageService.getAllPackages();
        // Ensure each package has all required properties
        let packageArray: Array<{ id: number | string; packageName?: string; status?: string; startDate?: string; endDate?: string; quota?: number }> = [];
        if (Array.isArray(response)) {
          packageArray = response;
        } else if (response && Array.isArray(response.data)) {
          packageArray = response.data;
        }
        this.packages = packageArray.map((pkg: { id: number | string; packageName?: string; status?: string; startDate?: string; endDate?: string; quota?: number }) => ({
          id: typeof pkg.id === 'string' ? parseInt(pkg.id, 10) : pkg.id,
          packageName: pkg.packageName ?? '',
          status: pkg.status ?? '',
          startDate: pkg.startDate ?? '',
          endDate: pkg.endDate ?? '',
          quota: pkg.quota ?? 0
        }));
      } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
          this.error = (err as { message: string }).message;
        } else {
          this.error = 'Failed to fetch packages';
        }
        console.error('Error fetching packages:', err);
      } finally {
        this.loading = false;
      }
    },

    goToCreate() {
      this.$router.push('/packages/create');
    },

    viewPackage(id: number) {
      this.$router.push(`/packages/${id}`);
    },

    editPackage(id: number) {
      this.$router.push(`/packages/${id}/edit`);
    },

    confirmDelete(id: number) {
      this.packageToDelete = id;
      this.showDeleteModal = true;
    },

    async deletePackage() {
      if (this.packageToDelete === null) {
        alert('❌ No package selected for deletion.');
        return;
      }
      try {
        await packageService.deletePackage(String(this.packageToDelete));
        this.packages = this.packages.filter(p => p.id !== this.packageToDelete);
        this.showDeleteModal = false;
        this.packageToDelete = null;
        alert('✅ Package deleted successfully!');
      } catch (err) {
        const errorMsg = (err && typeof err === 'object' && 'message' in err)
          ? (err as { message: string }).message
          : 'Unknown error';
        alert('❌ Failed to delete package: ' + errorMsg);
        console.error('Error deleting package:', err);
      }
    }
  }
};
</script>

<style scoped>
.package-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header h1 {
  margin: 0;
  font-size: 32px;
  color: #111;
}

.btn-create {
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create:hover {
  background: #059669;
  transform: translateY(-2px);
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 60px 20px;
  color: #ef4444;
}

.btn-retry {
  margin-top: 16px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
}

.empty-state p {
  color: #666;
  margin-bottom: 24px;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 32px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
}

.modal p {
  color: #666;
  margin-bottom: 8px;
}

.warning {
  color: #ef4444;
  font-weight: 600;
  margin-bottom: 24px !important;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel,
.btn-confirm-delete {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #e5e7eb;
  color: #333;
}

.btn-confirm-delete {
  background: #ef4444;
  color: white;
}

.btn-confirm-delete:hover {
  background: #dc2626;
}
</style>
