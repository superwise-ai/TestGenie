import enum

from database import Base
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    projects = relationship(
        "Project", back_populates="owner", cascade="all, delete-orphan"
    )


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    application_name = Column(String)
    version = Column(String)
    color = Column(String, default="#F54927")
    status = Column(String, default="healthy")  # healthy, warning, error
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_run = Column(DateTime(timezone=True))

    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="projects")
    test_cases = relationship(
        "TestCase", back_populates="project", cascade="all, delete-orphan"
    )
    elements = relationship(
        "Element", back_populates="project", cascade="all, delete-orphan"
    )
    test_suites = relationship(
        "TestSuite", back_populates="project", cascade="all, delete-orphan"
    )
    test_plans = relationship(
        "TestPlan", back_populates="project", cascade="all, delete-orphan"
    )
    test_data = relationship(
        "TestData", back_populates="project", cascade="all, delete-orphan"
    )
    environments = relationship(
        "Environment", back_populates="project", cascade="all, delete-orphan"
    )


class TestCaseStatus(str, enum.Enum):
    DRAFT = "draft"
    IN_REVIEW = "in-review"
    READY = "ready"
    OBSOLETE = "obsolete"
    REWORK = "rework"


class TestCasePriority(str, enum.Enum):
    CRITICAL = "critical"
    MAJOR = "major"
    MEDIUM = "medium"
    MINOR = "minor"


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(TestCaseStatus), default=TestCaseStatus.DRAFT)
    priority = Column(Enum(TestCasePriority), default=TestCasePriority.MEDIUM)
    assignee = Column(String)
    reviewer = Column(String)
    browsers = Column(JSON)  # List of supported browsers
    environment = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=False)

    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="test_cases")
    steps = relationship(
        "TestStep", back_populates="test_case", cascade="all, delete-orphan"
    )


class TestStep(Base):
    __tablename__ = "test_steps"

    id = Column(Integer, primary_key=True, index=True)
    step_number = Column(Integer, nullable=False)
    action = Column(String, nullable=False)
    element = Column(String)
    value = Column(String)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign keys
    test_case_id = Column(Integer, ForeignKey("test_cases.id"), nullable=False)

    # Relationships
    test_case = relationship("TestCase", back_populates="steps")


class ElementType(str, enum.Enum):
    BUTTON = "button"
    INPUT = "input"
    LINK = "link"
    DROPDOWN = "dropdown"
    CHECKBOX = "checkbox"
    RADIO = "radio"
    OTHER = "other"


class ElementStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DEPRECATED = "deprecated"


class Element(Base):
    __tablename__ = "elements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    selector = Column(String, nullable=False)
    type = Column(Enum(ElementType), nullable=False)
    description = Column(Text)
    status = Column(Enum(ElementStatus), default=ElementStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=False)

    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="elements")


class TestSuite(Base):
    __tablename__ = "test_suites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="active")  # active, inactive
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=False)

    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="test_suites")
    test_cases = relationship("TestCase", secondary="test_suite_test_cases")


class TestSuiteTestCase(Base):
    __tablename__ = "test_suite_test_cases"

    test_suite_id = Column(Integer, ForeignKey("test_suites.id"), primary_key=True)
    test_case_id = Column(Integer, ForeignKey("test_cases.id"), primary_key=True)


class TestPlan(Base):
    __tablename__ = "test_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="draft")  # draft, active, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=False)

    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="test_plans")
    test_suites = relationship("TestSuite", secondary="test_plan_test_suites")


class TestPlanTestSuite(Base):
    __tablename__ = "test_plan_test_suites"

    test_plan_id = Column(Integer, ForeignKey("test_plans.id"), primary_key=True)
    test_suite_id = Column(Integer, ForeignKey("test_suites.id"), primary_key=True)


class TestDataType(str, enum.Enum):
    CSV = "csv"
    JSON = "json"
    EXCEL = "excel"
    DATABASE = "database"
    API = "api"


class TestDataStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"


class TestData(Base):
    __tablename__ = "test_data"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(Enum(TestDataType), nullable=False)
    description = Column(Text)
    records = Column(Integer, default=0)
    status = Column(Enum(TestDataStatus), default=TestDataStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=False)

    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="test_data")


class Environment(Base):
    __tablename__ = "environments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    url = Column(String)
    status = Column(String, default="active")  # active, inactive
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, nullable=False)

    # Foreign keys
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="environments")
