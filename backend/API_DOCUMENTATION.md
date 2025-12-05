# API Documentation

Complete API documentation with request payloads and response examples.

## Table of Contents
1. [Health Check](#health-check)
2. [Posts](#posts)
3. [Categories](#categories)
4. [Users](#users)
5. [Newsletter](#newsletter)
6. [Branding Images](#branding-images)
7. [Pexels](#pexels)

---

## Health Check

### GET /api/v1/health
Get API health status

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 3600,
    "environment": "development",
    "database": {
      "status": "connected",
      "connected": true,
      "name": "themodernquill"
    }
  },
  "error": null
}
```

---

## Posts

### GET /api/v1/posts
Get all posts with pagination

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 10)
- `status` (string: draft, published, archived)
- `category` (string: category ID)
- `search` (string)
- `parentPost` (string: parent post ID)
- `topLevelOnly` (boolean)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Getting Started with React Hooks",
      "slug": "getting-started-with-react-hooks",
      "excerpt": "Learn how to use React Hooks...",
      "category": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Technology",
        "slug": "technology"
      },
      "image": "https://example.com/image.jpg",
      "status": "published",
      "views": 150,
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "error": null
}
```

### GET /api/v1/posts/:slug
Get a post by slug

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Getting Started with React Hooks",
    "slug": "getting-started-with-react-hooks",
    "excerpt": "Learn how to use React Hooks...",
    "description": "A comprehensive guide...",
    "content": "<p>React Hooks are powerful...</p>",
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Technology",
      "slug": "technology"
    },
    "image": "https://example.com/image.jpg",
    "hashtags": ["react", "javascript"],
    "keywords": ["react hooks", "tutorial"],
    "status": "published",
    "views": 150,
    "isFeatured": false,
    "subposts": [],
    "publishedAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

### POST /api/v1/posts
Create a new post

**Request Body:**
```json
{
  "title": "Getting Started with React Hooks",
  "slug": "getting-started-with-react-hooks",
  "excerpt": "Learn how to use React Hooks to build modern React applications",
  "description": "A comprehensive guide to React Hooks for beginners",
  "content": "<p>React Hooks are a powerful feature...</p>",
  "category": "507f1f77bcf86cd799439011",
  "image": "https://example.com/image.jpg",
  "hashtags": ["react", "javascript", "web-development"],
  "keywords": ["react hooks", "frontend", "tutorial"],
  "readTime": "5 min read",
  "status": "published",
  "isFeatured": false,
  "parentPost": null,
  "brandingImage": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Getting Started with React Hooks",
    "slug": "getting-started-with-react-hooks",
    "excerpt": "Learn how to use React Hooks...",
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Technology",
      "slug": "technology"
    },
    "image": "https://example.com/image.jpg",
    "status": "published",
    "views": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

### PATCH /api/v1/posts/:id
Update a post

**Request Body:**
```json
{
  "title": "Updated Post Title",
  "status": "published",
  "isFeatured": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Updated Post Title",
    "status": "published",
    "isFeatured": true,
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "error": null
}
```

### DELETE /api/v1/posts/:id
Delete a post

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013"
  },
  "error": null
}
```

### GET /api/v1/posts/:id/subposts
Get subposts of a post

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Subpost Title",
      "slug": "subpost-title",
      "category": {
        "name": "Technology"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "error": null
}
```

---

## Categories

### GET /api/v1/categories
Get all categories

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Technology",
      "slug": "technology",
      "description": "Latest tech news and tutorials",
      "image": "https://example.com/tech.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "error": null
}
```

### GET /api/v1/categories/:slug
Get a category by slug

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Technology",
    "slug": "technology",
    "description": "Latest tech news and tutorials",
    "image": "https://example.com/tech.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

### POST /api/v1/categories
Create a new category

**Request Body:**
```json
{
  "name": "Technology",
  "slug": "technology",
  "description": "Latest tech news and tutorials",
  "image": "https://example.com/tech.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Technology",
    "slug": "technology",
    "description": "Latest tech news and tutorials",
    "image": "https://example.com/tech.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

### PATCH /api/v1/categories/:id
Update a category

**Request Body:**
```json
{
  "description": "Updated description",
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Technology",
    "slug": "technology",
    "description": "Updated description",
    "image": "https://example.com/new-image.jpg",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "error": null
}
```

---

## Users

### GET /api/v1/users
Get all users

**Query Parameters:**
- `page` (integer)
- `limit` (integer)
- `search` (string)
- `role` (string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "error": null
}
```

### POST /api/v1/users
Create a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Software developer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

---

## Newsletter

### GET /api/v1/newsletter
Get all newsletter subscribers

**Query Parameters:**
- `page` (integer)
- `limit` (integer)
- `isActive` (boolean)
- `search` (string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "email": "subscriber@example.com",
      "isActive": true,
      "subscribedAt": "2024-01-01T00:00:00.000Z",
      "source": "website"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "error": null
}
```

### POST /api/v1/newsletter/subscribe
Subscribe to newsletter

**Request Body:**
```json
{
  "email": "subscriber@example.com",
  "source": "website"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "email": "subscriber@example.com",
    "isActive": true,
    "subscribedAt": "2024-01-01T00:00:00.000Z",
    "source": "website"
  },
  "error": null
}
```

### POST /api/v1/newsletter/unsubscribe
Unsubscribe from newsletter

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "email": "subscriber@example.com",
    "isActive": false,
    "unsubscribedAt": "2024-01-02T00:00:00.000Z"
  },
  "error": null
}
```

---

## Branding Images

### GET /api/v1/branding-images
Get all branding images

**Query Parameters:**
- `page` (integer)
- `limit` (integer)
- `category` (string: logo, background, overlay, watermark, icon, banner, other)
- `isActive` (boolean)
- `search` (string)
- `tag` (string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "name": "Company Logo",
      "description": "Main company logo",
      "imageUrl": "/uploads/branding-images/logo.jpg",
      "category": "logo",
      "tags": ["logo", "branding"],
      "width": 500,
      "height": 500,
      "fileSize": 50000,
      "usageCount": 10,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  },
  "error": null
}
```

### POST /api/v1/branding-images/upload
Upload a branding image

**Request:** multipart/form-data
- `image` (file, required)
- `name` (string, required)
- `description` (string, optional)
- `category` (string, optional)
- `tags` (string, comma-separated, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "name": "Company Logo",
    "imageUrl": "/uploads/branding-images/logo-1234567890.jpg",
    "category": "logo",
    "tags": ["logo"],
    "width": 500,
    "height": 500,
    "fileSize": 50000,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

---

## Pexels

### GET /api/v1/pexels/search
Search images from Pexels

**Query Parameters:**
- `query` (string, required)
- `perPage` (integer, default: 20, max: 80)
- `page` (integer, default: 1)
- `orientation` (string: all, landscape, portrait, square)
- `size` (string: all, large, medium, small)
- `color` (string: all, red, orange, yellow, green, turquoise, blue, violet, pink, brown, black, gray, white)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalResults": 5000,
    "page": 1,
    "perPage": 20,
    "photos": [
      {
        "id": "123456",
        "width": 1920,
        "height": 1080,
        "url": "https://www.pexels.com/photo/...",
        "photographer": "John Doe",
        "photographerUrl": "https://www.pexels.com/@johndoe",
        "src": {
          "original": "https://images.pexels.com/photos/...",
          "large": "https://images.pexels.com/photos/...",
          "large2x": "https://images.pexels.com/photos/...",
          "medium": "https://images.pexels.com/photos/...",
          "small": "https://images.pexels.com/photos/...",
          "portrait": "https://images.pexels.com/photos/...",
          "landscape": "https://images.pexels.com/photos/...",
          "tiny": "https://images.pexels.com/photos/..."
        }
      }
    ]
  },
  "error": null
}
```

### GET /api/v1/pexels/:id
Get a Pexels image by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123456",
    "width": 1920,
    "height": 1080,
    "url": "https://www.pexels.com/photo/...",
    "photographer": "John Doe",
    "photographerUrl": "https://www.pexels.com/@johndoe",
    "src": {
      "original": "https://images.pexels.com/photos/...",
      "large": "https://images.pexels.com/photos/...",
      "large2x": "https://images.pexels.com/photos/...",
      "medium": "https://images.pexels.com/photos/...",
      "small": "https://images.pexels.com/photos/...",
      "portrait": "https://images.pexels.com/photos/...",
      "landscape": "https://images.pexels.com/photos/...",
      "tiny": "https://images.pexels.com/photos/..."
    }
  },
  "error": null
}
```

### POST /api/v1/pexels/save-to-branding
Save a Pexels image to branding images

**Request Body:**
```json
{
  "pexelsId": "123456",
  "name": "Nature Background",
  "description": "Beautiful nature scene from Pexels",
  "category": "background",
  "tags": ["nature", "landscape", "pexels"],
  "imageSize": "large"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "name": "Nature Background",
    "description": "Beautiful nature scene from Pexels",
    "imageUrl": "/uploads/branding-images/pexels-123456-1234567890.jpg",
    "category": "background",
    "tags": ["nature", "landscape", "pexels"],
    "width": 1920,
    "height": 1080,
    "fileSize": 250000,
    "usageCount": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "error": null
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE"
  }
}
```

### Common Error Codes:
- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied

