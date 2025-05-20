import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.request.use(
  (config) => {
    const persistedAuth = localStorage.getItem("persist:auth");
    let token = null;
    if (persistedAuth) {
      try {
        const root = JSON.parse(persistedAuth);
        if (root.auth) {
          const auth = JSON.parse(root.auth);
          token = auth.token;
        }
      } catch (e) {
        token = null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance; 