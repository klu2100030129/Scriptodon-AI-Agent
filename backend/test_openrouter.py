#!/usr/bin/env python3
"""
Test script for OpenRouter AI integration
"""

import asyncio
import os
from app.services.ai_service import AIService
from app.core.config import settings

async def test_openrouter():
    """Test the OpenRouter AI service"""
    print("🧪 Testing OpenRouter AI Integration...")
    
    # Check if API key is configured
    if not settings.OPENROUTER_API_KEY or settings.OPENROUTER_API_KEY == "your_openrouter_api_key_here":
        print("❌ OpenRouter API key not configured!")
        print("Please set OPENROUTER_API_KEY in your environment or .env file")
        return
    
    try:
        ai_service = AIService()
        
        # Test with a simple prompt
        test_content = """
        Login functionality:
        - Username field
        - Password field  
        - Login button
        - Remember me checkbox
        """
        
        print("📝 Testing test case generation...")
        test_cases = await ai_service.generate_test_cases(test_content, "user story")
        print(f"✅ Generated {len(test_cases)} test cases")
        
        print("📝 Testing script generation...")
        script = await ai_service.generate_automation_script(test_cases, "playwright_python")
        print("✅ Generated automation script")
        
        print("🎉 OpenRouter integration test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error testing OpenRouter: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_openrouter()) 