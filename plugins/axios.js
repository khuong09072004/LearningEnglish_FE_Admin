import axios from "axios";
import Cookies from "js-cookie";
import Vue from "vue";
import { Modal } from "ant-design-vue";

export default (_, inject) => {
  // Thiết lập baseURL
  const baseURL = process.env.NUXT_ENV_BASE_URL || 'http://localhost:3001/api';
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers["Content-Type"] = "application/json";
  
  console.log('Axios baseURL:', baseURL); // Log để debug

  // --- Gắn token vào header trước mỗi request ---
  axios.interceptors.request.use((config) => {
    const token = Cookies.get("token");
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // --- Xử lý lỗi phản hồi ---
  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;

      // 403 - Không có quyền
      if (status === 403 && process.client) {
        window.location.href = "/403";
      }

      // 401 - Token hết hạn
      if (
        status === 401 &&
        process.client &&
        !Vue.prototype.$isSessionExpired
      ) {
        Vue.prototype.$isSessionExpired = true;

        Modal.warning({
          title: "Session expired",
          content: "Your session has expired. Please log in again.",
          okText: "OK",
          centered: true,
          maskClosable: false,
          onOk() {
            Cookies.remove("token");
            Cookies.remove("user");
            Vue.prototype.$isSessionExpired = false;
            window.location.href = "/login";
          },
        });
      }

      return Promise.reject(error);
    }
  );
};
