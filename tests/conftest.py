# TestGenie Test Configuration
# This file contains common test configuration and utilities

import os
import sys
from pathlib import Path

# Add the backend directory to Python path for imports
BACKEND_DIR = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

# Test configuration
API_BASE_URL = os.getenv("TEST_API_URL", "http://localhost:5000")
TEST_TIMEOUT = 30  # seconds

# Test user credentials
TEST_USER = {
    "email": "test@testgenie.com",
    "password": "TestPassword123!",
    "full_name": "Test User"
}

# Hardcoded user for simple auth tests - loaded from environment variables
HARDCODED_USER = {
    "email": os.getenv("TEST_USER_EMAIL", "admin@superwise.ai"),
    "password": os.getenv("TEST_USER_PASSWORD", "Admin123"),
    "full_name": os.getenv("TEST_USER_FULL_NAME", "Admin")
}

def get_test_headers(token=None):
    """Get headers for API requests"""
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers
