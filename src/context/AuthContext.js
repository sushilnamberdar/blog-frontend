import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// !! UPDATE THIS to your backend's URL
const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Checks for existing session on load

  // Create an Axios instance
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // This is crucial for sending cookies (like the refresh token)
  });

  // Request Interceptor: Add access token to headers
  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Handle 401 errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // If 401 and not the refresh token request itself
      if (error.response && error.response.status === 401 && originalRequest.url !== '/auth/refresh') {
        console.log('Axios interceptor received 401. Attempting to refresh token...');
        try {
          const res = await axiosInstance.get('/auth/refresh');
          setAccessToken(res.data.accessToken);
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed, logging out.', refreshError);
          logout(); // Logout if refresh fails
          return Promise.reject(refreshError);
        }
      }
      // If 401 from refresh token request or other errors, just reject
      if (error.response && error.response.status === 401 && originalRequest.url === '/auth/refresh') {
        console.log('Refresh token request failed with 401. Logging out.');
        logout();
      }
      return Promise.reject(error);
    }
  );

  const fetchUser = async () => {
    try {
      const userRes = await axiosInstance.get('/auth/me');
      setUser(userRes.data);
    } catch (error) {
      console.log('Error fetching user:', error);
      setUser(null); // Ensure user is null if fetch fails
    }
  };

  const refreshToken = async () => {
    console.log('Attempting to refresh token...');
    try {
      const res = await axiosInstance.get('/auth/refresh');
      setAccessToken(res.data.accessToken);
      console.log('Token refreshed successfully.');
      return { success: true };
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      return { success: false, message: error.response?.data?.message || 'Refresh failed' };
    }
  };

  // On component mount, try to refresh token to check for an existing session
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/auth/refresh');
        setAccessToken(res.data.accessToken);
        await fetchUser();
      } catch (error) {
        console.log('No active session found or refresh failed.', error);
        setUser(null);
        setAccessToken(null);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // This effect sets up the 14-minute interval AFTER a user logs in (i.e., when accessToken exists)
  useEffect(() => {
    if (accessToken) {
      const interval = setInterval(() => {
        refreshToken();
      }, 14 * 60 * 1000); // 14 minutes

      // Clear interval on logout (when component unmounts or accessToken becomes null)
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  // --- Auth Functions ---

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      setAccessToken(res.data.accessToken);
      await fetchUser();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
  try {
    const res = await axiosInstance.post('/auth/register', { name, email, password });
    setAccessToken(res.data.accessToken);
    await fetchUser();
    return { success: true };
  } catch (error) {
    console.error('Register error:', error);
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      'Registration failed';
    return { success: false, message };
  }
};

  const logout = async () => {
    try {
      // Call the backend logout endpoint (optional but good practice)
      await axiosInstance.get('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    // Clear local state
    setUser(null);
    setAccessToken(null);
  };

  const authContextValue = {
    user,
    setUser,
    accessToken,
    isLoading,
    login,
    register,
    logout,
    axiosInstance, // Export the configured Axios instance
    fetchUser,
    API_BASE_URL,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
