/**
 * Centralized API Integration
 * Handles all API calls with caching, error handling, and request/response interceptors
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api/v1";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Get JWT token from cookies
   */
  private getToken(): string | null {
    if (typeof document === "undefined") return null;
    
    try {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) => row.startsWith("auth_token="));
      if (tokenCookie) {
        return tokenCookie.split("=")[1];
      }
    } catch (error) {
      console.error("Error reading token:", error);
    }
    
    return null;
  }

  /**
   * Get cached data from cookies with ETag support
   */
  private getCachedData<T>(key: string): { data: T; etag?: string } | null {
    if (typeof window === "undefined") return null;
    
    try {
      const cached = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${key}=`));
      
      if (cached) {
        const value = cached.split("=")[1];
        const decoded = decodeURIComponent(value);
        const parsed = JSON.parse(decoded);
        
        // Check if cache is expired
        if (parsed.expires && Date.now() > parsed.expires) {
          this.clearCache(key);
          return null;
        }
        
        return { data: parsed.data, etag: parsed.etag };
      }
    } catch (error) {
      console.error("Error reading cache:", error);
    }
    
    return null;
  }

  /**
   * Set data in cookies with expiration and ETag
   */
  private setCachedData<T>(key: string, data: T, maxAge: number = 3600, etag?: string): void {
    if (typeof window === "undefined") return;
    
    try {
      const expires = Date.now() + maxAge * 1000;
      const cacheData = {
        data,
        expires,
        etag,
      };
      
      const encoded = encodeURIComponent(JSON.stringify(cacheData));
      document.cookie = `${key}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  }

  /**
   * Clear cached data
   */
  private clearCache(key: string): void {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = false,
    cacheKey?: string,
    cacheMaxAge: number = 300
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Check cache if enabled
    if (useCache && cacheKey) {
      const cached = this.getCachedData<T>(cacheKey);
      if (cached !== null) {
        return {
          success: true,
          data: cached.data,
          error: null,
        };
      }
    }

    try {
      // Add JWT token to headers if available
      const jwtToken = this.getToken();
      const headers: Record<string, string> = {
        ...(this.defaultHeaders as Record<string, string>),
        ...(options.headers as Record<string, string> || {}),
      };
      
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: headers as HeadersInit,
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw {
          message: result.error?.message || "Request failed",
          code: result.error?.code || "UNKNOWN_ERROR",
          status: response.status,
        } as ApiError;
      }

      // Cache successful responses
      if (useCache && cacheKey && result.success && result.data) {
        this.setCachedData(cacheKey, result.data, cacheMaxAge);
      }

      return result;
    } catch (error: any) {
      console.error("API Error:", error);
      
      // Handle network errors (fetch failures)
      if (error instanceof TypeError && (error.message.includes("fetch") || error.message.includes("Failed to fetch"))) {
        return {
          success: false,
          data: null,
          error: {
            message: "Failed to connect to server. Please check if the backend is running on port 7000.",
            code: "NETWORK_ERROR",
          },
        };
      }
      
      return {
        success: false,
        data: null,
        error: {
          message: error.message || "An unexpected error occurred",
          code: error.code || "INTERNAL_ERROR",
        },
      };
    }
  }

  // GET request with ETag support to avoid unnecessary requests
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    useCache: boolean = true,
    cacheMaxAge: number = 300
  ): Promise<ApiResponse<T>> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const cacheKey = `api_${endpoint}${queryString}`;
    
    // Check cache first
    if (useCache) {
      const cached = this.getCachedData<T>(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached.data,
          error: null,
        };
      }
    }

    const url = `${this.baseURL}${endpoint}${queryString}`;
    const jwtToken = this.getToken();
    const headers: Record<string, string> = {
      ...(this.defaultHeaders as Record<string, string>),
    };
    
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }

    // Add If-None-Match header if we have cached ETag
    if (useCache) {
      const cached = this.getCachedData<T>(cacheKey);
      if (cached?.etag) {
        headers["If-None-Match"] = cached.etag;
      }
    }

    try {
      console.log(`🌐 API GET Request: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        headers: headers as HeadersInit,
      });

      console.log(`📡 API Response Status: ${response.status} ${response.statusText} for ${endpoint}`);

      // If not modified, return cached data
      if (response.status === 304 && useCache) {
        const cached = this.getCachedData<T>(cacheKey);
        if (cached) {
          console.log(`💾 Using cached data for ${endpoint}`);
          return {
            success: true,
            data: cached.data,
            error: null,
          };
        }
      }

      // Check if response has JSON content
      let result: ApiResponse<T>;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // If not JSON, create error response
        const text = await response.text();
        console.error("❌ Non-JSON response:", text);
        throw {
          message: text || `HTTP ${response.status}: ${response.statusText}`,
          code: "HTTP_ERROR",
          status: response.status,
        };
      }

      if (!response.ok) {
        console.error("❌ API Error Response:", result);
        throw {
          message: result.error?.message || "Request failed",
          code: result.error?.code || "UNKNOWN_ERROR",
          status: response.status,
        };
      }

      // Cache successful responses with ETag
      if (useCache && result.success && result.data) {
        const etag = response.headers.get("ETag");
        this.setCachedData(cacheKey, result.data, cacheMaxAge, etag || undefined);
        console.log(`💾 Cached response for ${endpoint}`);
      }

      console.log(`✅ API GET Success for ${endpoint}:`, {
        success: result.success,
        hasData: !!result.data,
        dataType: Array.isArray(result.data) ? `array[${result.data.length}]` : typeof result.data
      });

      return result;
    } catch (error: any) {
      console.error("API Error:", error);
      
      return {
        success: false,
        data: null,
        error: {
          message: error.message || "An unexpected error occurred",
          code: error.code || "INTERNAL_ERROR",
        },
      };
    }
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: any,
    useCache: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      useCache
    );
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: any,
    useCache: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      useCache
    );
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: any,
    useCache: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      useCache
    );
  }

  // DELETE request
  async delete<T>(
    endpoint: string,
    useCache: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      { method: "DELETE" },
      useCache
    );
  }

  // POST with FormData (for file uploads)
  async postFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const jwtToken = this.getToken();

    try {
      const headers: Record<string, string> = {};
      
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: headers as HeadersInit,
        // Don't set Content-Type, let browser set it with boundary
      });

      // Check if response has JSON content
      let result: ApiResponse<T>;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // If not JSON, create error response
        const text = await response.text();
        throw {
          message: text || `HTTP ${response.status}: ${response.statusText}`,
          code: "HTTP_ERROR",
          status: response.status,
        } as ApiError;
      }

      if (!response.ok) {
        throw {
          message: result.error?.message || "Request failed",
          code: result.error?.code || "UNKNOWN_ERROR",
          status: response.status,
        } as ApiError;
      }

      return result;
    } catch (error: any) {
      console.error("API Error:", error);
      
      // Handle network errors (fetch failures)
      if (error instanceof TypeError && (error.message.includes("fetch") || error.message.includes("Failed to fetch"))) {
        return {
          success: false,
          data: null,
          error: {
            message: "Failed to connect to server. Please check if the backend is running on port 7000.",
            code: "NETWORK_ERROR",
          },
        };
      }
      
      return {
        success: false,
        data: null,
        error: {
          message: error.message || "An unexpected error occurred",
          code: error.code || "INTERNAL_ERROR",
        },
      };
    }
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// API Endpoints
export const endpoints = {
  // Health
  health: "/health",
  
  // Posts
  posts: "/posts",
  postBySlug: (slug: string) => `/posts/${slug}`,
  postById: (id: string) => `/posts/${id}`,
  postSubposts: (id: string) => `/posts/${id}/subposts`,
  createPost: "/posts",
  updatePost: (id: string) => `/posts/${id}`,
  deletePost: (id: string) => `/posts/${id}`,
  
  // Categories
  categories: "/categories",
  categoryBySlug: (slug: string) => `/categories/${slug}`,
  categoryById: (id: string) => `/categories/${id}`,
  createCategory: "/categories",
  updateCategory: (id: string) => `/categories/${id}`,
  
  // Users
  users: "/users",
  userById: (id: string) => `/users/${id}`,
  userByEmail: (email: string) => `/users/email/${email}`,
  createUser: "/users",
  updateUser: (id: string) => `/users/${id}`,
  deleteUser: (id: string) => `/users/${id}`,
  
  // Newsletter
  newsletter: "/newsletter",
  newsletterSubscribe: "/newsletter/subscribe",
  newsletterUnsubscribe: "/newsletter/unsubscribe",
  newsletterById: (id: string) => `/newsletter/${id}`,
  updateNewsletter: (id: string) => `/newsletter/${id}`,
  deleteNewsletter: (id: string) => `/newsletter/${id}`,
  
  // Branding Images
  brandingImages: "/branding-images",
  brandingImageById: (id: string) => `/branding-images/${id}`,
  brandingImageUpload: "/branding-images/upload",
  brandingImageIncrementUsage: (id: string) => `/branding-images/${id}/increment-usage`,
  createBrandingImage: "/branding-images",
  updateBrandingImage: (id: string) => `/branding-images/${id}`,
  deleteBrandingImage: (id: string) => `/branding-images/${id}`,
  
  // Pexels
  pexelsSearch: "/pexels/search",
  pexelsById: (id: string) => `/pexels/${id}`,
  pexelsSaveToBranding: "/pexels/save-to-branding",
  
  // Engagement Tracking
  trackEngagement: "/engagement/track",
  engagementStats: "/engagement/stats",
  
  // Authentication
  login: "/auth/login",
  adminLogin: "/auth/admin/login",
  logout: "/auth/logout",
  getCurrentUser: "/auth/me",
  
  // Navigation Tracking
  trackNavigation: "/navigation/track",
  getNavigationHistory: "/navigation/history",
  getNavigationStats: "/navigation/stats",
};

// Types for API responses
export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  content?: string;
  contentBlocks?: any[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  image: string;
  hashtags?: string[];
  keywords?: string[];
  status: "draft" | "published" | "archived";
  views: number;
  isFeatured: boolean;
  parentPost?: string;
  brandingImage?: string;
  publishedAt: string;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
  subposts?: Post[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  postCount?: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "author" | "admin";
  avatar?: string;
  bio?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  _id: string;
  email: string;
  isActive: boolean;
  source?: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandingImage {
  _id: string;
  name: string;
  imageUrl: string;
  description?: string;
  category?: string;
  tags?: string[];
  usageCount: number;
  lastUsedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface Engagement {
  _id: string;
  type: "post_view" | "url_click" | "page_scroll" | "batch";
  postId?: string;
  postSlug?: string;
  url?: string;
  referrer?: string;
  page?: string;
  scrollDepth?: number;
  sessionId: string;
  timestamp: number;
  createdAt: string;
}

export interface Navigation {
  _id: string;
  userId?: string;
  sessionId: string;
  page: string;
  pageTitle?: string;
  referrer?: string;
  timeSpent: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface EngagementStats {
  totalViews: number;
  totalClicks: number;
  totalScrolls: number;
  uniqueSessions: number;
  topPosts: Array<{
    postId: string;
    postSlug: string;
    views: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface NavigationStats {
  totalPages: number;
  uniqueSessions: number;
  averageTimeSpent: number;
  topPages: Array<{
    page: string;
    visits: number;
    averageTime: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

