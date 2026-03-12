import Cookies from "js-cookie";

const expiredTimeToken = 8;

export default {
  state: () => ({
    isLoggedIn: !!Cookies.get("token"),
    token: Cookies.get("token") || null,
    user: JSON.parse(Cookies.get("user") || 'null'),
  }),
  // Getters
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    token: (state) => state.token,
    user: (state) => state.user,
    displayName: (state) => state.user?.name || null,
    email: (state) => state.user?.email || null,
    avatar: (state) => state.user?.avatar || null,
  },
  // Mutations
  mutations: {
    setIsLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  // Actions
  actions: {
    login({ commit }, responseData) {
      // responseData.data chứa { token, id, email, name, avatar, has_selected_level, typeAccount }
      const { token, ...userData } = responseData.data;

      // Cập nhật state
      commit("setIsLoggedIn", true);
      commit("setToken", token);
      commit("setUser", userData);

      // Lưu cookies (thời hạn 8 ngày)
      Cookies.set("token", token, { expires: expiredTimeToken });
      Cookies.set("user", JSON.stringify(userData), { expires: expiredTimeToken });

      return { token, user: userData };
    },

    logout({ commit }) {
      commit("setIsLoggedIn", false);
      commit("setToken", null);
      commit("setUser", null);

      // Xóa cookies với đúng path
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      
      // Xóa localStorage để chắc chắn
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    initAuth({ commit }) {
      const token = Cookies.get("token");
      const userStr = Cookies.get("user");

      if (token) {
        commit("setIsLoggedIn", true);
        commit("setToken", token);
      }

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          commit("setUser", user);
        } catch (e) {
          console.error("Failed to parse user data from cookie", e);
        }
      }
    },
  },
};
