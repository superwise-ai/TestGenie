import os
from pathlib import Path

from dotenv import load_dotenv
from logging_config import get_logger
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Logger
logger = get_logger(__name__)

# Load environment variables from .env file in root folder
root_dir = Path(__file__).parent.parent
env_path = root_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

# Database URL - using SQLite for development, easily changeable to PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./testgenie.db")

# If using SQLite and the path contains "backend", resolve it properly
if "sqlite" in DATABASE_URL and "backend" in DATABASE_URL:
    # Remove the sqlite:/// prefix to get just the path
    db_path = DATABASE_URL.replace("sqlite:///", "")
    # Get the root directory (parent of backend)
    root_dir = Path(__file__).parent.parent
    # Get the backend directory
    backend_dir = Path(__file__).parent
    
    # If the path starts with "./backend", resolve from root, otherwise use backend_dir
    if db_path.startswith("./backend/"):
        # Resolve relative to root directory
        db_file = db_path.replace("./backend/", "")
        absolute_db_path = backend_dir / db_file
    else:
        # Already relative to backend or absolute
        absolute_db_path = backend_dir / db_path.lstrip("./")
    
    DATABASE_URL = f"sqlite:///{absolute_db_path.as_posix()}"

# Create SQLAlchemy engine
logger.info(f"Creating database engine with URL: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)
logger.debug("Database engine created successfully")

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        logger.debug("Database session created")
        yield db
    except Exception as e:
        logger.error(f"Database session error: {str(e)}", exc_info=True)
        db.rollback()
        raise
    finally:
        logger.debug("Closing database session")
        db.close()
