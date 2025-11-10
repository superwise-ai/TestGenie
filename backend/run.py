#!/usr/bin/env python3
"""
TestGenie Backend Server
Run this script to start the FastAPI backend server
"""

import uvicorn

if __name__ == "__main__":
    print("Starting TestGenie Backend Server...")
    print("API Documentation: http://localhost:5000/docs")
    print("Health Check: http://localhost:5000/api/health")
    print("Test Endpoint: http://localhost:5000/api/test")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,  # Enable auto-reload for development
        log_level="info",
    )
