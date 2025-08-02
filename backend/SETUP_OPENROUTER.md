# OpenRouter API Key Setup

## Quick Setup

### 1. Get OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Go to your API keys section
4. Create a new API key
5. Copy the API key

### 2. Configure the API Key

**Option A: Environment Variable (Recommended)**
```bash
# Set environment variable
export OPENROUTER_API_KEY=your_actual_api_key_here
```

**Option B: Create .env file**
Create a file named `.env` in the backend directory with:
```
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. Restart the Server
After setting the API key, restart the backend server:
```bash
python start.py
```

## Current Status

✅ **Application is working with sample data**
- The app will show sample test cases when API key is not configured
- You can still upload files and test the interface
- To get real AI-generated test cases, add your OpenRouter API key

## Features Available Without API Key

- ✅ Upload Swagger files
- ✅ View sample test cases
- ✅ Generate sample automation scripts
- ✅ Test the user interface
- ✅ All other features work normally

## Features Available With API Key

- ✅ Real AI-generated test cases
- ✅ Custom automation scripts
- ✅ Advanced test case generation
- ✅ Better script quality

## Test the Setup

1. Start the backend: `python start.py`
2. Start the frontend: `npm run dev` (in frontend directory)
3. Open http://localhost:3000
4. Try uploading a Swagger file
5. Generate test cases (will show sample data)
6. Add your API key and restart to get real AI-generated content 