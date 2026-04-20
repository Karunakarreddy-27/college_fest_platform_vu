import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auth context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAIL = 'AUTH_FAIL';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_LOADING = 'SET_LOADING';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case AUTH_FAIL:
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Auth provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await api.get('/auth/me');
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: res.data.user,
              token: localStorage.getItem('token')
            }
          });
        } catch (error) {
          let errorMessage = 'Authentication failed';

          if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            errorMessage = 'Server is not available on port 5000. Please start backend and retry.';
          } else if (error.response?.status === 401) {
            errorMessage = 'Session expired. Please login again.';
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          dispatch({
            type: AUTH_FAIL,
            payload: errorMessage
          });
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await api.post('/auth/register', formData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data
      });
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Server is not available. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({
        type: AUTH_FAIL,
        payload: errorMessage
      });
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await api.post('/auth/login', formData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Server is not available. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch({
        type: AUTH_FAIL,
        payload: errorMessage
      });
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  // Update user data
  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    });
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/updateprofile', formData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: res.data.user,
          token: state.token
        }
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  // Change password
  const changePassword = async (passwords) => {
    try {
      await api.put('/auth/changepassword', passwords);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password change failed' 
      };
    }
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    clearError,
    updateProfile,
    changePassword,
    updateUser,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
