import axios from "axios";
import { defineStore } from "pinia";

let timer;

const API_KEY = import.meta.env.VITE_API_KEY;
const SIGNUP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
const LOGIN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

export const useAuth = defineStore("auth", {
  state: () => ({
    userId: null,
    token: null
  }),

  getters: {
    userIsLoggedIn: state => !!state.userId
  },

  actions: {
    async authorize (userData) {
      const userInputData = userData[0];
      const authType = userData[1];
      let userAuthData;
      try {
        const url = authType === "login" ? LOGIN_URL : SIGNUP_URL;
        const response = await axios
          .post(url + API_KEY, { ...userInputData, returnSecureToken: true });
        userAuthData = response.data;
      } catch (error) {
        let message = authType === "login" ? "Error logging in: " : "Error registering new user: ";
        message += error.response.statusText || error.response.data.error.message;
        throw  new Error("Error logging in: " + message);
      }

      const expiresInMilliseconds = +userAuthData.expiresIn * 1000;
      const expirationTime = new Date().getTime() + expiresInMilliseconds;

      timer = setTimeout(() => { this.logout(); }, expiresInMilliseconds);

      localStorage.setItem("token", userAuthData.idToken);
      localStorage.setItem("userId", userAuthData.localId);
      localStorage.setItem("tokenExpiration", expirationTime);

      this.setUserAuthData(userAuthData);
    },

    keepLogin () {
      const idToken = localStorage.getItem("token");
      const localId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const expiresInMilliseconds = +tokenExpiration - new Date().getTime();
      if (expiresInMilliseconds < 10000) return;

      timer = setTimeout(function() { this.logout(); }, expiresInMilliseconds);

      if (idToken && localId) {
        this.setUserAuthData({ idToken, localId });
      }
    },

    logout () {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userIsTeacher");
      localStorage.removeItem("tokenExpiration");

      this.setUserAuthData({ idToken: null, localId: null });
      clearTimeout(timer);
    },

    setUserAuthData (userAuthData) {
      this.userId = userAuthData.localId;
      this.token = userAuthData.idToken;
    }
  }
});

