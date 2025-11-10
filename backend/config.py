import os
from pathlib import Path
from dotenv import load_dotenv  # type: ignore

# Load environment variables from .env file in root folder
root_dir = Path(__file__).parent.parent
env_path = root_dir / ".env"
print(env_path)
load_dotenv(dotenv_path=env_path)

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./backend/testgenie.db")

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production-12345")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# CORS Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Superwise AI Configuration
SUPERWISE_API_URL = os.getenv(
    "SUPERWISE_API_URL", "https://api.superwise.ai/v1/app-worker"
)
SUPERWISE_AGENT_ID = os.getenv(
    "SUPERWISE_AGENT_ID", "81244be2-569b-4730-af1b-f2b70d6737fa"
)

# User Credentials Configuration
# If the value is [REDACTED], use the default instead
TEST_USER_EMAIL = os.getenv("TEST_USER_EMAIL", "admin@superwise.ai")
if TEST_USER_EMAIL == "[REDACTED]":
    print(f"[WARNING] TEST_USER_EMAIL was set to [REDACTED], using default: admin@superwise.ai")
    TEST_USER_EMAIL = "admin@superwise.ai"

print(f"[DEBUG config.py] TEST_USER_EMAIL final value: {repr(TEST_USER_EMAIL)}")
TEST_USER_PASSWORD = os.getenv("TEST_USER_PASSWORD", "Admin123")
TEST_USER_FULL_NAME = os.getenv("TEST_USER_FULL_NAME", "Admin")
TEST_USER_ID = int(os.getenv("TEST_USER_ID", "1"))

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
LOG_DIR = os.getenv("LOG_DIR", "logs")
ENABLE_FILE_LOGGING = os.getenv("ENABLE_FILE_LOGGING", "true").lower() == "true"
ENABLE_CONSOLE_LOGGING = os.getenv("ENABLE_CONSOLE_LOGGING", "true").lower() == "true"