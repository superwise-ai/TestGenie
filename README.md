<div align="left">



<a href="https://superwise.ai/" target="_blank">
<img src="https://superwise.ai/wp-content/uploads/2024/05/Superwise-logo.svg" alt="SUPERWISE® Logo" width="350"/></a>

**Powered by SUPERWISE® — Leading Agentic Governance & Operations Solutions**

[![Powered by SUPERWISE®](https://img.shields.io/badge/Powered%20by-SUPERWISE®-0052CC?style=for-the-badge&logo=superuser)](https://superwise.ai)
[![TestGenie AI](https://img.shields.io/badge/TestGenie%20AI-Management-00A86B?style=for-the-badge&logo=testgenie)](https://superwise.ai)
[![Enterprise Ready](https://img.shields.io/badge/Enterprise-Ready-gold?style=for-the-badge&logo=enterprise)](https://superwise.ai)

</div>

##  📊 TestGenie - Test Management Platform

**TestGenie** is an enterprise-ready test management platform designed to streamline software testing workflows and enhance quality assurance operations. This system offers comprehensive test management capabilities with AI-powered assistance to accelerate test creation and optimization.

### Key Value Propositions

- **Comprehensive Test Management**: End-to-end solution covering test case creation, test plan management, test execution tracking, and results analysis within a unified platform
- **AI-Enhanced Productivity**: Integrated AI assistant (powered by SUPERWISE®) provides intelligent test case suggestions, automation recommendations, and smart workflow optimizations

### Target Market

TestGenie serves quality assurance teams, software testing professionals, and development organizations seeking to:
- Centralize and standardize test management processes
- Improve test coverage and quality through AI-assisted test creation
- Reduce manual effort in test planning and execution tracking
- Enhance collaboration between QA teams and development stakeholders
- Scale testing operations efficiently across multiple projects

### Business Impact

By automating test management workflows and leveraging AI capabilities, TestGenie enables organizations to:
- **Reduce Time-to-Market**: Accelerate test planning and execution cycles by up to 40% through AI-powered automation
- **Improve Quality Coverage**: Systematic test case organization and comprehensive tracking ensure thorough test coverage across all project components
- **Enhance Team Efficiency**: Centralized platform eliminates tool fragmentation and reduces context switching, improving team productivity
- **Enable Data-Driven Decisions**: Comprehensive analytics and reporting provide insights into test execution trends and quality metrics
- **Lower Operational Costs**: Self-hosted deployment options and efficient resource utilization reduce licensing and infrastructure expenses

## 🏢 **Ready for Business?**

**Transform your business operations with Superwise AI**: [Get Started with Superwise](https://docs.superwise.ai/docs/introduction-to-superwise) - Enterprise-grade AI governance, risk & compliance solutions for software testing and other businesses.


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn
- pip (Python package installer)
- Docker Desktop (for Docker setup)

### 1. Install Dependencies

**Clone, configure, and run:**
   ```bash
   git clone <repository-url>
   cd testgenie
   cp .env.example .env
   # Edit .env file with your configuration
   ```

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start the Development Servers

**Option 1: Quick Start with Docker the entire application: (Recommended)**
```bash
# docker-compose directly
docker-compose up --build

# Run in background
docker-compose up --build -d

# Or build and start all services
npm run docker:up:build
```

**Option 2: Use the provided startup scripts (Recommended)**

**Windows:**
```bash
# Start both frontend and backend automatically
start-project.bat
```

**PowerShell:**
```bash
# Start both frontend and backend automatically
.\start-project.ps1
```

**Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/docs

### Docker Commands

```bash
# Build all images
npm run docker:build

# Start services
npm run docker:up

# Build and start
npm run docker:up:build

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Restart services
npm run docker:restart

# Clean up everything
npm run docker:clean
```

### Docker Benefits
- **Consistent Environment**: Same setup across all machines
- **Easy Deployment**: One command to start everything
- **No Local Dependencies**: No need to install Node.js or Python locally
- **Isolation**: No conflicts with local installations
- **Production Ready**: Optimized for production deployment
- **Log Persistence**: Logs are mounted as volumes for easy access and persistence

For detailed Docker documentation, see [DOCKER_README.md](./docs/DOCKER_README.md).

## ✨ Features

### 🏠 **Dashboard & Project Management**
- **Visual Dashboard**: Comprehensive project overview with real-time metrics and insights
- **Project Creation**: Create and manage multiple test projects with ease
- **Project Navigation**: Intuitive switching between projects and seamless workspace organization
- **Project Metrics**: Track project health, test coverage, and execution statistics at a glance

### 🤖 **AI-Powered Test Plans Creation**
- **Intelligent Planning**: AI-assisted test plan generation based on project requirements and scope
- **Automated Test Strategy**: Smart recommendations for test coverage and execution strategy
- **Optimized Planning**: AI-driven optimization of test plan structure and resource allocation

### 🧪 **AI-Powered Test Cases Creation**
- **Automated Test Case Generation**: AI-powered creation of comprehensive test cases from requirements
- **Smart Test Steps**: Intelligent generation of detailed test steps and validation criteria
- **Test Case Optimization**: AI-enhanced suggestions for improving test case quality and coverage
- **Rapid Test Development**: Accelerate test case creation with AI-powered automation

### 🎯 **TestGenie AI Assistance**
- **Intelligent Test Automation**: AI assistant powered by SUPERWISE® for advanced test automation guidance
- **Smart Recommendations**: AI-driven suggestions for test improvements, coverage gaps, and optimization
- **Contextual Assistance**: Real-time AI support throughout the test management lifecycle
- **Workflow Optimization**: AI-powered insights to streamline testing processes and enhance productivity

## 🛡️ Guardrails & Telemetry

### **Project Data Guardrails**

The Superwise agent provides comprehensive data guardrails on project data to ensure data safety:

- **Data Isolation**: Each project maintains complete data isolation, preventing cross-project data leakage and ensuring secure multi-tenant operations through Superwise agent monitoring
- **Data Validation**: Superwise agent enforces strict input validation and sanitization for project data to prevent malicious data injection and ensure data quality

### **Telemetry & Monitoring**

TestGenie includes comprehensive telemetry and monitoring capabilities to provide visibility into system performance, usage patterns, and operational health:

- **Application Logging**: Centralized logging system captures all application events, errors, and user activities
  - **Structured Logging**: JSON-formatted logs with timestamps, log levels, and contextual information
  - **Dual Log Files**: Separate logs for general application events (`app.log`) and errors (`error.log`)
  - **Daily Rotation**: Automatic log rotation with configurable retention periods (default: 1 day)
  - **Log Levels**: Configurable logging levels (DEBUG, INFO, WARNING, ERROR, CRITICAL) for granular control

### **Where to Find Telemetry**

Access telemetry and monitoring data through the following locations:

1. **Application Logs**:
   - **Location**: `logs/` directory in the project root
   - **Files**: 
     - `logs/app.log` - All application logs (INFO level and above)
     - `logs/error.log` - Error logs only (ERROR level and above)
   - **Format**: Rotated daily with date suffixes (e.g., `app.log.2025-10-30`)
   - **Docker**: Logs are persisted via Docker volumes at `/app/logs` inside containers

2. **Console Output**:
   - Real-time logging output in the terminal/console where the application is running
   - Useful for immediate debugging and development
   - Configurable via `ENABLE_CONSOLE_LOGGING` environment variable

3. **API Documentation**:
   - Health check endpoints available at `/health` and `/docs`
   - OpenAPI/Swagger documentation at `http://localhost:5000/docs` (development)
   - Includes API performance metrics and response times

4. **Environment Configuration**:
   - Configure logging behavior via environment variables in `.env` file:
     - `LOG_LEVEL`: Set logging verbosity (DEBUG, INFO, WARNING, ERROR, CRITICAL)
     - `LOG_DIR`: Specify log directory path
     - `ENABLE_FILE_LOGGING`: Toggle file logging (true/false)
     - `ENABLE_CONSOLE_LOGGING`: Toggle console logging (true/false)

5. **Docker Logs**:
   - Access container logs using: `docker-compose logs` or `npm run docker:logs`
   - View specific service logs: `docker-compose logs backend` or `docker-compose logs frontend`
   - Follow logs in real-time: `docker-compose logs -f`

6. **Backend Logging Configuration**:
   - Logging configuration file: `backend/logging_config.py`
   - Customizable log formats, handlers, and rotation policies
   - Integration with external logging services (configurable)

## 🏗️ Project Structure

```
TestGenie/
├── frontend/                          # Next.js frontend application
│   ├── src/
│   │   ├── app/                       # Next.js App Router directory
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Root layout component
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── components/           # Reusable React components
│   │   │   │   ├── CreateProjectModal.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── LoginModal.tsx
│   │   │   │   ├── ProjectSidebar.tsx
│   │   │   │   └── SignupModal.tsx
│   │   │   └── dashboard/            # Dashboard pages
│   │   │       ├── page.tsx         # Main dashboard
│   │   │       └── project/[id]/    # Dynamic project routes
│   │   │           ├── page.tsx     # Project dashboard
│   │   │           ├── ai-assistant/ # AI assistant page
│   │   │           ├── elements/    # Element management
│   │   │           │   ├── page.tsx
│   │   │           │   ├── create/
│   │   │           │   └── edit/
│   │   │           ├── test-cases/  # Test case management
│   │   │           │   ├── page.tsx
│   │   │           │   ├── create/
│   │   │           │   └── edit/
│   │   │           ├── test-data/   # Test data management
│   │   │           │   ├── page.tsx
│   │   │           │   ├── create/
│   │   │           │   └── environments/ # Test environments
│   │   │           ├── test-plans/  # Test plan management
│   │   │           │   ├── page.tsx
│   │   │           │   ├── create/
│   │   │           │   └── edit/
│   │   │           ├── test-suites/ # Test suite management
│   │   │           │   ├── page.tsx
│   │   │           │   ├── create/
│   │   │           │   └── edit/
│   │   │           ├── run-results/ # Test execution results
│   │   │           ├── settings/    # Project settings
│   │   │           └── wiki/        # Project documentation/wiki
│   │   ├── config.ts                 # Frontend configuration
│   │   └── services/                 # API service layer
│   │       └── api.ts                # API client
│   ├── public/                       # Static assets
│   │   ├── company-icon.svg
│   │   ├── favicon.ico
│   │   └── superwise_logo.svg
│   ├── Dockerfile                    # Frontend Docker configuration
│   ├── .dockerignore                 # Frontend Docker ignore file
│   ├── eslint.config.mjs             # ESLint configuration
│   ├── next.config.ts                # Next.js configuration
│   ├── next-env.d.ts                 # Next.js type definitions
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   └── README.md                     # Frontend documentation
├── backend/                           # Python FastAPI backend
│   ├── main.py                       # FastAPI application entry point
│   ├── database.py                   # Database configuration & connection
│   ├── models.py                     # SQLAlchemy database models
│   ├── schemas.py                    # Pydantic schemas for validation
│   ├── crud.py                       # Database CRUD operations
│   ├── auth.py                       # Authentication & authorization
│   ├── config.py                     # Application configuration
│   ├── logging_config.py             # Logging configuration
│   ├── run.py                        # Development server runner
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Backend Docker configuration
│   ├── .dockerignore                 # Backend Docker ignore file
│   ├── start.bat                     # Windows backend startup script
│   ├── testgenie.db                  # SQLite database (development)
│   └── README.md                     # Backend documentation
├── docs/                              # Documentation directory
│   ├── DOCKER_README.md              # Docker setup documentation
│   ├── SUPERWISE_AGENT_SETUP_GUIDE.md # Superwise AI integration guide
│   └── USAGE.md                      # Usage documentation
├── helm/                              # Kubernetes Helm charts
│   ├── Chart.yaml                    # Helm chart metadata
│   ├── values.yaml                   # Helm chart values
│   ├── README.md                     # Helm chart documentation
│   └── templates/                    # Kubernetes manifests
│       ├── _helpers.tpl              # Helm template helpers
│       ├── deployment.yaml           # Deployment manifest
│       ├── ingress.yaml              # Ingress manifest
│       ├── knative-service.yaml     # Knative service manifest
│       ├── service.yaml              # Service manifest
│       └── serviceaccount.yaml       # Service account manifest
├── tests/                             # Test suite
│   ├── conftest.py                   # Pytest configuration & fixtures
│   ├── README.md                     # Testing documentation
│   └── integration/                  # Integration tests
│       ├── test_auth_simple.py       # Authentication tests
│       └── test_integration.py       # Integration test suite
├── logs/                              # Application logs directory
│   ├── app.log                       # Main application logs (daily rotation)
│   └── error.log                     # Error logs (daily rotation)
├── docker-compose.yml                 # Docker Compose configuration
├── .dockerignore                     # Root Docker ignore file
├── .pre-commit-config.yaml           # Pre-commit hooks configuration
├── DEPLOYMENT.md                     # Deployment documentation
├── DOCKER.md                         # Docker documentation (legacy)
├── LICENSE                           # MIT License
├── next.config.ts                    # Root Next.js configuration
├── package.json                      # Root package.json with Docker scripts
├── pyproject.toml                    # Python tool configuration (black, isort, mypy, pytest)
├── pytest.ini                        # pytest configuration
├── QUICKSTART.md                     # Quick start guide
├── setup.cfg                         # flake8 configuration
├── start-project.bat                 # Windows startup script (starts both frontend & backend)
├── start-project.ps1                 # PowerShell startup script (starts both frontend & backend)
└── README.md                         # Main documentation
```

## 🔧 Technology Stack

### **Frontend Architecture**
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first responsive design
- **API Integration**: RESTful API communication with Python backend

### **Backend Architecture**
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy ORM**: Database abstraction layer
- **JWT Authentication**: Secure token-based authentication
- **Pydantic**: Data validation and serialization
- **SQLite/PostgreSQL**: Database support for development and production
- **Logging System**: Centralized logging with daily file rotation
  - **File Logging**: Separate logs for application and errors
  - **Daily Rotation**: Automatic log rotation at midnight (30 days retention)
  - **Console Logging**: Real-time console output with configurable levels
  - **Environment Configuration**: Configurable via environment variables

### **State Management**
- **React Hooks**: Modern state management with useState and useEffect
- **API Client**: Centralized API communication layer
- **JWT Tokens**: Secure authentication state management
- **Local Storage**: Fallback data persistence

### **UI/UX Features**
- **Drag & Drop**: Reorder test steps with intuitive drag-and-drop
- **Search & Filter**: Advanced search and filtering capabilities
- **Bulk Actions**: Select and manage multiple items
- **Empty States**: Helpful empty state designs with clear CTAs

## 🚀 Getting Started with TestGenie

### Option 1: Docker (Recommended - Easiest)

1. **Install Docker Desktop** and ensure it's running
2. **Clone the repository**
3. **Start the application**: `npm run docker:up:build`
4. **Open your browser**: Navigate to http://localhost:3000
5. **Create your first project**: Click "Create Project" on the dashboard

### Option 2: Local Development

1. **Clone the repository**
2. **Install dependencies**: `npm install` and `npm run install:frontend`
3. **Start development server**: `npm run dev:frontend` and `npm run start:backend`
4. **Open your browser**: Navigate to http://localhost:3000
5. **Create your first project**: Click "Create Project" on the dashboard

## 🔮 Future Enhancements

- **Database Migration**: Easy migration from SQLite to PostgreSQL
- **Advanced Authentication**: OAuth2, SSO integration
- **Team Collaboration**: Multi-user project access and permissions
- **Test Execution**: Automated test execution capabilities
- **Reporting**: Advanced test reporting and analytics
- **Real-time Updates**: WebSocket support for live collaboration
- **Email Notifications**: Automated email notifications for test results

## 🔧 Configuration

### **Environment Variables**

The application uses environment variables for configuration. Create a `.env` file in the root directory:

**Database Configuration:**
- `DATABASE_URL`: Database connection string (default: `sqlite:///./backend/testgenie.db`)

**Security Configuration:**
- `SECRET_KEY`: Secret key for JWT token signing (change in production!)
- `ALGORITHM`: JWT algorithm (default: `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: `30`)

**CORS Configuration:**
- `FRONTEND_URL`: Frontend URL for CORS (default: `http://localhost:3000`)

**Logging Configuration:**
- `LOG_LEVEL`: Logging level - DEBUG, INFO, WARNING, ERROR, CRITICAL (default: `INFO`)
- `LOG_DIR`: Log directory path (default: `logs`)
- `ENABLE_FILE_LOGGING`: Enable file logging - true/false (default: `true`)
- `ENABLE_CONSOLE_LOGGING`: Enable console logging - true/false (default: `true`)

**User Configuration:**
- `TEST_USER_EMAIL`: Default test user email (default: `[REDACTED]`)
- `TEST_USER_PASSWORD`: Default test user password (default: `Admin123`)
- `TEST_USER_FULL_NAME`: Default test user full name (default: `Admin`)

**Superwise AI Configuration:**
- `SUPERWISE_API_URL`: Superwise API endpoint (default: `https://api.superwise.ai/v1/app-worker`)
- `SUPERWISE_AGENT_ID`: Superwise agent ID

### **Logging**

The application includes comprehensive logging with the following features:

- **Dual Log Files**: 
  - `logs/app.log`: All application logs (INFO level and above)
  - `logs/error.log`: Error logs only (ERROR level and above)
  
- **Automatic Rotation**: Logs rotate daily at midnight with everyday retention

- **Log Format**: Detailed logs include timestamp, logger name, level, function name, line number, and message

- **Docker Support**: Logs are persisted via Docker volumes and accessible both inside containers and on the host

## 🔒 Data Privacy & Compliance

### **Important Disclaimers**

⚠️ **This application uses SYNTHETIC DUMMY DATA for demonstration purposes only.**

- **No Real Project Data**: All projects data in this application is artificially generated
- **Educational Purpose**: This is a demonstration/educational project, not a production test system
- **Data Sources**: Dummy project data has set into Superwise agent knowledge.

🚨 **CRITICAL SECURITY LIMITATIONS - NOT PRODUCTION READY:**

- **Authentication**: Application has user login but not using OAuth2 authentication
- **No Authorization**: No access controls or user permission management
- **No Data Encryption**: Machine data is stored and transmitted without encryption
- **No Session Management**: No secure session handling or user state management
- **No Access Logging**: No audit trails for data access or user activities
- **No Input Validation**: Limited input sanitization and validation
- **No HTTPS Enforcement**: No SSL/TLS encryption for data transmission

**⚠️ DO NOT USE WITH REAL PROJECT DATA - FOR DEMONSTRATION ONLY**

### Data Handling
- **Local Processing:** All data processing occurs locally on your infrastructure
- **No External Data Sharing:** Data is not transmitted to external services (except Superwise AI with explicit consent)
- **Data Retention:** Logs and data are stored locally with configurable retention policies
- **Access Control:** Environment-based configuration for secure access

### Compliance Features
- **GDPR Ready:** Data processing follows privacy-by-design principles
- **Audit Logging:** Comprehensive logging for compliance tracking
- **Secure Configuration:** Environment variables for sensitive data management

### GDPR Considerations
- **Local Processing:** All data processing occurs locally on user infrastructure
- **Synthetic Data:** Uses only synthetic/demo data for demonstration purposes
- **No Personal Data:** The system processes only project data (project name, description, business requirement document).
- **Clear Purpose:** Data processing is limited to test plan & cases generation.
- **Environment Variables:** Sensitive configuration stored in environment variables
- **Local Storage:** Data stored locally with no external transmission (except optional Superwise AI integration)
- **Input Validation:** Comprehensive data validation and sanitization
- **Error Handling:** Secure error messages without data exposure
- **Clear Documentation:** Comprehensive privacy and compliance documentation
- **Data Sources:** Clearly documented data sources and processing purposes
- **Configuration:** Transparent configuration management
- **Comprehensive Logging:** Detailed audit logs for all operations
- **Compliance Tracking:** Logging specifically designed for compliance tracking
- **Data Processing Records:** Complete records of data processing activities

### Data Sources
- **Synthetic Data:** Pre-loaded sample data for demonstration
- **Data Validation:** Input validation and sanitization
- **Error Handling:** Secure error messages without data exposure

**For Production Use:**
- **GDPR Compliance**: Ensure proper GDPR compliance before handling real project data
- **Data Encryption**: Use encryption for data at rest and in transit
- **Access Controls**: Implement proper user authentication and authorization
- **Audit Logging**: Maintain comprehensive audit trails for all data access
- **Business Associate Agreements**: Ensure all third-party services (like Superwise API) have proper BAAs

**Current Implementation:**
- ✅ **Synthetic Data Only**: No real project data is processed
- ✅ **Local Processing**: Data stays within your local environment
- ✅ **No External Storage**: No data is sent to external databases
- ⚠️ **API Integration**: Superwise API calls may transmit synthetic data (configure accordingly)

**Note**: This application is for educational/demonstration purposes. For production applications, consult with legal and compliance experts regarding GDPR requirements.

## 📊 Demo Data

Load following data for application execution:

- **Superwise agent knowledge:** Add business requirement document pdf file in Superwise knowledge agent.
- **Create Project:** Login to TestGenie using the credentials set in environment file (TEST_USER_EMAIL, TEST_USER_PASSWORD). Create Project from dashboard using project name, description, version, etc.

Note: the AI agent will generate test plan & cases using project name and business requirement document.

## 🔍 Code Quality & Linting

### Code Standards

**Backend (Python):**
- **PEP 8 Compliance:** Python code follows PEP 8 style guidelines with 88-character line length
- **Type Hints:** Comprehensive type annotations with mypy strict type checking
- **Code Formatting:** Consistent code formatting with Black and import sorting with isort
- **Code Complexity:** Enforced complexity limits (max complexity: 10, max statements: 50)
- **Documentation:** Inline documentation and docstrings for all functions and modules
- **Error Handling:** Robust error handling throughout the application

**Frontend (TypeScript/React):**
- **TypeScript:** Full type safety with strict TypeScript configuration
- **ESLint:** Next.js ESLint rules with core-web-vitals and TypeScript support
- **Code Style:** Consistent React/Next.js patterns and best practices
- **Component Documentation:** TypeScript interfaces and JSDoc comments for components

### Linting & Formatting Tools

**Backend Linting:**
```bash
# Run flake8 linting (style and error checking)
npm run lint:backend
# Or manually:
cd backend
flake8 . --max-line-length=88 --extend-ignore=E203,W503

# Format code with Black and isort
npm run format:backend
# Or manually:
cd backend
black .
isort . --profile black

# Type checking with mypy
npm run typecheck:backend
# Or manually:
cd backend
mypy . --ignore-missing-imports

# Run all backend checks
npm run lint:backend && npm run format:backend && npm run typecheck:backend
```

**Frontend Linting:**
```bash
# Run ESLint checks
npm run lint:frontend
# Or manually:
cd frontend
npm run lint

# Type checking is built into Next.js build process
npm run build:frontend
```

**Combined Commands:**
```bash
# Lint both frontend and backend
npm run lint:all

# Format all code (backend only)
npm run format:all

# Run all tests
npm run test:all
```

## 📚 Documentation

### Available Documentation
- **[Docker Setup Guide](docs/DOCKER_README.md)** - Complete Docker deployment and configuration guide
- **[Superwise Agent Setup](docs/SUPERWISE_AGENT_SETUP_GUIDE.md)** - AI agent configuration and integration guide
- **[User Guide](docs/USAGE.md)** - Step-by-step user walkthrough and features
- **[Application Interface](http://localhost:3000)** - Interactive web application
- **[Environment Setup](.env.example)** - Environment variables configuration template

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation:** Check the comprehensive guides in the `docs/` folder
- **Application Interface:** Visit http://localhost:3000 for the interactive web application

### Troubleshooting
- **Common Issues:** Check the [User Guide](docs/USAGE.md) for troubleshooting steps
- **Configuration:** Verify your `.env` file matches the `.env.example` template
- **Logs:** Check the `logs/` directory for detailed error information
- **Health Check:** 
  - **Backend API Health:** Visit http://localhost:5000/api/health to verify backend API status
  - **API Documentation:** Visit http://localhost:5000/docs for interactive API documentation
  - **Frontend:** Visit http://localhost:3000 to access the web application

