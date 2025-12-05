"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, endpoints, ApiResponse, Post, Category, User, Newsletter, BrandingImage, EngagementStats, NavigationStats } from "@/lib/api";
import { engagement, preferences, session } from "@/lib/cookies";

interface ApiContextType {
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Data
  posts: Post[];
  categories: Category[];
  currentPost: Post | null;
  currentCategory: Category | null;
  
  // Posts Methods
  fetchPosts: (params?: any) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<Post | null>;
  fetchPostById: (id: string) => Promise<Post | null>;
  createPost: (data: any) => Promise<Post | null>;
  updatePost: (id: string, data: any) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
  fetchPostSubposts: (id: string, params?: any) => Promise<Post[]>;
  
  // Categories Methods
  fetchCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<Category | null>;
  fetchCategoryById: (id: string) => Promise<Category | null>;
  createCategory: (data: any) => Promise<Category | null>;
  updateCategory: (id: string, data: any) => Promise<Category | null>;
  
  // Users Methods
  fetchUsers: (params?: any) => Promise<User[]>;
  fetchUserById: (id: string) => Promise<User | null>;
  fetchUserByEmail: (email: string) => Promise<User | null>;
  createUser: (data: any) => Promise<User | null>;
  updateUser: (id: string, data: any) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  
  // Newsletter Methods
  fetchNewsletter: (params?: any) => Promise<Newsletter[]>;
  fetchNewsletterById: (id: string) => Promise<Newsletter | null>;
  subscribeNewsletter: (email: string, source?: string) => Promise<boolean>;
  unsubscribeNewsletter: (email: string) => Promise<boolean>;
  updateNewsletter: (id: string, data: any) => Promise<Newsletter | null>;
  deleteNewsletter: (id: string) => Promise<boolean>;
  
  // Branding Images Methods
  fetchBrandingImages: (params?: any) => Promise<BrandingImage[]>;
  fetchBrandingImageById: (id: string) => Promise<BrandingImage | null>;
  createBrandingImage: (data: any) => Promise<BrandingImage | null>;
  updateBrandingImage: (id: string, data: any) => Promise<BrandingImage | null>;
  deleteBrandingImage: (id: string) => Promise<boolean>;
  uploadBrandingImage: (formData: FormData) => Promise<BrandingImage | null>;
  incrementBrandingImageUsage: (id: string) => Promise<boolean>;
  
  // Pexels Methods
  searchPexelsImages: (query: string, params?: any) => Promise<any[]>;
  fetchPexelsImageById: (id: string) => Promise<any | null>;
  savePexelsImage: (data: any) => Promise<boolean>;
  
  // Engagement tracking
  trackEngagement: (data: any) => Promise<boolean>;
  trackPostView: (postId: string, postSlug: string) => Promise<void>;
  trackUrlClick: (url: string) => void;
  trackPageScroll: (page: string, scrollDepth: number) => void;
  syncEngagement: () => Promise<void>;
  fetchEngagementStats: (params?: any) => Promise<EngagementStats | null>;
  
  // Navigation tracking
  trackNavigation: (data: any) => Promise<boolean>;
  fetchNavigationHistory: (params?: any) => Promise<any[]>;
  fetchNavigationStats: (params?: any) => Promise<NavigationStats | null>;
  
