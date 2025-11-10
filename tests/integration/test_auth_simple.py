# TestGenie Simple Authentication Tests
# Run with: python -m pytest tests/integration/test_auth_simple.py

import pytest
import requests
import json
import sys
from pathlib import Path

# Add the tests directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from conftest import API_BASE_URL, HARDCODED_USER, get_test_headers

class TestSimpleAuth:
    """Simple authentication tests using hardcoded credentials"""
    
    def test_health_check(self):
        """Test the health check endpoint"""
        print("🔍 Testing health check endpoint...")
        try:
            response = requests.get(f"{API_BASE_URL}/api/health", timeout=10)
            assert response.status_code == 200
            data = response.json()
            print(f"✅ Health check passed: {data}")
        except Exception as e:
            pytest.fail(f"Health check failed: {e}")

    def test_login_success(self):
        """Test successful login with hardcoded credentials"""
        print("🔐 Testing successful login...")
        try:
            response = requests.post(
                f"{API_BASE_URL}/api/auth/login",
                json={
                    "email": HARDCODED_USER["email"],
                    "password": HARDCODED_USER["password"]
                },
                headers=get_test_headers(),
                timeout=10
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "access_token" in data
            assert "token_type" in data
            print(f"✅ Login successful: {data}")
            return data["access_token"]
        except Exception as e:
            pytest.fail(f"Login failed: {e}")

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        print("🚫 Testing login with invalid credentials...")
        try:
            response = requests.post(
                f"{API_BASE_URL}/api/auth/login",
                json={
                    "email": "invalid@example.com",
                    "password": "wrongpassword"
                },
                headers=get_test_headers(),
                timeout=10
            )
            
            assert response.status_code == 401
            print("✅ Invalid credentials correctly rejected")
        except Exception as e:
            pytest.fail(f"Invalid credentials test failed: {e}")

    def test_protected_endpoint_without_token(self):
        """Test accessing protected endpoint without token"""
        print("🔒 Testing protected endpoint without token...")
        try:
            response = requests.get(f"{API_BASE_URL}/api/projects", timeout=10)
            assert response.status_code == 401
            print("✅ Protected endpoint correctly requires authentication")
        except Exception as e:
            pytest.fail(f"Protected endpoint test failed: {e}")

    def test_protected_endpoint_with_token(self, auth_token):
        """Test accessing protected endpoint with valid token"""
        if not auth_token:
            pytest.skip("No auth token available")
            
        print("🔓 Testing protected endpoint with valid token...")
        try:
            headers = get_test_headers(auth_token)
            response = requests.get(f"{API_BASE_URL}/api/projects", headers=headers, timeout=10)
            assert response.status_code == 200
            print("✅ Protected endpoint accessible with valid token")
        except Exception as e:
            pytest.fail(f"Protected endpoint with token test failed: {e}")

    def test_user_profile(self, auth_token):
        """Test getting user profile"""
        if not auth_token:
            pytest.skip("No auth token available")
            
        print("👤 Testing user profile endpoint...")
        try:
            headers = get_test_headers(auth_token)
            response = requests.get(f"{API_BASE_URL}/api/auth/me", headers=headers, timeout=10)
            assert response.status_code == 200
            data = response.json()
            assert "email" in data
            assert "full_name" in data
            print(f"✅ User profile retrieved: {data}")
        except Exception as e:
            pytest.fail(f"User profile test failed: {e}")

    @pytest.fixture
    def auth_token(self):
        """Fixture to get authentication token"""
        try:
            response = requests.post(
                f"{API_BASE_URL}/api/auth/login",
                json={
                    "email": HARDCODED_USER["email"],
                    "password": HARDCODED_USER["password"]
                },
                headers=get_test_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["access_token"]
            else:
                pytest.fail("Failed to get auth token")
        except Exception as e:
            pytest.fail(f"Auth token fixture failed: {e}")

if __name__ == "__main__":
    # Run tests if executed directly
    pytest.main([__file__, "-v"])
