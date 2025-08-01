# Scritodon Deployment Guide

## Frontend Deployment (Vercel)

The frontend is already deployed on Vercel, but you need to configure the backend URL.

### 1. Set Environment Variables in Vercel

In your Vercel dashboard, go to your project settings and add the following environment variable:

```
VITE_API_BASE_URL=https://your-backend-domain.com
```

Replace `https://your-backend-domain.com` with your actual backend URL.

### 2. Backend Deployment - Render (Recommended)

Render is the best option for deploying your FastAPI backend:

#### Step 1: Deploy to Render
1. Go to [Render](https://render.com/)
2. Sign in with your GitHub account
3. Click "New Web Service"
4. Choose "Deploy from GitHub repo"
5. Select your `Scriptodon-AI-Agnet` repository
6. **IMPORTANT**: Set the **Root Directory** to `backend`
7. Render will automatically detect it's a Python project

#### Step 2: Configure Build and Start Commands
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Step 3: Configure Environment Variables
In Render dashboard, go to the "Environment" tab and add:
```
DATABASE_URL=sqlite:///./scritodon.db
OPENROUTER_API_KEY=your_openrouter_api_key
```

#### Step 4: Deploy
Render will automatically:
- Install dependencies from `requirements.txt`
- Run the FastAPI app
- Give you a URL like `https://your-app-name.onrender.com`

### 3. Alternative Backend Deployment Options

#### Option A: Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Set the root directory to `backend`
4. Add environment variables
5. Deploy

#### Option B: DigitalOcean App Platform
1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Create a new App
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Configure environment variables
6. Deploy

### 4. Environment Variables for Backend

Make sure to set these environment variables in your backend deployment:

```bash
# Database
DATABASE_URL=sqlite:///./scritodon.db

# OpenRouter API (for AI features)
OPENROUTER_API_KEY=your_openrouter_api_key

# Jira Integration (optional)
JIRA_URL=your_jira_url
JIRA_USERNAME=your_jira_username
JIRA_API_TOKEN=your_jira_api_token

# CORS Settings
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### 5. Update Frontend Environment

Once your backend is deployed, update the `VITE_API_BASE_URL` in Vercel to point to your backend URL.

### 6. Test the Deployment

1. Visit your Vercel frontend URL
2. Try uploading a Swagger file
3. Check that the API calls are working

## Troubleshooting

### "Failed to fetch" Error
This usually means:
1. The backend is not deployed
2. The `VITE_API_BASE_URL` is not set correctly
3. CORS is not configured properly

### Render Build Issues
If Render fails to build:
1. Make sure the **Root Directory** is set to `backend`
2. Check that `requirements.txt` exists in the backend folder
3. Verify the start command uses `--host 0.0.0.0 --port $PORT`

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
- **Production**: Frontend on Vercel, backend on Render

The API configuration automatically detects the environment and uses the appropriate URL.

## Why Render is Recommended

1. **Excellent Python Support**: Render is designed for Python applications
2. **Free Tier**: Generous free tier for personal projects
3. **Simple Configuration**: Clear build and start command setup
4. **Environment Variables**: Easy to configure
5. **Automatic HTTPS**: SSL certificates included
6. **Reliable Deployments**: Stable and predictable deployments
7. **Good Documentation**: Excellent guides and support 