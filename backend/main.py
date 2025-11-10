from datetime import datetime
from typing import List
import os

from auth import create_access_token, verify_token
from config import (
    FRONTEND_URL,
    SUPERWISE_AGENT_ID,
    SUPERWISE_API_URL,
    TEST_USER_EMAIL,
    TEST_USER_PASSWORD,
    TEST_USER_FULL_NAME,
    TEST_USER_ID,
)
from crud import *
from database import Base, engine, get_db
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from logging_config import get_logger
from models import *
from schemas import *
from sqlalchemy.orm import Session

# Load environment variables
# load_dotenv()

# Configure logging
logger = get_logger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="TestGenie API", description="Test Management Platform API", version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("TestGenie Backend Starting")
    logger.info(f"Frontend URL: {FRONTEND_URL}")
    logger.info(f"Superwise API URL: {SUPERWISE_API_URL}")
    logger.info("=" * 50)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Use FRONTEND_URL from config
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# User credentials from environment variables
HARDCODED_USER = {
    "email": TEST_USER_EMAIL,
    "password": TEST_USER_PASSWORD,
    "full_name": TEST_USER_FULL_NAME,
    "id": TEST_USER_ID,
}


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            logger.warning("Token verification failed: payload is None")
            raise credentials_exception

        email: str = payload.get("sub")
        if email is None:
            logger.warning("Token payload missing email/sub field")
            raise credentials_exception

    except Exception as e:
        logger.error(f"Error validating token: {str(e)}", exc_info=True)
        raise credentials_exception

    # For hardcoded user, return the hardcoded user data
    if payload.get("sub") == HARDCODED_USER["email"]:
        logger.debug(f"Authenticated user: {email}")
        return HARDCODED_USER

    logger.warning(f"User not found in system: {email}")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User not found",
        headers={"WWW-Authenticate": "Bearer"},
    )


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    logger.debug("Health check endpoint accessed")
    return {
        "status": "OK",
        "message": "TestGenie API is running",
        "timestamp": datetime.now().isoformat(),
    }


