import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
  requires2FA: false,
  tempToken: null,
  userPermissions: [],
  userRole: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        requires2FA: false,
        tempToken: null,
        userPermissions: action.payload.user?.permissions || [],
        userRole: action.payload.user?.role,
      };
    case 'AUTH_2FA_REQUIRED':
      return {
        ...state,
        requires2FA: true,
        tempToken: action.payload.tempToken,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        requires2FA: false,
        tempToken: null,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        requires2FA: false,
        tempToken: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && state.token) {
          // Try to refresh token
          try {
            const response = await axios.post('/api/refresh');
            const { access_token, user } = response.data;
            
            localStorage.setItem('token', access_token);
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { token: access_token, user },
            });
            
            // Retry the original request
            error.config.headers.Authorization = `Bearer ${access_token}`;
            return axios.request(error.config);
          } catch (refreshError) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [state.token]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await axios.get('/api/profile');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { token: state.token, user: response.data },
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post('/api/login', credentials);
      
      if (response.data.requires_2fa) {
        dispatch({
          type: 'AUTH_2FA_REQUIRED',
          payload: { tempToken: response.data.temp_token },
        });
        return { requires2FA: true };
      }

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { token: access_token, user },
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const verify2FA = async (otp, email) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post('/api/verify-2fa', {
        email,
        otp,
        temp_token: state.tempToken,
      });

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { token: access_token, user },
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || '2FA verification failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post('/api/register', userData);
      dispatch({ type: 'AUTH_FAILURE', payload: null });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await axios.post('/api/verify-email', { email, otp });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Email verification failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      if (state.token) {
        await axios.post('/api/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const updateProfile = (userData) => {
    // This function updates the user in the context state
    // It can be called with the user object directly
    if (userData && typeof userData === 'object') {
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const updateProfileAPI = async (profileData) => {
    try {
      const response = await axios.put('/api/profile', profileData);
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors || 'Profile update failed';
      throw new Error(message);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await axios.post('/api/change-password', passwordData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Password change failed';
      throw new Error(message);
    }
  };

  const enable2FA = async () => {
    try {
      const response = await axios.post('/api/enable-2fa');
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { two_factor_enabled: true } 
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || '2FA enable failed';
      throw new Error(message);
    }
  };

  const disable2FA = async (password) => {
    try {
      const response = await axios.post('/api/disable-2fa', { password });
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { two_factor_enabled: false } 
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || '2FA disable failed';
      throw new Error(message);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    verify2FA,
    register,
    verifyEmail,
    logout,
    updateProfile,
    updateProfileAPI,
    changePassword,
    enable2FA,
    disable2FA,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
