# OpenRouter AI Integration Setup

## Overview
This project now uses OpenRouter AI instead of Google Gemini for generating test cases and automation scripts. OpenRouter provides access to multiple AI models including the powerful Qwen2.5-VL model.

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables
Edit the `env.txt` file in the backend directory:

```bash
# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_actual_api_key_here
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=Scritodon Test Automation Platform
```

### 3. Test the Integration
Run the test script to verify everything works:

```bash
cd Scritodon/backend
python test_openrouter.py
```

## API Configuration

### Model Used
- **Model**: `qwen/qwen2.5-vl-72b-instruct:free`
- **Features**: Text generation, vision capabilities
- **Cost**: Free tier available

### Headers Sent
```python
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Scritodon Test Automation Platform",
}
```

### Request Format
```python
data = {
    "model": "qwen/qwen2.5-vl-72b-instruct:free",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Your prompt here"
                }
            ]
        }
    ]
}
```

## Features

### Test Case Generation
- Generates comprehensive test cases from various input sources
- Supports user stories, requirements, and other documentation
- Returns structured JSON with test case details

### Automation Script Generation
- Creates Playwright Python scripts
- Supports multiple automation frameworks
- Generates executable test scripts

### Vision Capabilities
The model supports image analysis for:
- UI screenshots
- Wireframes
- Flow diagrams
- Test result screenshots

## Troubleshooting

### Common Issues

1. **API Key Not Configured**
   - Ensure `OPENROUTER_API_KEY` is set in your environment
   - Check the `env.txt` file

2. **Rate Limiting**
   - OpenRouter has rate limits on free tier
   - Consider upgrading for production use

3. **Model Availability**
   - The free model may have usage limits
   - Check OpenRouter status page for model availability

### Error Messages
- `OpenRouter API key not configured`: Set your API key
- `OpenRouter API request failed`: Check network connection and API key
- `Unexpected response format`: Contact OpenRouter support

## Migration from Gemini

The following changes were made:
- ✅ Replaced Google Generative AI with OpenRouter
- ✅ Updated configuration to use OpenRouter API key
- ✅ Modified AI service to use REST API calls
- ✅ Added support for vision capabilities
- ✅ Maintained existing functionality

## Next Steps

1. Set your OpenRouter API key
2. Test the integration with `python test_openrouter.py`
3. Start the backend server: `python main.py`
4. Access the API at `http://127.0.0.1:8000/docs` 