  // Clear cache
  clearCache: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentPost, setCurrentPost] = useState<any | null>(null);
  const [currentCategory, setCurrentCategory] = useState<any | null>(null);

  // Initialize session
  useEffect(() => {
    if (!session.get()) {
      session.set(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  // Sync engagement data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      syncEngagement();
    }, 60000); // Every minute

    // Sync on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", syncEngagement);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", syncEngagement);
      }
    };
  }, []);

  const fetchPosts = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoints.posts, params, true, 300);
      
      if (response.success && response.data) {
        setPosts(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.error?.message || "Failed to fetch posts");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostBySlug = useCallback(async (slug: string): Promise<Post | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<Post>(endpoints.postBySlug(slug), undefined, true, 600);
      
      if (response.success && response.data) {
        const post = response.data as Post;
        setCurrentPost(post);
        
        // Track post view
        if (post._id) {
          trackPostView(post._id, slug);
        }
        
        return post;
      } else {
        setError(response.error?.message || "Post not found");
        return null;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Fetching categories from:", endpoints.categories);
      const response = await api.get(endpoints.categories, undefined, true, 600);
      
      console.log("📦 Categories API Response:", response);
      
      if (response.success && response.data) {
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        console.log(`✅ Loaded ${categoriesData.length} categories`);
        setCategories(categoriesData);
      } else {
        const errorMsg = response.error?.message || "Failed to fetch categories";
        console.error("❌ Categories API Error:", errorMsg, response);
        setError(errorMsg);
        setCategories([]); // Set empty array on error
      }
    } catch (err: any) {
      console.error("❌ Categories fetch exception:", err);
      setError(err.message || "An error occurred");
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryBySlug = useCallback(async (slug: string): Promise<any | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoints.categoryBySlug(slug), undefined, true, 600);
      
      if (response.success && response.data) {
        setCurrentCategory(response.data);
        return response.data;
      } else {
        setError(response.error?.message || "Category not found");
        return null;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const subscribeNewsletter = useCallback(async (email: string, source?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(endpoints.newsletterSubscribe, {
        email,
        source: source || "website",
      });
      
      if (response.success) {
        return true;
      } else {
        setError(response.error?.message || "Failed to subscribe");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribeNewsletter = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(endpoints.newsletterUnsubscribe, { email });
      
      if (response.success) {
        return true;
      } else {
        setError(response.error?.message || "Failed to unsubscribe");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPexelsImages = useCallback(async (query: string, params?: any): Promise<any[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<{ photos: any[] }>(endpoints.pexelsSearch, {
        query,
        ...params,
      }, false); // Don't cache search results
      
      if (response.success && response.data && 'photos' in response.data) {
        return response.data.photos;
      } else {
        setError(response.error?.message || "Failed to search images");
        return [];
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const savePexelsImage = useCallback(async (data: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(endpoints.pexelsSaveToBranding, data);
      
      if (response.success) {
        return true;
      } else {
        setError(response.error?.message || "Failed to save image");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackPostView = useCallback(async (postId: string, postSlug: string) => {
    // Track locally in cookies
    engagement.trackPostView(postId);
    
    // Track in backend (non-blocking)
    try {
      await api.post(endpoints.trackEngagement, {
        type: "post_view",
        postId,
        postSlug,
        sessionId: session.get(),
        timestamp: Date.now(),
      }, false);
    } catch (err) {
      // Silently fail - engagement tracking shouldn't break the app
      console.error("Failed to sync post view:", err);
    }
  }, []);

  const trackUrlClick = useCallback((url: string) => {
    const referrer = typeof window !== "undefined" ? window.location.href : undefined;
    engagement.trackUrlClick(url, referrer);
  }, []);

  const trackPageScroll = useCallback((page: string, scrollDepth: number) => {
    engagement.trackPageScroll(page, scrollDepth);
  }, []);

  const syncEngagement = useCallback(async () => {
    const summary = engagement.getSummary();
    if (!summary || (summary.totalPostViews === 0 && summary.totalUrlClicks === 0 && summary.totalPageScrolls === 0)) {
      return;
    }

    try {
      const engagementData = engagement.get();
      if (engagementData) {
        await api.post(endpoints.trackEngagement, {
          type: "batch",
          data: engagementData,
          sessionId: session.get(),
        }, false);
      }
    } catch (err) {
      // Silently fail
      console.error("Failed to sync engagement:", err);
    }
  }, []);

  // Posts - Additional Methods
  const fetchPostById = useCallback(async (id: string): Promise<Post | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Post>(endpoints.postById(id), undefined, true, 600);
      if (response.success && response.data) {
        return response.data as Post;
      }
      setError(response.error?.message || "Post not found");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data: any): Promise<Post | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Post>(endpoints.createPost, data, false);
      if (response.success && response.data) {
        return response.data as Post;
      }
      setError(response.error?.message || "Failed to create post");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: string, data: any): Promise<Post | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Post>(endpoints.updatePost(id), data, false);
      if (response.success && response.data) {
        return response.data as Post;
      }
      setError(response.error?.message || "Failed to update post");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(endpoints.deletePost(id), false);
      if (response.success) {
        return true;
      }
      setError(response.error?.message || "Failed to delete post");
      return false;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostSubposts = useCallback(async (id: string, params?: any): Promise<Post[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoints.postSubposts(id), params, true, 300);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      setError(response.error?.message || "Failed to fetch subposts");
      return [];
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Categories - Additional Methods
  const fetchCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Category>(endpoints.categoryById(id), undefined, true, 600);
      if (response.success && response.data) {
        return response.data as Category;
      }
      setError(response.error?.message || "Category not found");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: any): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Category>(endpoints.createCategory, data, false);
      if (response.success && response.data) {
        return response.data as Category;
      }
      setError(response.error?.message || "Failed to create category");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: any): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Category>(endpoints.updateCategory(id), data, false);
      if (response.success && response.data) {
        return response.data as Category;
      }
      setError(response.error?.message || "Failed to update category");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Users Methods
  const fetchUsers = useCallback(async (params?: any): Promise<User[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoints.users, params, true, 300);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      setError(response.error?.message || "Failed to fetch users");
      return [];
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<User>(endpoints.userById(id), undefined, true, 600);
      if (response.success && response.data) {
        return response.data as User;
      }
      setError(response.error?.message || "User not found");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserByEmail = useCallback(async (email: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<User>(endpoints.userByEmail(email), undefined, true, 600);
      if (response.success && response.data) {
        return response.data as User;
      }
      setError(response.error?.message || "User not found");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: any): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<User>(endpoints.createUser, data, false);
      if (response.success && response.data) {
        return response.data as User;
      }
      setError(response.error?.message || "Failed to create user");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: any): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<User>(endpoints.updateUser(id), data, false);
      if (response.success && response.data) {
        return response.data as User;
      }
      setError(response.error?.message || "Failed to update user");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(endpoints.deleteUser(id), false);
      if (response.success) {
        return true;
      }
      setError(response.error?.message || "Failed to delete user");
      return false;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Newsletter - Additional Methods
  const fetchNewsletter = useCallback(async (params?: any): Promise<Newsletter[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoints.newsletter, params, true, 300);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      setError(response.error?.message || "Failed to fetch newsletter subscribers");
      return [];
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNewsletterById = useCallback(async (id: string): Promise<Newsletter | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Newsletter>(endpoints.newsletterById(id), undefined, true, 600);
      if (response.success && response.data) {
        return response.data as Newsletter;
      }
      setError(response.error?.message || "Subscriber not found");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNewsletter = useCallback(async (id: string, data: any): Promise<Newsletter | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Newsletter>(endpoints.updateNewsletter(id), data, false);
      if (response.success && response.data) {
        return response.data as Newsletter;
      }
      setError(response.error?.message || "Failed to update subscriber");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNewsletter = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(endpoints.deleteNewsletter(id), false);
      if (response.success) {
        return true;
      }
      setError(response.error?.message || "Failed to delete subscriber");
      return false;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Branding Images - Additional Methods
  const fetchBrandingImages = useCallback(async (params?: any): Promise<BrandingImage[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoints.brandingImages, params, true, 300);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      setError(response.error?.message || "Failed to fetch branding images");
      return [];
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBrandingImageById = useCallback(async (id: string): Promise<BrandingImage | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<BrandingImage>(endpoints.brandingImageById(id), undefined, true, 600);
      if (response.success && response.data) {
        return response.data as BrandingImage;
      }
      setError(response.error?.message || "Branding image not found");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBrandingImage = useCallback(async (data: any): Promise<BrandingImage | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<BrandingImage>(endpoints.createBrandingImage, data, false);
      if (response.success && response.data) {
        return response.data as BrandingImage;
      }
      setError(response.error?.message || "Failed to create branding image");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBrandingImage = useCallback(async (id: string, data: any): Promise<BrandingImage | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<BrandingImage>(endpoints.updateBrandingImage(id), data, false);
      if (response.success && response.data) {
        return response.data as BrandingImage;
      }
      setError(response.error?.message || "Failed to update branding image");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBrandingImage = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(endpoints.deleteBrandingImage(id), false);
      if (response.success) {
        return true;
      }
      setError(response.error?.message || "Failed to delete branding image");
      return false;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadBrandingImage = useCallback(async (formData: FormData): Promise<BrandingImage | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.postFormData<BrandingImage>(endpoints.brandingImageUpload, formData);
      if (response.success && response.data) {
        return response.data as BrandingImage;
      }
      setError(response.error?.message || "Failed to upload branding image");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const incrementBrandingImageUsage = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(endpoints.brandingImageIncrementUsage(id), {}, false);
      if (response.success) {
        return true;
      }
      setError(response.error?.message || "Failed to increment usage");
      return false;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Pexels - Additional Methods
  const fetchPexelsImageById = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoints.pexelsById(id), undefined, false);
      if (response.success && response.data) {
        return response.data;
      }
      setError(response.error?.message || "Pexels image not found");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Engagement - Additional Methods
  const trackEngagement = useCallback(async (data: any): Promise<boolean> => {
    try {
      const response = await api.post(endpoints.trackEngagement, {
        ...data,
        sessionId: session.get(),
        timestamp: Date.now(),
      }, false);
      return response.success;
    } catch (err) {
      console.error("Failed to track engagement:", err);
      return false;
    }
  }, []);

  const fetchEngagementStats = useCallback(async (params?: any): Promise<EngagementStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<EngagementStats>(endpoints.engagementStats, params, true, 300);
      if (response.success && response.data) {
        return response.data as EngagementStats;
      }
      setError(response.error?.message || "Failed to fetch engagement stats");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Navigation - Additional Methods
  const trackNavigation = useCallback(async (data: any): Promise<boolean> => {
    try {
      const response = await api.post(endpoints.trackNavigation, {
        ...data,
        sessionId: session.get(),
      }, false);
      return response.success;
    } catch (err) {
      console.error("Failed to track navigation:", err);
      return false;
    }
  }, []);

  const fetchNavigationHistory = useCallback(async (params?: any): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoints.getNavigationHistory, params, true, 300);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      setError(response.error?.message || "Failed to fetch navigation history");
      return [];
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNavigationStats = useCallback(async (params?: any): Promise<NavigationStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<NavigationStats>(endpoints.getNavigationStats, params, true, 300);
      if (response.success && response.data) {
        return response.data as NavigationStats;
      }
      setError(response.error?.message || "Failed to fetch navigation stats");
      return null;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    if (typeof document !== "undefined") {
      // Clear all API cache cookies
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        if (name.startsWith("api_")) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      });
    }
  }, []);

  const value: ApiContextType = {
    loading,
    error,
    posts,
    categories,
    currentPost,
    currentCategory,
    // Posts
    fetchPosts,
    fetchPostBySlug,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    fetchPostSubposts,
    // Categories
    fetchCategories,
    fetchCategoryBySlug,
    fetchCategoryById,
    createCategory,
    updateCategory,
    // Users
    fetchUsers,
    fetchUserById,
    fetchUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    // Newsletter
    fetchNewsletter,
    fetchNewsletterById,
    subscribeNewsletter,
    unsubscribeNewsletter,
    updateNewsletter,
    deleteNewsletter,
    // Branding Images
    fetchBrandingImages,
    fetchBrandingImageById,
    createBrandingImage,
    updateBrandingImage,
    deleteBrandingImage,
    uploadBrandingImage,
    incrementBrandingImageUsage,
    // Pexels
    searchPexelsImages,
    fetchPexelsImageById,
    savePexelsImage,
    // Engagement
    trackEngagement,
    trackPostView,
    trackUrlClick,
    trackPageScroll,
    syncEngagement,
    fetchEngagementStats,
    // Navigation
    trackNavigation,
    fetchNavigationHistory,
    fetchNavigationStats,
    // Cache
    clearCache,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}

