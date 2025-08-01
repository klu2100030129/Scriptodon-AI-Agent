# Scritodon Deployment Guide

## Frontend Deployment (Vercel)

The frontend is already deployed on Vercel, but you need to configure the backend URL.

### 1. Set Environment Variables in Vercel

In your Vercel dashboard, go to your project settings and add the following environment variable:

```
VITE_API_BASE_URL=https://your-backend-domain.com
```

Replace `https://your-backend-domain.com` with your actual backend URL.

### 2. Backend Deployment Options

You have several options for deploying the backend:

#### Option A: Deploy to Railway
1. Go to [Railway](https://railway.app/)
2. Create a new project
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Add environment variables from `backend/env.example`
6. Deploy

#### Option B: Deploy to Render
1. Go to [Render](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables from `backend/env.example`

#### Option C: Deploy to Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Set the root directory to `backend`
4. Add environment variables
5. Deploy

### 3. Environment Variables for Backend

Make sure to set these environment variables in your backend deployment:

```bash
# Database
DATABASE_URL=your_database_url

# OpenRouter API (for AI features)
OPENROUTER_API_KEY=your_openrouter_api_key

# Jira Integration (optional)
JIRA_URL=your_jira_url
JIRA_USERNAME=your_jira_username
JIRA_API_TOKEN=your_jira_api_token

# CORS Settings
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### 4. Update Frontend Environment

Once your backend is deployed, update the `VITE_API_BASE_URL` in Vercel to point to your backend URL.

### 5. Test the Deployment

1. Visit your Vercel frontend URL
2. Try uploading a Swagger file
3. Check that the API calls are working

## Troubleshooting

### "Failed to fetch" Error
This usually means:
1. The backend is not deployed
2. The `VITE_API_BASE_URL` is not set correctly
3. CORS is not configured properly

### CORS Issues
Make sure your backend has the correct CORS origins configured:
```python
CORS_ORIGINS = [
    "https://your-frontend-domain.vercel.app",
    "http://localhost:3000"  # for development
]
```

### Database Issues
If using a cloud database, make sure:
1. The database is accessible from your backend
2. The connection string is correct
3. The database has been initialized

## Development vs Production

- **Development**: Frontend runs on `localhost:3000`, backend on `localhost:8000`
- **Production**: Frontend on Vercel, backend on your chosen platform

The API configuration automatically detects the environment and uses the appropriate URL. 