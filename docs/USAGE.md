# TestGenie User Guide

## 🎯 Getting Started

This guide will walk you through TestGenie, a comprehensive test management platform with AI-powered test plan and test case generation capabilities.

## 📋 Prerequisites

Before starting, ensure you have:
- **Option 1 (Docker):** Docker Desktop and Docker Compose installed
- **Option 2 (Local):** Node.js 18+ and Python 3.8+ installed
- Web browser (Chrome, Firefox, Safari, or Edge recommended)
- Superwise AI Agent configured (see [Superwise Agent Setup Guide](./SUPERWISE_AGENT_SETUP_GUIDE.md))
- Basic understanding of software testing and quality assurance

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Start the services:**
   ```bash
   docker-compose up --build
   ```
   Or use the npm script:
   ```bash
   npm run docker:up:build
   ```

2. **Wait for services to be ready:**
   - Backend API should be running on port 5000
   - Frontend should be running on port 3000
   - Check logs for "Application startup complete"

3. **Access the application:**
   - Open your browser to http://localhost:3000
   - The TestGenie dashboard should load automatically

### Option 2: Local Development

1. **Clone and configure:**
   ```bash
   git clone <repository-url>
   cd testgenie
   cp .env.example .env
   # Edit .env file with your Superwise API credentials
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python run.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Access the application:**
   - Open your browser to http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/docs

**Note:** You can also use the startup scripts (`start-project.bat` or `start-project.ps1`) to automatically start both services.

### Step 2: Verify System Health

1. **Access the application:**
   - **Frontend Dashboard:** http://localhost:3000
   - **Backend API Health:** http://localhost:5000/api/health
   - **API Documentation:** http://localhost:5000/docs

2. **Check system logs:**
   - Review logs in the `logs/` directory
   - Check for any errors or warnings
   - Verify Superwise AI connection status

3. **Login:**
   - Use default credentials or create a new account
   - Default user: admin@superwise.ai / Admin123 (if configured)

## 📊 Dashboard Walkthrough

### Main Dashboard

The **Dashboard** provides an overview of all your test projects:

#### Project Overview
- **Project Cards:** Visual representation of all test projects
- **Project Status:** Health indicators showing project status
- **Quick Metrics:** Number of projects, total test cases, recent activity
- **Create Project:** Quick access to create new test projects

#### Creating a Project
1. **Click "Create Project"** button on the dashboard
2. **Fill in project details:**
   - Project Name
   - Description
   - Application Name
   - Version
3. **Submit** to create the project
4. **Navigate to project** by clicking on the project card

### Project Dashboard

Each project has its own dashboard with comprehensive test management features:

#### Project Sidebar Navigation
- **Project Dashboard:** Overview of project metrics and recent activity
- **Test Cases:** Manage test cases for the project
- **Test Plans:** Create and manage test execution plans
- **AI Assistant:** Access Superwise AI for test generation
Following can be future enhancement:
- **Test Suites:** Organize test cases into executable suites
- **Elements:** Define UI elements for test automation
- **Test Data:** Manage test data profiles and environments
- **Run Results:** View test execution results and history
- **Wiki:** Project documentation and knowledge base
- **Settings:** Project configuration and management
- **Test Coverage:** Percentage of features covered by tests
- **Test Execution Status:** Pass/fail rates and trends
- **Recent Activity:** Latest test runs and updates
- **Team Activity:** Contributions and changes

## 🧪 Test Cases Management

### Creating Test Cases

**Navigate to Test Cases:**
   - Click on "Test Cases" in the project sidebar
   - Click "Generate AI Test Cases" button
   - This will provide you AI generated test cases.

## 📋 Test Plans Management

### Creating Test Plans

**Navigate to Test Plans:**
   - Click on "Test Plans" in the project sidebar
   - Click "Generate AI Test Plan" button
    - This will provide you AI generated test plan.

### Using the AI Assistant

1. **Navigate to AI Assistant:**
   - Click "TestGenie AI Assistant" in the project sidebar

2. **Generate Test Artifacts:**
   - Provide context about the feature or requirement
   - Ask AI to get any details for project, test design
   - Review and refine AI-generated content

## 🚨 Troubleshooting

### Common Issues

#### Application Not Loading

1. **Check Docker Status:**
   - Ensure containers are running: `docker-compose ps`
   - Check logs: `docker-compose logs -f`

2. **Verify Ports:**
   - Frontend port 3000 should be available
   - Backend port 5000 should be available
   - Check for port conflicts: `netstat -ano | findstr :3000`

3. **Check Logs:**
   - Review `logs/app.log` for application errors
   - Review `logs/error.log` for error details
   - Check Docker logs: `docker-compose logs backend frontend`

4. **Restart Services:**
   ```bash
   docker-compose restart
   # Or
   docker-compose down && docker-compose up --build
   ```

#### Superwise AI Not Responding

1. **Check API Configuration:**
   - Verify `SUPERWISE_API_URL` in `.env` file
   - Verify `SUPERWISE_AGENT_ID` is set correctly
   - Check Superwise agent is active and has knowledge configured

2. **Check Network:**
   - Ensure internet connection for Superwise AI API calls
   - Verify firewall allows outbound HTTPS connections
   - Test API connectivity: `curl https://api.superwise.ai/v1/app-worker/health`

3. **Review Logs:**
   - Check for API timeout or authentication errors
   - Review backend logs for Superwise API errors
   - Verify request/response in browser developer tools

4. **Test API Connection:**
   - Use health check endpoint: http://localhost:5000/api/health
   - Check API documentation: http://localhost:5000/docs

#### Database Issues

1. **Check Database File:**
   - Verify `backend/testgenie.db` exists
   - Check file permissions (read/write access)
   - Ensure database is not locked by another process

2. **Reset Database:**
   ```bash
   # Backup existing database
   cp backend/testgenie.db backend/testgenie.db.backup
   # Delete and recreate (data will be lost)
   rm backend/testgenie.db
   # Restart services to recreate
   ```

3. **Database Connection:**
   - Check `DATABASE_URL` in `.env` file
   - Verify SQLite installation (for development)
   - For production, ensure PostgreSQL connection is correct

#### Test Case Not Saving

1. **Check Form Validation:**
   - Ensure all required fields are filled
   - Verify test steps are properly configured
   - Check for validation error messages

2. **Review Network Requests:**
   - Open browser developer tools (F12)
   - Check Network tab for API errors
   - Verify backend API is responding

3. **Check Backend Logs:**
   - Review `logs/app.log` for backend errors
   - Check for database constraint violations
   - Verify API endpoints are accessible

### Integration Capabilities

#### API Integration

1. **REST API:**
   - Access TestGenie API at http://localhost:5000/docs
   - Use API for automation and integration
   - Export/import test data

2. **External Tools:**
   - Integrate with CI/CD pipelines
   - Connect with test execution tools
   - Sync with project management tools

## 📞 Support and Resources

### Getting Help

1. **Documentation:**
   - This user guide
   - [Docker Setup Guide](./DOCKER_README.md)
   - [Superwise Agent Setup Guide](./SUPERWISE_AGENT_SETUP_GUIDE.md)
   - [Main README](../README.md)

2. **Application Resources:**
   - API Documentation: http://localhost:5000/docs
   - Application Logs: `logs/` directory
   - Health Check: http://localhost:5000/api/health

3. **Troubleshooting:**
   - Review logs for error details
   - Check Docker container status
   - Verify environment configuration

### Additional Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Docker Documentation:** https://docs.docker.com/
- **Superwise AI Documentation:** https://docs.superwise.ai/
