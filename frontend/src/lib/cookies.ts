/**
 * Cookie Management Utilities
 * Handles user preferences, caching, and session data
 */

import Cookies from "js-cookie";

export interface UserPreferences {
  language: string;
  theme: "light" | "dark" | "auto";
  fontSize: "small" | "medium" | "large";
  notifications: boolean;
  preferredCategories: string[];
}

export interface EngagementData {
  postViews: Record<string, number>;
  urlClicks: Array<{
    url: string;
    timestamp: number;
    referrer?: string;
  }>;
  pageScrolls: Array<{
    page: string;
    scrollDepth: number;
    timestamp: number;
  }>;
  lastActivity: number;
}

const COOKIE_OPTIONS = {
  expires: 365, // 1 year
  sameSite: "Lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const PREFERENCES_KEY = "user_preferences";
const ENGAGEMENT_KEY = "user_engagement";
const SESSION_KEY = "user_session";
const TOKEN_KEY = "auth_token";

/**
 * User Preferences Management
 */
export const preferences = {
  get(): UserPreferences | null {
    try {
      const data = Cookies.get(PREFERENCES_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading preferences:", error);
    }
    return null;
  },

  set(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.get() || getDefaultPreferences();
      const updated = { ...current, ...prefs };
      Cookies.set(PREFERENCES_KEY, JSON.stringify(updated), COOKIE_OPTIONS);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  },

  update(key: keyof UserPreferences, value: any): void {
    const current = this.get() || getDefaultPreferences();
    this.set({ [key]: value });
  },

  clear(): void {
    Cookies.remove(PREFERENCES_KEY);
  },
};

/**
 * Engagement Data Management
 */
export const engagement = {
  get(): EngagementData | null {
    try {
      const data = Cookies.get(ENGAGEMENT_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading engagement:", error);
    }
    return null;
  },

  init(): EngagementData {
    return {
      postViews: {},
      urlClicks: [],
      pageScrolls: [],
      lastActivity: Date.now(),
    };
  },

  trackPostView(postId: string): void {
    const data = this.get() || this.init();
    data.postViews[postId] = (data.postViews[postId] || 0) + 1;
    data.lastActivity = Date.now();
    this.save(data);
  },

  trackUrlClick(url: string, referrer?: string): void {
    const data = this.get() || this.init();
    data.urlClicks.push({
      url,
      timestamp: Date.now(),
      referrer: referrer || (typeof window !== "undefined" ? window.location.href : undefined),
    });
    
    // Keep only last 100 clicks
    if (data.urlClicks.length > 100) {
      data.urlClicks = data.urlClicks.slice(-100);
    }
    
    data.lastActivity = Date.now();
    this.save(data);
  },

  trackPageScroll(page: string, scrollDepth: number): void {
    const data = this.get() || this.init();
    
    // Only track if scroll depth is significant (more than 25%)
    if (scrollDepth > 25) {
      data.pageScrolls.push({
        page,
        scrollDepth,
        timestamp: Date.now(),
      });
      
      // Keep only last 50 scroll events
      if (data.pageScrolls.length > 50) {
        data.pageScrolls = data.pageScrolls.slice(-50);
      }
      
      data.lastActivity = Date.now();
      this.save(data);
    }
  },

  save(data: EngagementData): void {
    try {
      Cookies.set(ENGAGEMENT_KEY, JSON.stringify(data), COOKIE_OPTIONS);
    } catch (error) {
      console.error("Error saving engagement:", error);
    }
  },

  clear(): void {
    Cookies.remove(ENGAGEMENT_KEY);
  },

  // Get summary for API submission
  getSummary() {
    const data = this.get();
    if (!data) return null;

    return {
      totalPostViews: Object.keys(data.postViews).length,
      totalUrlClicks: data.urlClicks.length,
      totalPageScrolls: data.pageScrolls.length,
      lastActivity: data.lastActivity,
    };
  },
};

/**
 * Session Management
 */
export const session = {
  get(): string | null {
    return Cookies.get(SESSION_KEY) || null;
  },

  set(sessionId: string): void {
    Cookies.set(SESSION_KEY, sessionId, {
      ...COOKIE_OPTIONS,
      expires: 1, // 1 day
    });
  },

  clear(): void {
    Cookies.remove(SESSION_KEY);
  },
};

/**
 * Default user preferences
 */
function getDefaultPreferences(): UserPreferences {
  return {
    language: "en",
    theme: "light",
    fontSize: "medium",
    notifications: true,
    preferredCategories: [],
  };
}

/**
 * JWT Token Management
 */
export const token = {
  get(): string | null {
    return Cookies.get(TOKEN_KEY) || null;
  },

  set(tokenValue: string): void {
    Cookies.set(TOKEN_KEY, tokenValue, {
      ...COOKIE_OPTIONS,
      expires: 30, // 30 days
    });
  },

  clear(): void {
    Cookies.remove(TOKEN_KEY);
  },
};

/**
 * Navigation Tracking Data
 */
export interface NavigationData {
  pageVisits: Array<{
    page: string;
    pageTitle: string;
    visitStart: number;
    visitEnd?: number;
    timeSpent: number;
    referrer?: string;
  }>;
  lastActivity: number;
}

const NAVIGATION_KEY = "user_navigation";

export const navigation = {
  get(): NavigationData | null {
    try {
      const data = Cookies.get(NAVIGATION_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading navigation:", error);
    }
    return null;
  },

  init(): NavigationData {
    return {
      pageVisits: [],
      lastActivity: Date.now(),
    };
  },

  trackPageVisit(page: string, pageTitle: string, timeSpent: number, referrer?: string): void {
    const data = this.get() || this.init();
    
    data.pageVisits.push({
      page,
      pageTitle,
      visitStart: Date.now() - timeSpent,
      visitEnd: Date.now(),
      timeSpent,
      referrer: referrer || (typeof window !== "undefined" ? document.referrer : undefined),
    });

    // Keep only last 50 page visits
    if (data.pageVisits.length > 50) {
      data.pageVisits = data.pageVisits.slice(-50);
    }

    data.lastActivity = Date.now();
    this.save(data);
  },

  save(data: NavigationData): void {
    try {
      Cookies.set(NAVIGATION_KEY, JSON.stringify(data), COOKIE_OPTIONS);
    } catch (error) {
      console.error("Error saving navigation:", error);
    }
  },

  clear(): void {
    Cookies.remove(NAVIGATION_KEY);
  },
};

/**
 * Clear all cookies
 */
export function clearAllCookies(): void {
  preferences.clear();
  engagement.clear();
  session.clear();
  token.clear();
  navigation.clear();
}

