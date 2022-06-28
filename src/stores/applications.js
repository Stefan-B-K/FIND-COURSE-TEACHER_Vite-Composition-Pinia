import axios from "axios";
import { defineStore } from "pinia";
import { useAuth } from "./auth.js";

const FIREBASE_DB = import.meta.env.VITE_FIREBASE_DB;

export const useApplications = defineStore("applications", {
  state: () => ({
    applications: [],
    applicationsLoaded: false
  }),

  getters: {
    noApplications: (state) => state.applications.length === 0
  },

  actions: {
    async contactTeacher (data) {
      const newApplication = {
        userEmail: data.email,
        message: data.message
      };

      try {
        await axios
          .post(`${FIREBASE_DB}/applications/${data.teacherId}.json`, newApplication);
      } catch (error) {
        let message = error.response.statusText || error.response.data.error.message;
        throw new Error("Error writing to Firebase: " + message);
      }
    },

    async fetchApplications () {
      let loadedApps = [];
      const auth = useAuth();
      try {
        const response = await axios
          .get(`${FIREBASE_DB}/applications/${auth.userId}.json?auth=${auth.token}`);
        if (response.data) {
          loadedApps = Object.keys(response.data)
            .map(key => ({ ...response.data[key], id: key }));
        }
      } catch (error) {
        let message = error.response.statusText || error.response.data.error.message;
        throw new Error("Error fetching applications from Firebase: " + message);
      }
      this.applications = loadedApps;
      this.applicationsLoaded = true;
    },

    async deleteApplication (appId) {
      const auth = useAuth();
      try {
        await axios
          .delete(`${FIREBASE_DB}/applications/${auth.userId}/${appId}.json?auth=${auth.token}`);
        this.applications = this.applications.filter(app => app.id !== appId);
      } catch (error) {
        let message = error.response.statusText || error.response.data.error.message;
        throw new Error("Error deleting application from Firebase: " + message);
      }
    }
  }
});
