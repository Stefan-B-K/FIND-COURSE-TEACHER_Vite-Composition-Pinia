import axios from "axios";
import { defineStore } from "pinia";
import { useAuth } from "./auth.js";

const FIREBASE_DB = import.meta.env.VITE_FIREBASE_DB;
export const useTeachers = defineStore("teachers", {
  state: () => ({
    teachers: [],
    teachersLoaded: false,
    areas: [],
    userIsTeacher: false
  }),

  actions: {
    async addTeacher (newTeacher) {
      const auth = useAuth();
      try {

        await axios.put(`${FIREBASE_DB}/teachers/${auth.userId}.json?auth=${auth.token}`, newTeacher);
      } catch (error) {
        let message = error.response.statusText || error.response.data.error.message;
        throw new Error("Error writing to Firebase: " + message);
      }
      this.setUserIsTeacher();
      this.teachers.push({ ...newTeacher, id: auth.userId });
    },

    async fetchTeachers () {
      this.teachersLoaded = false;
      this.areas = [];
      let loadedTeachers = [];

      try {
        const response = await axios.get(`${FIREBASE_DB}/teachers.json`);
        loadedTeachers = Object.keys(response.data)
          .map(key => ({ ...response.data[key], id: key }));
      } catch (error) {
        let message = error.response.statusText || error.response.data.error.message;
        throw new Error("Error fetching teachers from Firebase: " + message);
      }
      this.teachers = loadedTeachers;
      this.teachersLoaded = true;

      const auth = useAuth();
      for (let teacher in loadedTeachers) {
        if (teacher.id === auth.userId) this.setUserIsTeacher();
      }

      const allAreas = [];
      this.teachers.forEach(teacher => {
        teacher.areas.forEach(area => {
          if (!allAreas.includes(area)) allAreas.push(area);
        });
      });
      this.areas = allAreas;

      this.userIsTeacher = false;
      for (let teacher of this.teachers) {
        if (teacher.id === auth.userId) this.userIsTeacher = true;
      }
    },

    setUserIsTeacher () {
      this.userIsTeacher = true;
      localStorage.setItem("userIsTeacher", "true");
    },

    setUserIsNotTeacher () {
      this.userIsTeacher = false;
      localStorage.removeItem("userIsTeacher");
    }
  }

});