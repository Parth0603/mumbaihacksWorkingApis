#!/usr/bin/env python3
"""
Simple test script to verify signup functionality
"""
import requests
import json

# Test data
signup_data = {
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123",
    "name": "Test User",
    "age": 25,
    "risk_profile": "moderate"
}

def test_signup():
    """Test the signup endpoint"""
    try:
        # Test signup
        print("Testing signup endpoint...")
        response = requests.post(
            "http://localhost:8000/api/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Signup successful!")
            data = response.json()
            print(f"User ID: {data['user']['id']}")
            print(f"Token: {data['access_token'][:50]}...")
        else:
            print("❌ Signup failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_auth_endpoint():
    """Test the auth test endpoint"""
    try:
        print("\nTesting auth test endpoint...")
        response = requests.get("http://localhost:8000/api/auth/test")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Auth router is working!")
        else:
            print("❌ Auth router test failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("FinZen Signup Test")
    print("=" * 50)
    
    test_auth_endpoint()
    test_signup()
    
    print("\n" + "=" * 50)
    print("Test completed!")
