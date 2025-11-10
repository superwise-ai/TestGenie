from typing import List, Optional

from logging_config import get_logger
from models import (
    Element,
    Environment,
    Project,
    TestCase,
    TestData,
    TestPlan,
    TestPlanTestSuite,
    TestStep,
    TestSuite,
    TestSuiteTestCase,
)
from schemas import (
    ElementCreate,
    EnvironmentCreate,
    ProjectCreate,
    ProjectUpdate,
    TestCaseCreate,
    TestCaseUpdate,
    TestDataCreate,
    TestPlanCreate,
    TestSuiteCreate,
)
from sqlalchemy import and_
from sqlalchemy.orm import Session

# Logger
logger = get_logger(__name__)


# Project CRUD operations
def get_user_projects(db: Session, user_id: int) -> List[Project]:
    """Get all projects for a user"""
    logger.debug(f"Fetching projects for user_id: {user_id}")
    projects = db.query(Project).filter(Project.owner_id == user_id).all()
    logger.debug(f"Found {len(projects)} projects for user_id: {user_id}")
    return projects


def get_project_by_id(db: Session, project_id: int, user_id: int) -> Optional[Project]:
    """Get a project by ID for a specific user"""
    return (
        db.query(Project)
        .filter(and_(Project.id == project_id, Project.owner_id == user_id))
        .first()
    )


def create_user_project(
    db: Session, project_data: ProjectCreate, user_id: int
) -> Project:
    """Create a new project for a user"""
    logger.debug(f"Creating project '{project_data.name}' for user_id: {user_id}")
    try:
        db_project = Project(**project_data.dict(), owner_id=user_id)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        logger.info(f"Project created: id={db_project.id}, name={db_project.name}, user_id={user_id}")
        return db_project
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}", exc_info=True)
        db.rollback()
        raise


