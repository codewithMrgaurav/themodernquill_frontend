"use client";

import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import { useNavigationTracking } from "@/hooks/useNavigationTracking";

/**
 * Component that initializes engagement and navigation tracking
 * This component doesn't render anything, it just sets up tracking
 */
export function EngagementTracker() {
  useEngagementTracking();
  useNavigationTracking();
  return null;
}

