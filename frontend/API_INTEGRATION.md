# API Integration Guide

This document explains the centralized API integration system for the frontend.

## Overview

The frontend uses a centralized API integration system with:
- **Single API client** (`src/lib/api.ts`) - Handles all API calls
- **API Context** (`src/contexts/ApiContext.tsx`) - React context for API state management
- **Cookie-based caching** - Automatic caching with expiration
- **User preferences** - Stored in cookies
- **Engagement tracking** - Automatic tracking of user interactions

## Setup

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Usage

### 1. Using the API Context

The `ApiProvider` is already added to the root layout. Use the `useApi` hook in any component:

```tsx
"use client";

import { useApi } from "@/contexts/ApiContext";

export default function MyComponent() {
  const { 
    loading, 
    error, 
    posts, 
    fetchPosts, 
    fetchPostBySlug 
  } = useApi();

  useEffect(() => {
    fetchPosts({ status: "published", limit: 10 });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 2. Direct API Calls

For cases where you don't need context state:

```tsx
import { api, endpoints } from "@/lib/api";

// GET request with caching
const response = await api.get(endpoints.posts, {
  status: "published",
  page: 1,
  limit: 10
});

// POST request
const response = await api.post(endpoints.newsletterSubscribe, {
  email: "user@example.com",
  source: "website"
});

// File upload
const formData = new FormData();
formData.append("image", file);
formData.append("name", "My Image");
const response = await api.postFormData(endpoints.brandingImageUpload, formData);
```

### 3. User Preferences

```tsx
import { preferences } from "@/lib/cookies";

// Get preferences
const userPrefs = preferences.get();

// Update preferences
preferences.set({
  language: "en",
  theme: "dark",
  fontSize: "large"
});

// Update single preference
preferences.update("theme", "dark");
```

### 4. Engagement Tracking

Engagement tracking is automatic via the `EngagementTracker` component (already added to layout).

Manual tracking:

```tsx
import { useApi } from "@/contexts/ApiContext";

const { trackPostView, trackUrlClick } = useApi();

// Track post view
trackPostView(postId, postSlug);

// Track URL click
trackUrlClick("https://example.com");
```

## Features

### Automatic Caching

API responses are automatically cached in cookies:
- GET requests are cached by default (5 minutes)
- Cache expiration is configurable
- Cache is cleared automatically on expiration

### Engagement Tracking

The system automatically tracks:
- **Post views** - When a post is viewed
- **URL clicks** - External and internal link clicks
- **Page scrolls** - Scroll depth (25%, 50%, 75%, 100%)
- **Session tracking** - Unique session IDs

Data is:
1. Stored locally in cookies
2. Synced to backend every minute
3. Synced on page unload

### User Preferences

Stored preferences include:
- Language preference
- Theme (light/dark/auto)
- Font size
- Notification preferences
- Preferred categories

## API Methods

### Posts
- `fetchPosts(params)` - Get all posts
- `fetchPostBySlug(slug)` - Get post by slug (auto-tracks view)

### Categories
- `fetchCategories()` - Get all categories
- `fetchCategoryBySlug(slug)` - Get category by slug

### Newsletter
- `subscribeNewsletter(email, source)` - Subscribe to newsletter
- `unsubscribeNewsletter(email)` - Unsubscribe

### Pexels
- `searchPexelsImages(query, params)` - Search images
- `savePexelsImage(data)` - Save image to branding

### Engagement
- `trackPostView(postId, postSlug)` - Track post view
- `trackUrlClick(url)` - Track URL click
- `trackPageScroll(page, scrollDepth)` - Track scroll
- `syncEngagement()` - Sync engagement data to backend

## Error Handling

All API methods return a consistent response format:

```typescript
{
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
}
```

The API context also provides:
- `loading` - Loading state
- `error` - Error message (if any)

## Best Practices

1. **Use the context** for components that need reactive state
2. **Use direct API calls** for one-off requests
3. **Let engagement tracking run automatically** - don't manually track unless needed
4. **Cache is automatic** - disable with `useCache: false` if needed
5. **Preferences persist** - changes are saved automatically

