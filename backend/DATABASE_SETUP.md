# Database Setup Guide

This guide will help you set up MongoDB for The Modern Quill backend.

## Prerequisites

- Node.js and npm installed
- MongoDB installed locally OR MongoDB Atlas account

## Option 1: Local MongoDB Setup

### 1. Install MongoDB

**Windows:**
- Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Run the installer and follow the setup wizard
- MongoDB will typically run on `mongodb://localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

Or check the service:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongodb
```

### 3. Create .env File

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/themodernquill
```

## Option 2: MongoDB Atlas Setup (Cloud)

### 1. Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier available)

### 2. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 3. Configure Network Access

1. Go to "Network Access" in Atlas
2. Click "Add IP Address"
3. Add `0.0.0.0/0` for development (or your specific IP for production)

### 4. Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create a username and password
4. Save the credentials

### 5. Update .env File

Replace the connection string in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/themodernquill
```

Replace:
- `username` with your database username
- `password` with your database password
- `cluster.mongodb.net` with your cluster URL
- `themodernquill` with your desired database name

## Environment Variables

Create a `.env` file in the `backend` directory with:

```env
# Server Configuration
PORT=4000
NODE_ENV=development
API_VERSION=v1

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/themodernquill
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/themodernquill

MONGODB_DB_NAME=themodernquill

# Pexels API (optional, for image search)
PEXELS_API_KEY=your_pexels_api_key_here
```

## Testing the Connection

1. Start the backend server:
```bash
cd backend
npm start
# or with nodemon
nodemon
```

2. You should see:
```
✅ Connected to MongoDB
📊 Database: themodernquill
🔗 Host: localhost:27017
```

## Troubleshooting

### Connection Refused

**Error:** `MongoServerSelectionError: connect ECONNREFUSED`

**Solutions:**
- Make sure MongoDB is running: `mongosh --eval "db.version()"`
- Check if the port is correct (default: 27017)
- Verify firewall settings

### Authentication Failed

**Error:** `Authentication failed`

**Solutions:**
- Check username and password in connection string
- Verify database user has proper permissions
- For Atlas: Check network access settings

### Timeout Error

**Error:** `Server selection timed out`

**Solutions:**
- Check internet connection (for Atlas)
- Verify network access in Atlas dashboard
- Check if MongoDB service is running

### Duplicate Index Warning

If you see duplicate index warnings, they've been fixed in the latest code. Restart the server.

## Next Steps

Once connected, you can:

1. Test the API endpoints using Swagger UI: `http://localhost:4000/api-docs`
2. Create posts, categories, and users through the API
3. Check the database using MongoDB Compass or `mongosh`

## Useful Commands

```bash
# Connect to MongoDB shell
mongosh

# Or for older versions
mongo

# List databases
show dbs

# Use database
use themodernquill

# Show collections
show collections

# Query documents
db.posts.find().pretty()
db.categories.find().pretty()
db.users.find().pretty()
```

