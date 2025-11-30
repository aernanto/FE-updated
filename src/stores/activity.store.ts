import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue-sonner";
import type { CommonResponseInterface } from "@/interface/common.response.interface";
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityFilterRequest,
} from "@/interface/activity.interface";
import { getAuthToken } from "@/lib/auth";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const useActivityStore = defineStore("activity", {
  state: () => ({
    activities: [] as Activity[],
    selectedActivity: null as Activity | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    resetError() {
      this.error = null;
    },

    parseError(err: any): string {
      let message = "Something went wrong";

      if (err?.response) {
        const data = err.response.data;
        if (typeof data === "string") {
          message = data;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        }
      }

      this.error = message;
      toast.error(message);
      return message;
    },

    async fetchActivities(includeDeleted?: boolean) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<Activity[]>>(
          `${baseUrl}/activities`,
          {
            params: includeDeleted ? { includeDeleted } : undefined,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.activities = res.data.data ?? [];
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async filterActivities(filter: ActivityFilterRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const params: any = {};

        if (filter.name) params.name = filter.name;
        if (filter.activityType) params.activityType = filter.activityType;
        if (filter.startLocation) params.startLocation = filter.startLocation;
        if (filter.endLocation) params.endLocation = filter.endLocation;
        if (filter.startDateFrom) params.startDateFrom = filter.startDateFrom;
        if (filter.startDateTo) params.startDateTo = filter.startDateTo;
        if (filter.endDateFrom) params.endDateFrom = filter.endDateFrom;
        if (filter.endDateTo) params.endDateTo = filter.endDateTo;
        if (typeof filter.includeDeleted === "boolean") {
          params.includeDeleted = filter.includeDeleted;
        }

        const res = await axios.get<CommonResponseInterface<Activity[]>>(
          `${baseUrl}/activities/filter`,
          {
            params,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.activities = res.data.data ?? [];
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async getActivityById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<Activity>>(
          `${baseUrl}/activities/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.selectedActivity = res.data.data ?? null;
        return this.selectedActivity;
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async createActivity(payload: CreateActivityRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.post<CommonResponseInterface<Activity>>(
          `${baseUrl}/activities`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (
          res.data.status === 200 ||
          res.data.status === 201 ||
          res.status === 201
        ) {
          toast.success(res.data.message || "Activity created successfully.");
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        if (res.data.data) {
          this.activities.push(res.data.data);
        }

        return res.data.data;
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async updateActivity(id: string, payload: UpdateActivityRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.put<CommonResponseInterface<Activity>>(
          `${baseUrl}/activities/${id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message || "Activity updated successfully.");
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        const updated = res.data.data;
        if (updated) {
          this.selectedActivity = updated;
          const idx = this.activities.findIndex((a) => a.id === updated.id);
          if (idx !== -1) this.activities[idx] = updated;
        }

        return updated;
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async deleteActivity(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.delete<CommonResponseInterface<null>>(
          `${baseUrl}/activities/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message || "Activity deleted successfully.");
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.activities = this.activities.filter((a) => a.id !== id);
        if (this.selectedActivity?.id === id) {
          this.selectedActivity = null;
        }
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
  },
});
