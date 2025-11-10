# TestGenie Integration Tests
# Run with: python -m pytest tests/integration/

import pytest
import requests
import json
import time
import sys
from pathlib import Path

# Add the tests directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from conftest import API_BASE_URL, TEST_USER, HARDCODED_USER, get_test_headers

class TestIntegration:
    """Integration tests for TestGenie API"""
    
    def test_health_check(self):
        """Test the health check endpoint"""
        print("🔍 Testing health check endpoint...")
        try:
            response = requests.get(f"{API_BASE_URL}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health check passed: {data}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

    def test_simple_auth_login(self):
        """Test simple authentication with hardcoded credentials"""
        print("🔐 Testing simple authentication...")
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
                token = data.get("access_token")
                print(f"✅ Simple auth login successful: {data}")
                return token
            else:
                print(f"❌ Simple auth login failed: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"❌ Simple auth login error: {e}")
            return None

    def test_projects_endpoints(self, auth_token):
        """Test project-related endpoints"""
        if not auth_token:
            pytest.skip("No auth token available")
            
        print("📁 Testing projects endpoints...")
        headers = get_test_headers(auth_token)
        
        # Test get projects
        try:
            response = requests.get(f"{API_BASE_URL}/api/projects", headers=headers, timeout=10)
            if response.status_code == 200:
                projects = response.json()
                print(f"✅ Get projects successful: {len(projects)} projects found")
                
                # Test create project
                new_project = {
                    "name": "Test Project",
                    "description": "Integration test project",
                    "application_name": "TestApp",
                    "version": "1.0.0"
                }
                
                create_response = requests.post(
                    f"{API_BASE_URL}/api/projects",
                    json=new_project,
                    headers=headers,
                    timeout=10
                )
                
                if create_response.status_code == 200:
                    created_project = create_response.json()
                    project_id = created_project["id"]
                    print(f"✅ Create project successful: Project ID {project_id}")
                    
                    # Test get specific project
                    get_response = requests.get(
                        f"{API_BASE_URL}/api/projects/{project_id}",
                        headers=headers,
                        timeout=10
                    )
                    
                    if get_response.status_code == 200:
                        print(f"✅ Get specific project successful")
                        
                        # Test update project
                        update_data = {"name": "Updated Test Project"}
                        update_response = requests.put(
                            f"{API_BASE_URL}/api/projects/{project_id}",
                            json=update_data,
                            headers=headers,
                            timeout=10
                        )
                        
                        if update_response.status_code == 200:
                            print(f"✅ Update project successful")
                            
                            # Test delete project
                            delete_response = requests.delete(
                                f"{API_BASE_URL}/api/projects/{project_id}",
                                headers=headers,
                                timeout=10
                            )
                            
                            if delete_response.status_code == 200:
                                print(f"✅ Delete project successful")
                                return True
                            else:
                                print(f"❌ Delete project failed: {delete_response.status_code}")
                        else:
                            print(f"❌ Update project failed: {update_response.status_code}")
                    else:
                        print(f"❌ Get specific project failed: {get_response.status_code}")
                else:
                    print(f"❌ Create project failed: {create_response.status_code}")
            else:
                print(f"❌ Get projects failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Projects endpoints error: {e}")
        
        return False

    def test_full_integration_flow(self):
        """Test complete integration flow"""
        print("🚀 Starting full integration test...")
        
        # Step 1: Health check
        if not self.test_health_check():
            pytest.fail("Health check failed")
        
        # Step 2: Authentication
        token = self.test_simple_auth_login()
        if not token:
            pytest.fail("Authentication failed")
        
        # Step 3: Test projects
        if not self.test_projects_endpoints(token):
            pytest.fail("Projects endpoints failed")
        
        print("✅ Full integration test completed successfully!")

if __name__ == "__main__":
    # Run tests if executed directly
    pytest.main([__file__, "-v"])
