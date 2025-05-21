import axios from "axios";

const instance = axios.create({
  baseURL: "https://taskpro-backend-65h4.onrender.com",
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
        console.error("Error parsing auth data:", e);
        token = null;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No auth token found");
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor ekleyelim
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      localStorage.removeItem("persist:auth");
      window.location.href = "/auth"; // Auth sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

export default instance; 