# Authentication endpoints
@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    """Login user with hardcoded credentials"""
    logger.info(f"Login attempt for email: {login_data.email}")
    
    if (
        login_data.email == HARDCODED_USER["email"]
        and login_data.password == HARDCODED_USER["password"]
    ):
        logger.info(f"Login successful for user: {login_data.email}")
        access_token = create_access_token(data={"sub": HARDCODED_USER["email"]})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": HARDCODED_USER["id"],
                "email": HARDCODED_USER["email"],
                "full_name": HARDCODED_USER["full_name"],
                "created_at": datetime.now().isoformat(),
            },
        }
    else:
        logger.warning(f"Failed login attempt for email: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )


# Project endpoints
@app.get("/api/projects", response_model=List[ProjectResponse])
async def get_projects(
    current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get all projects for the current user"""
    logger.info(f"Fetching projects for user: {current_user['id']}")
    projects = get_user_projects(db, current_user["id"])
    logger.debug(f"Found {len(projects)} projects for user: {current_user['id']}")
    return projects


@app.post("/api/projects", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new project"""
    logger.info(f"Creating project '{project_data.name}' for user: {current_user['id']}")
    try:
        project = create_user_project(db, project_data, current_user["id"])
        logger.info(f"Project created successfully: {project.id} - {project.name}")
        return project
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}", exc_info=True)
        raise


@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific project"""
    logger.debug(f"Fetching project {project_id} for user: {current_user['id']}")
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        logger.warning(f"Project {project_id} not found for user: {current_user['id']}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    return project


@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a project"""
    logger.info(f"Updating project {project_id} for user: {current_user['id']}")
    project = update_user_project(db, project_id, project_data, current_user["id"])
    if not project:
        logger.warning(f"Project {project_id} not found for update by user: {current_user['id']}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    logger.info(f"Project {project_id} updated successfully")
    return project


@app.delete("/api/projects/{project_id}")
async def delete_project(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a project"""
    logger.info(f"Deleting project {project_id} for user: {current_user['id']}")
    success = delete_user_project(db, project_id, current_user["id"])
    if not success:
        logger.warning(f"Project {project_id} not found for deletion by user: {current_user['id']}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    logger.info(f"Project {project_id} deleted successfully")
    return {"message": "Project deleted successfully"}


# Test Case endpoints
@app.get("/api/projects/{project_id}/test-cases", response_model=List[TestCaseResponse])
async def get_test_cases(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all test cases for a project"""
    logger.debug(f"Fetching test cases for project {project_id}")
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        logger.warning(f"Project {project_id} not found for user: {current_user['id']}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    test_cases = get_project_test_cases(db, project_id)
    logger.debug(f"Found {len(test_cases)} test cases for project {project_id}")
    return test_cases


@app.post("/api/projects/{project_id}/test-cases", response_model=TestCaseResponse)
async def create_test_case(
    project_id: int,
    test_case_data: TestCaseCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new test case"""
    logger.info(f"Creating test case '{test_case_data.name}' for project {project_id}")
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        logger.warning(f"Project {project_id} not found for user: {current_user['id']}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    try:
        test_case = create_project_test_case(
            db, test_case_data, project_id, current_user["full_name"]
        )
        logger.info(f"Test case created successfully: {test_case.id} - {test_case.name}")
        return test_case
    except Exception as e:
        logger.error(f"Error creating test case: {str(e)}", exc_info=True)
        raise


@app.get(
    "/api/projects/{project_id}/test-cases/{test_case_id}",
    response_model=TestCaseResponse,
)
async def get_test_case(
    project_id: int,
    test_case_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific test case"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    test_case = get_test_case_by_id(db, test_case_id, project_id)
    if not test_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found"
        )
    return test_case


@app.put(
    "/api/projects/{project_id}/test-cases/{test_case_id}",
    response_model=TestCaseResponse,
)
async def update_test_case(
    project_id: int,
    test_case_id: int,
    test_case_data: TestCaseUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a test case"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    test_case = update_test_case_by_id(db, test_case_id, test_case_data, project_id)
    if not test_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found"
        )
    return test_case


@app.delete("/api/projects/{project_id}/test-cases/{test_case_id}")
async def delete_test_case(
    project_id: int,
    test_case_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a test case"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    success = delete_test_case_by_id(db, test_case_id, project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found"
        )
    return {"message": "Test case deleted successfully"}


# Element endpoints
@app.get("/api/projects/{project_id}/elements", response_model=List[ElementResponse])
async def get_elements(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all elements for a project"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    elements = get_project_elements(db, project_id)
    return elements


@app.post("/api/projects/{project_id}/elements", response_model=ElementResponse)
async def create_element(
    project_id: int,
    element_data: ElementCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new element"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    element = create_project_element(
        db, element_data, project_id, current_user["full_name"]
    )
    return element


# Test Suite endpoints
@app.get(
    "/api/projects/{project_id}/test-suites", response_model=List[TestSuiteResponse]
)
async def get_test_suites(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all test suites for a project"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    test_suites = get_project_test_suites(db, project_id)
    return test_suites


@app.post("/api/projects/{project_id}/test-suites", response_model=TestSuiteResponse)
async def create_test_suite(
    project_id: int,
    test_suite_data: TestSuiteCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new test suite"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    test_suite = create_project_test_suite(
        db, test_suite_data, project_id, current_user["full_name"]
    )
    return test_suite


# Test Plan endpoints
@app.get("/api/projects/{project_id}/test-plans", response_model=List[TestPlanResponse])
async def get_test_plans(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all test plans for a project"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    test_plans = get_project_test_plans(db, project_id)
    return test_plans


# AI Test Plans endpoint
@app.get("/api/projects/{project_id}/ai-test-plans")
async def get_ai_test_plans(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Call Superwise AI API to generate test plans"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    try:
        import requests

        logger.info(f"Calling Superwise AI API for test plans - project: {project.name}")
        # Prepare the request to Superwise AI API
        superwise_url = f"{SUPERWISE_API_URL}/{SUPERWISE_AGENT_ID}/v1/ask"

        # Prepare the payload
        payload = {
            "input": (
                "create test case plan for "
                + project.name
                + ". Please do not include any test cases. "
                "Please do not provide any data in tables format."
            ),
            "chat_history": [],
        }

        # Make the request to Superwise AI
        headers = {"accept": "application/json", "content-type": "application/json"}

        logger.debug(f"POST {superwise_url}")
        response = requests.post(superwise_url, json=payload, headers=headers)
        response.raise_for_status()

        logger.info("Successfully received AI test plans response")
        # Return the response from Superwise AI
        return response.json()

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error calling Superwise AI API: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calling Superwise AI API: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Unexpected error in AI test plans endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}",
        )


# AI Test Cases endpoint
@app.get("/api/projects/{project_id}/ai-test-cases")
async def get_ai_test_cases(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Call Superwise AI API to generate test plans"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    try:
        import requests

        logger.info(f"Calling Superwise AI API for test cases - project: {project.name}")
        # Prepare the request to Superwise AI API
        superwise_url = f"{SUPERWISE_API_URL}/{SUPERWISE_AGENT_ID}/v1/ask"

        # Prepare the payload
        payload = {
            "input": (
                "create test cases for "
                + project.name
                + ". The response must be in json form and should have the fields "
                "Test Case Name, Description, Priority, Browsers, "
                "Environment, Test Steps. "
                "The json format should be aligned for all records so it can easily "
                "render on UI tables."
            ),
            "chat_history": [],
        }

        # Make the request to Superwise AI
        headers = {"accept": "application/json", "content-type": "application/json"}

        logger.debug(f"POST {superwise_url}")
        response = requests.post(superwise_url, json=payload, headers=headers)
        response.raise_for_status()

        logger.info("Successfully received AI test cases response")
        # Return the response from Superwise AI
        return response.json()

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error calling Superwise AI API: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calling Superwise AI API: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Unexpected error in AI test cases endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}",
        )


# Test Data endpoints
@app.get("/api/projects/{project_id}/test-data", response_model=List[TestDataResponse])
async def get_test_data(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all test data for a project"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    test_data = get_project_test_data(db, project_id)
    return test_data


@app.post("/api/projects/{project_id}/test-data", response_model=TestDataResponse)
async def create_test_data(
    project_id: int,
    test_data: TestDataCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create new test data"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    data = create_project_test_data(
        db, test_data, project_id, current_user["full_name"]
    )
    return data


# Environment endpoints
@app.get(
    "/api/projects/{project_id}/environments", response_model=List[EnvironmentResponse]
)
async def get_environments(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all environments for a project"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    environments = get_project_environments(db, project_id)
    return environments


@app.post("/api/projects/{project_id}/environments", response_model=EnvironmentResponse)
async def create_environment(
    project_id: int,
    environment_data: EnvironmentCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new environment"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    environment = create_project_environment(
        db, environment_data, project_id, current_user["full_name"]
    )
    return environment


# AI Assistant endpoint
@app.post("/api/projects/{project_id}/ai-assistant")
async def ai_assistant(
    project_id: int,
    request_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Call Superwise AI API to generate test plans"""
    # Verify project ownership
    project = get_project_by_id(db, project_id, current_user["id"])
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
