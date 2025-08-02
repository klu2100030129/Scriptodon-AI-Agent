#!/usr/bin/env python3
import requests
import json

def test_backend_connection():
    base_url = "http://localhost:8000"
    
    print("Testing Scriptodon Backend Connection...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Root endpoint working")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test input sources endpoint
    try:
        response = requests.get(f"{base_url}/api/input-sources/")
        if response.status_code == 200:
            print("✅ Input sources endpoint working")
            print(f"Found {len(response.json())} input sources")
        else:
            print(f"❌ Input sources endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Input sources endpoint error: {e}")
    
    print("\n" + "=" * 50)
    print("Backend connection test completed!")

if __name__ == "__main__":
    test_backend_connection() 