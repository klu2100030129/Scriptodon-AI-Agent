#!/usr/bin/env python3
"""
Test script for OpenRouter AI integration
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_openrouter_api():
    """Test OpenRouter API connection"""
    
    # Get API key from environment
    api_key = os.getenv("OPENROUTER_API_KEY")
    
    if not api_key or api_key == "your_openrouter_api_key_here":
        print("❌ OpenRouter API key not configured")
        print("Please set OPENROUTER_API_KEY environment variable")
        print("Visit https://openrouter.ai to get your API key")
        return False
    
    print("🔑 API Key found, testing connection...")
    
    # Test request
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Scritodon Test Automation Platform",
    }
    
    data = {
        "model": "qwen/qwen-2.5-72b-instruct:free",
        "messages": [
            {
                "role": "user",
                "content": "Hello! Please respond with 'OpenRouter API is working correctly'"
            }
        ]
    }
    
    try:
        print("📡 Sending test request to OpenRouter...")
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(data)
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print("✅ OpenRouter API is working correctly!")
            print(f"📝 Response: {content}")
            return True
        else:
            print(f"❌ API request failed with status {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing OpenRouter API: {str(e)}")
        return False

def test_sample_generation():
    """Test sample generation without API key"""
    print("\n🧪 Testing sample generation...")
    
    from app.services.ai_service import AIService
    
    # Create AI service with no API key
    ai_service = AIService()
    ai_service.api_key = None
    
    try:
        # Test test case generation
        test_cases = ai_service._get_sample_test_cases("Sample input", "swagger")
        print(f"✅ Generated {len(test_cases)} sample test cases")
        
        # Test script generation
        script = ai_service._get_sample_script(test_cases, "playwright_python")
        print("✅ Generated sample automation script")
        
        return True
    except Exception as e:
        print(f"❌ Error in sample generation: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Testing OpenRouter AI Integration")
    print("=" * 50)
    
    # Test API connection
    api_working = test_openrouter_api()
    
    # Test sample generation
    sample_working = test_sample_generation()
    
    print("\n" + "=" * 50)
    if api_working:
        print("🎉 OpenRouter API is ready to use!")
        print("You can now generate real AI-powered test cases and scripts.")
    elif sample_working:
        print("✅ Application is working with sample data")
        print("To get real AI-generated content, configure your OpenRouter API key")
    else:
        print("❌ There are issues with the setup")
        print("Please check the configuration and try again") 