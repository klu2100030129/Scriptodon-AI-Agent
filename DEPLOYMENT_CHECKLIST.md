# Render Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. File Structure
- [x] `render.yaml` exists and is properly configured
- [x] `backend/requirements.txt` has all necessary dependencies
- [x] `backend/main.py` is the entry point
- [x] Static files directory exists
- [x] Uploads directory exists

### 2. Dependencies
- [x] FastAPI version: 0.95.2
- [x] Uvicorn version: 0.17.6
- [x] All required packages listed in requirements.txt
- [x] Python version: 3.11.0

### 3. Configuration
- [x] CORS properly configured for production
- [x] Database URL configured for SQLite
- [x] Environment variables set in render.yaml
- [x] Startup event for database initialization

### 4. API Endpoints
- [x] Health check endpoint: `/health`
- [x] Root endpoint: `/`
- [x] All router endpoints properly included
- [x] Static files serving configured

### 5. Database
- [x] SQLAlchemy models defined
- [x] Database initialization on startup
- [x] SQLite database path configured

### 6. Environment Variables
- [x] DATABASE_URL
- [x] OPENROUTER_API_KEY (sync: false)
- [x] PYTHON_VERSION
- [x] ENVIRONMENT

## 🚀 Deployment Steps

1. **Connect to Render**
   - Link your GitHub repository
   - Select the repository: `klu2100030129/Scriptodon-AI-Agent`

2. **Configure Service**
   - Service Type: Web Service
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**
   - DATABASE_URL: `sqlite:///./scritodon.db`
   - OPENROUTER_API_KEY: (set your API key)
   - ENVIRONMENT: `production`

4. **Deploy**
   - Click "Create Web Service"
   - Monitor the build logs
   - Check for any errors

## 🔍 Post-Deployment Verification

1. **Health Check**
   - Visit: `https://your-app-name.onrender.com/health`
   - Should return: `{"status": "healthy", "service": "Scriptodon API"}`

2. **API Documentation**
   - Visit: `https://your-app-name.onrender.com/docs`
   - Swagger UI should load properly

3. **Database**
   - Check if database file is created
   - Verify tables are initialized

4. **CORS**
   - Test frontend connection
   - Verify no CORS errors

## 🐛 Common Issues & Solutions

### Issue: Build fails
- **Solution**: Check requirements.txt for version conflicts
- **Solution**: Ensure all dependencies are compatible

### Issue: App crashes on startup
- **Solution**: Check logs for import errors
- **Solution**: Verify all modules are properly imported

### Issue: Database errors
- **Solution**: Ensure database directory is writable
- **Solution**: Check DATABASE_URL configuration

### Issue: CORS errors
- **Solution**: Update CORS origins in config.py
- **Solution**: Add your frontend domain to allowed origins

## 📝 Notes

- Render free tier has limitations on build time and runtime
- SQLite database will be ephemeral (resets on redeploy)
- Consider using PostgreSQL for production data persistence
- Monitor logs for any runtime errors
- Set up proper environment variables in Render dashboard 