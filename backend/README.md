# The Modern Quill Backend API

A RESTful API backend for The Modern Quill blog platform, built with Node.js, Express, and MongoDB.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Database connection
│   │   └── constants.js  # Application constants
│   ├── controllers/     # Route controllers
│   ├── errors/          # Error handling
│   │   ├── AppError.js
│   │   └── errorHandler.js
│   ├── middleware/      # Custom middleware
│   │   ├── logger.js
│   │   ├── validator.js
│   │   └── responseFormatter.js
│   ├── models/         # Mongoose models
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validators/      # Input validation schemas
│   ├── app.js          # Express app setup
│   └── server.js        # Server entry point
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/themodernquill
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## 📚 API Endpoints

### Health Check
- `GET /api/v1/health` - Check API health status

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests (when implemented)

### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Define database schemas
- **Routes**: Define API endpoints
- **Middleware**: Request processing (logging, validation, etc.)
- **Utils**: Reusable utility functions

## 🔒 Best Practices

- All routes use async/await with error handling
- Standardized API response format
- Input validation on all endpoints
- Centralized error handling
- Environment-based configuration
- Graceful shutdown handling

## 📝 Environment Variables

See `.env.example` for all available environment variables.

## 🤝 Contributing

Follow the existing code structure and patterns when adding new features.

