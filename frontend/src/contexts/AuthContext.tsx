"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, endpoints } from "@/lib/api";
import { token } from "@/lib/cookies";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from session and verify token on mount
  useEffect(() => {
    const loadUserFromSession = async () => {
      if (typeof window !== "undefined") {
        try {
          const userData = localStorage.getItem("user");
          const jwtToken = token.get();
          
          if (userData && jwtToken) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            // Verify token is still valid by fetching current user
            try {
              const response = await api.get(endpoints.getCurrentUser, undefined, false);
              if (response.success && response.data) {
                setUser(response.data as User);
                localStorage.setItem("user", JSON.stringify(response.data));
              } else {
                // Token invalid, clear session
                token.clear();
                localStorage.removeItem("user");
                setUser(null);
              }
            } catch (err) {
              // Token invalid, clear session
              token.clear();
              localStorage.removeItem("user");
              setUser(null);
            }
          } else {
            // No token or user data, clear everything
            token.clear();
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (err) {
          console.error("Error loading user from session:", err);
          token.clear();
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    };

    loadUserFromSession();
  }, []);

  const login = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.login, {
        email: email.trim().toLowerCase(),
      }, false);

      if (response.success && response.data) {
        const { user: userData, token: jwtToken } = response.data as { user: User; token: string };
        setUser(userData);
        
        // Store JWT token in cookie
        if (jwtToken) {
          token.set(jwtToken);
        }
        
        // Store user in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        return true;
      } else {
        setError(response.error?.message || "Login failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.adminLogin, {
        email: email.trim().toLowerCase(),
        password: password,
      }, false);

      if (response.success && response.data) {
        const { user: userData, token: jwtToken } = response.data as { user: User; token: string };
        setUser(userData);
        
        // Store JWT token in cookie
        if (jwtToken) {
          token.set(jwtToken);
        }
        
        // Store user in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        return true;
      } else {
        setError(response.error?.message || "Admin login failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during admin login");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setError(null);
    
    // Call logout API
    try {
      await api.post(endpoints.logout, {}, false);
    } catch (err) {
      // Continue with logout even if API call fails
      console.error("Logout API error:", err);
    }
    
    // Clear token from cookies
    token.clear();
    
    // Clear user data from storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }, []);

  const getCurrentUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.getCurrentUser, { userId }, false);

      if (response.success && response.data) {
        const userData = response.data as User;
        setUser(userData);
        
        // Update stored user
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } else {
        setError(response.error?.message || "Failed to fetch user");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    adminLogin,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

