import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types'; // Add this import
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { login as apiLogin, register as apiRegister, getMe as apiGetMe, googleAuth as apiGoogleAuth } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
  // 1️⃣ Remove token and reset state
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);

  // 2️⃣ Disable Google auto-select
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect();
  }

  // 3️⃣ Redirect to login page
  navigate('/login');
}, [navigate]);



  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userData = await apiGetMe(token);
          setUser({ ...userData, role: decoded.role });
        } catch (error) {
          console.error('Failed to load user', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [logout, token]);

const login = async (credentials, isGoogle = false) => {
  try {
    let response;
    if (isGoogle) {
      response = await apiGoogleAuth(credentials);
    } else {
      response = await apiLogin(credentials.email, credentials.password);
    }

    setUser({ 
      ...response.user,
      hasCompletedOnboarding: response.user.has_completed_onboarding 
    });
    
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    
    // Role-based redirect
    let redirectPath = '/dashboard';
    if (response.user.role === 'parent') {
      redirectPath = '/parent';
    } else if (response.user.role === 'admin') {
      redirectPath = '/admin';
    }
    
    navigate(redirectPath);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

  const register = async (userData) => {
    try {
      const { token: authToken, user: newUser } = await apiRegister(userData);
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(newUser);
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

const updateUser = (updatedUserData) => {
  setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
};

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};



export function useAuth() {
  return useContext(AuthContext);
}











