"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import { navigation } from "@/lib/cookies";

/**
 * Hook for tracking user navigation and time spent on pages
 */
export function useNavigationTracking() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const visitStartTime = useRef<number>(Date.now());
  const pageTitleRef = useRef<string>("");
  const referrerRef = useRef<string>("");

  useEffect(() => {
    // Record visit start time
    visitStartTime.current = Date.now();
    referrerRef.current = typeof document !== "undefined" ? document.referrer : "";
    pageTitleRef.current = typeof document !== "undefined" ? document.title : "";

    // Track page visit when component unmounts or pathname changes
    return () => {
      const timeSpent = Date.now() - visitStartTime.current;
      
      // Only track if user spent at least 1 second on page
      if (timeSpent >= 1000) {
        // Save to cookies
        navigation.trackPageVisit(
          pathname,
          pageTitleRef.current,
          timeSpent,
          referrerRef.current
        );

        // Send to backend (non-blocking, fire and forget)
        // Works for both authenticated and anonymous users
        api.post(
          endpoints.trackNavigation,
          {
            page: pathname,
            pageTitle: pageTitleRef.current,
            referrer: referrerRef.current,
            timeSpent,
          },
          false
        ).catch((err) => {
          console.error("Failed to sync navigation:", err);
        });
      }
    };
  }, [pathname, isAuthenticated, user]);
}

