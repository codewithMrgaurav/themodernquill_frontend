"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type ViewMode = "user" | "admin";

interface ModeContextType {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  isAdminMode: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mode, setModeState] = useState<ViewMode>("user");

  // Load mode from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("viewMode") as ViewMode;
      if (savedMode && (savedMode === "user" || savedMode === "admin")) {
        setModeState(savedMode);
      }
    }
  }, []);

  // Reset to user mode if user is not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      setModeState("user");
      if (typeof window !== "undefined") {
        localStorage.setItem("viewMode", "user");
      }
    } else if (user && user.role === "admin" && mode === "user") {
      // If admin logs in and mode is user, check if they had admin mode saved
      const savedMode = localStorage.getItem("viewMode") as ViewMode;
      if (savedMode === "admin") {
        setModeState("admin");
      }
    }
  }, [user, mode]);

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", newMode);
    }
  };

  const value: ModeContextType = {
    mode,
    setMode,
    isAdminMode: mode === "admin",
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}

