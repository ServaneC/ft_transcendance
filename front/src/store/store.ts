import User from "@/types/User";
import Channel from "@/types/Channel";
import { createStore } from "vuex";

export default createStore({
  state: {
    login: false as boolean,
    user: {} as User,
  },
  getters: {
    getAuthenticated: (state) => {
      return state.login;
    },
    getUser: (state) => {
      return state.user;
    },
  },
  mutations: {
    currentUser(state, payload) {
      state.user = payload;
    },
    isAuthenticated(state, bool: boolean) {
      state.login = bool;
    },
  },
  actions: {},
  modules: {},
});