def update_user_project(
    db: Session, project_id: int, project_data: ProjectUpdate, user_id: int
) -> Optional[Project]:
    """Update a project for a user"""
    project = get_project_by_id(db, project_id, user_id)
    if not project:
        return None

    for field, value in project_data.dict(exclude_unset=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


def delete_user_project(db: Session, project_id: int, user_id: int) -> bool:
    """Delete a project for a user"""
    project = get_project_by_id(db, project_id, user_id)
    if not project:
        return False

    db.delete(project)
    db.commit()
    return True


# Test Case CRUD operations
def get_project_test_cases(db: Session, project_id: int) -> List[TestCase]:
    """Get all test cases for a project"""
    return db.query(TestCase).filter(TestCase.project_id == project_id).all()


def get_test_case_by_id(
    db: Session, test_case_id: int, project_id: int
) -> Optional[TestCase]:
    """Get a test case by ID for a specific project"""
    return (
        db.query(TestCase)
        .filter(and_(TestCase.id == test_case_id, TestCase.project_id == project_id))
        .first()
    )


def create_project_test_case(
    db: Session, test_case_data: TestCaseCreate, project_id: int, created_by: str
) -> TestCase:
    """Create a new test case for a project"""
    logger.debug(f"Creating test case '{test_case_data.name}' for project_id: {project_id}")
    try:
        # Create test case
        db_test_case = TestCase(
            **test_case_data.dict(exclude={"steps"}),
            project_id=project_id,
            created_by=created_by,
        )
        db.add(db_test_case)
        db.flush()  # Get the ID

        # Create test steps
        for step_data in test_case_data.steps:
            db_step = TestStep(**step_data.dict(), test_case_id=db_test_case.id)
            db.add(db_step)

        db.commit()
        db.refresh(db_test_case)
        logger.info(f"Test case created: id={db_test_case.id}, name={db_test_case.name}, project_id={project_id}")
        return db_test_case
    except Exception as e:
        logger.error(f"Error creating test case: {str(e)}", exc_info=True)
        db.rollback()
        raise


def update_test_case_by_id(
    db: Session, test_case_id: int, test_case_data: TestCaseUpdate, project_id: int
) -> Optional[TestCase]:
    """Update a test case"""
    test_case = get_test_case_by_id(db, test_case_id, project_id)
    if not test_case:
        return None

    # Update test case fields
    for field, value in test_case_data.dict(
        exclude={"steps"}, exclude_unset=True
    ).items():
        setattr(test_case, field, value)

    # Update test steps
    if "steps" in test_case_data.dict(exclude_unset=True):
        # Delete existing steps
        db.query(TestStep).filter(TestStep.test_case_id == test_case_id).delete()

        # Create new steps
        for step_data in test_case_data.steps:
            db_step = TestStep(**step_data.dict(), test_case_id=test_case_id)
            db.add(db_step)

    db.commit()
    db.refresh(test_case)
    return test_case


def delete_test_case_by_id(db: Session, test_case_id: int, project_id: int) -> bool:
    """Delete a test case"""
    test_case = get_test_case_by_id(db, test_case_id, project_id)
    if not test_case:
        return False

    db.delete(test_case)
    db.commit()
    return True


# Element CRUD operations
def get_project_elements(db: Session, project_id: int) -> List[Element]:
    """Get all elements for a project"""
    return db.query(Element).filter(Element.project_id == project_id).all()


def create_project_element(
    db: Session, element_data: ElementCreate, project_id: int, created_by: str
) -> Element:
    """Create a new element for a project"""
    db_element = Element(
        **element_data.dict(), project_id=project_id, created_by=created_by
    )
    db.add(db_element)
    db.commit()
    db.refresh(db_element)
    return db_element


# Test Suite CRUD operations
def get_project_test_suites(db: Session, project_id: int) -> List[TestSuite]:
    """Get all test suites for a project"""
    return db.query(TestSuite).filter(TestSuite.project_id == project_id).all()


def create_project_test_suite(
    db: Session, test_suite_data: TestSuiteCreate, project_id: int, created_by: str
) -> TestSuite:
    """Create a new test suite for a project"""
    db_test_suite = TestSuite(
        **test_suite_data.dict(exclude={"test_case_ids"}),
        project_id=project_id,
        created_by=created_by,
    )
    db.add(db_test_suite)
    db.flush()  # Get the ID

    # Add test cases to the suite
    for test_case_id in test_suite_data.test_case_ids:
        db_suite_case = TestSuiteTestCase(
            test_suite_id=db_test_suite.id, test_case_id=test_case_id
        )
        db.add(db_suite_case)

    db.commit()
    db.refresh(db_test_suite)
    return db_test_suite


# Test Plan CRUD operations
def get_project_test_plans(db: Session, project_id: int) -> List[TestPlan]:
    """Get all test plans for a project"""
    return db.query(TestPlan).filter(TestPlan.project_id == project_id).all()


def create_project_test_plan(
    db: Session, test_plan_data: TestPlanCreate, project_id: int, created_by: str
) -> TestPlan:
    """Create a new test plan for a project"""
    db_test_plan = TestPlan(
        **test_plan_data.dict(exclude={"test_suite_ids"}),
        project_id=project_id,
        created_by=created_by,
    )
    db.add(db_test_plan)
    db.flush()  # Get the ID

    # Add test suites to the plan
    for test_suite_id in test_plan_data.test_suite_ids:
        db_plan_suite = TestPlanTestSuite(
            test_plan_id=db_test_plan.id, test_suite_id=test_suite_id
        )
        db.add(db_plan_suite)

    db.commit()
    db.refresh(db_test_plan)
    return db_test_plan


# Test Data CRUD operations
def get_project_test_data(db: Session, project_id: int) -> List[TestData]:
    """Get all test data for a project"""
    return db.query(TestData).filter(TestData.project_id == project_id).all()


def create_project_test_data(
    db: Session, test_data: TestDataCreate, project_id: int, created_by: str
) -> TestData:
    """Create new test data for a project"""
    db_test_data = TestData(
        **test_data.dict(), project_id=project_id, created_by=created_by
    )
    db.add(db_test_data)
    db.commit()
    db.refresh(db_test_data)
    return db_test_data


# Environment CRUD operations
def get_project_environments(db: Session, project_id: int) -> List[Environment]:
    """Get all environments for a project"""
    return db.query(Environment).filter(Environment.project_id == project_id).all()


def create_project_environment(
    db: Session, environment_data: EnvironmentCreate, project_id: int, created_by: str
) -> Environment:
    """Create a new environment for a project"""
    db_environment = Environment(
        **environment_data.dict(), project_id=project_id, created_by=created_by
    )
    db.add(db_environment)
    db.commit()
    db.refresh(db_environment)
    return db_environment
