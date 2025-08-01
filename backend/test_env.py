#!/usr/bin/env python3
"""
Test script to check environment variable loading
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("🔍 Testing Environment Variables")
print("=" * 40)

# Check if .env file exists
env_file_path = ".env"
if os.path.exists(env_file_path):
    print(f"✅ .env file found at: {os.path.abspath(env_file_path)}")
else:
    print(f"❌ .env file not found at: {os.path.abspath(env_file_path)}")

# Check OpenRouter API key
api_key = os.getenv("OPENROUTER_API_KEY")
if api_key:
    if api_key == "your_openrouter_api_key_here":
        print("⚠️  OPENROUTER_API_KEY is set to placeholder value")
    else:
        print(f"✅ OPENROUTER_API_KEY is set (length: {len(api_key)})")
        print(f"   First 10 chars: {api_key[:10]}...")
else:
    print("❌ OPENROUTER_API_KEY is not set")

# Check other environment variables
site_url = os.getenv("OPENROUTER_SITE_URL", "http://localhost:3000")
site_name = os.getenv("OPENROUTER_SITE_NAME", "Scriptodon Test Automation Platform")

print(f"✅ OPENROUTER_SITE_URL: {site_url}")
print(f"✅ OPENROUTER_SITE_NAME: {site_name}")

print("\n" + "=" * 40)
if api_key and api_key != "your_openrouter_api_key_here":
    print("🎉 Environment is properly configured!")
else:
    print("⚠️  Please check your .env file configuration") 