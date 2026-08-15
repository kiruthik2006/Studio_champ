import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify auth on load
  const refreshUserProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('access_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn('Auth verification failed:', err);
      // If unauthorized, clear tokens
      if (err.status === 401) {
        api.clearTokens();
        setUser(null);
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.data?.access_token) {
      api.setTokens(res.data.access_token, res.data.refresh_token);
      setToken(res.data.access_token);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    }
    return res;
  };

  const register = async ({ email, password, firstName, lastName }) => {
    const res = await authApi.register({ email, password, firstName, lastName });
    if (res?.data?.access_token) {
      api.setTokens(res.data.access_token, res.data.refresh_token);
      setToken(res.data.access_token);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      api.clearTokens();
      setUser(null);
      setToken(null);
    }
  };

  const updateProfile = async ({ firstName, lastName }) => {
    const res = await authApi.updateProfile({ firstName, lastName });
    if (res?.data) {
      setUser((prev) => ({ ...prev, ...res.data }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
    }
    return res;
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        refreshUserProfile,
      }}
    >
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
