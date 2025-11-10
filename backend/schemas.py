import re
from datetime import datetime
from typing import List, Optional

from models import (
    ElementStatus,
    ElementType,
    TestCasePriority,
    TestCaseStatus,
    TestDataStatus,
    TestDataType,
)
from pydantic import BaseModel, Field


# Email validation function
def validate_email(email: str) -> str:
    """Simple email validation"""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(pattern, email):
        raise ValueError("Invalid email format")
    return email


# User schemas - simplified
class UserLogin(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    created_at: str

    class Config:
        from_attributes = True


# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    application_name: Optional[str] = None
    version: Optional[str] = None
    color: Optional[str] = "#F54927"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_run: Optional[datetime] = None
    owner_id: int

    class Config:
        from_attributes = True


# Test Step schemas
class TestStepBase(BaseModel):
    step_number: int
    action: str
    element: Optional[str] = None
    value: Optional[str] = None
    description: Optional[str] = None


class TestStepCreate(TestStepBase):
    pass


class TestStepResponse(TestStepBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Test Case schemas
class TestCaseBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: TestCaseStatus = TestCaseStatus.DRAFT
    priority: TestCasePriority = TestCasePriority.MEDIUM
    assignee: Optional[str] = None
    reviewer: Optional[str] = None
    browsers: List[str] = ["chrome"]
    environment: Optional[str] = None


class TestCaseCreate(TestCaseBase):
    steps: List[TestStepCreate] = []


class TestCaseUpdate(TestCaseBase):
    steps: List[TestStepCreate] = []


class TestCaseResponse(TestCaseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: str
    project_id: int
    steps: List[TestStepResponse] = []

    class Config:
        from_attributes = True


# Element schemas
class ElementBase(BaseModel):
    name: str
    selector: str
    type: ElementType
    description: Optional[str] = None
    status: ElementStatus = ElementStatus.ACTIVE


class ElementCreate(ElementBase):
    pass


class ElementUpdate(ElementBase):
    pass


class ElementResponse(ElementBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: str
    project_id: int

    class Config:
        from_attributes = True


# Test Suite schemas
class TestSuiteBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"


class TestSuiteCreate(TestSuiteBase):
    test_case_ids: List[int] = []


class TestSuiteUpdate(TestSuiteBase):
    test_case_ids: List[int] = []


class TestSuiteResponse(TestSuiteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: str
    project_id: int
    test_cases: List[TestCaseResponse] = []

    class Config:
        from_attributes = True


# Test Plan schemas
class TestPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "draft"


class TestPlanCreate(TestPlanBase):
    test_suite_ids: List[int] = []


class TestPlanUpdate(TestPlanBase):
    test_suite_ids: List[int] = []


class TestPlanResponse(TestPlanBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: str
    project_id: int
    test_suites: List[TestSuiteResponse] = []

    class Config:
        from_attributes = True


# Test Data schemas
class TestDataBase(BaseModel):
    name: str
    type: TestDataType
    description: Optional[str] = None
    records: int = 0
    status: TestDataStatus = TestDataStatus.ACTIVE


class TestDataCreate(TestDataBase):
    pass


class TestDataUpdate(TestDataBase):
    pass


class TestDataResponse(TestDataBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: str
    project_id: int

    class Config:
        from_attributes = True


# Environment schemas
class EnvironmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    url: Optional[str] = None
    status: str = "active"


class EnvironmentCreate(EnvironmentBase):
    pass


class EnvironmentUpdate(EnvironmentBase):
    pass


class EnvironmentResponse(EnvironmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: str
    project_id: int

    class Config:
        from_attributes = True
