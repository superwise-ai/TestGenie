"""
Logging configuration for TestGenie Backend
Provides centralized logging setup with datewise file rotation and console output
"""
import logging
import logging.handlers
import os
import sys
from pathlib import Path
from typing import Optional


def setup_logging(
    log_level: Optional[str] = None,
    log_dir: Optional[str] = None,
    enable_file_logging: bool = True,
    enable_console_logging: bool = True,
) -> logging.Logger:
    """
    Setup logging configuration for the application
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL). Defaults to INFO
        log_dir: Directory for log files. Defaults to 'logs' (root directory)
        enable_file_logging: Whether to enable file logging (default: True)
        enable_console_logging: Whether to enable console logging (default: True)
    
    Returns:
        Configured root logger
    """
    # Get log level from environment or use default
    if log_level is None:
        log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    
    level = getattr(logging, log_level, logging.INFO)
    
    # Setup log directory
    if log_dir is None:
        # Check for LOG_DIR environment variable first
        env_log_dir = os.getenv("LOG_DIR")
        if env_log_dir:
            log_dir = Path(env_log_dir)
            # If relative path provided, resolve it properly
            if not log_dir.is_absolute():
                # Try to find project root
                current = Path.cwd()
                # If we're in Docker (/app), use /app/logs
                if str(current) == "/app":
                    log_dir = Path("/app/logs")
                # If current directory is backend, go up to project root
                elif current.name == "backend":
                    log_dir = current.parent / env_log_dir
                else:
                    log_dir = current / env_log_dir
        else:
            # Default behavior: determine based on context
            current = Path.cwd()
            # If we're in Docker (/app), use /app/logs
            if str(current) == "/app":
                log_dir = Path("/app/logs")
            # If current directory is backend, go up to project root for logs
            elif current.name == "backend":
                log_dir = current.parent / "logs"
            else:
                # Assume we're at project root
                log_dir = current / "logs"
    else:
        log_dir = Path(log_dir)
        # If relative path provided, resolve it properly
        if not log_dir.is_absolute():
            current = Path.cwd()
            if current.name == "backend":
                log_dir = current.parent / log_dir
            else:
                log_dir = current / log_dir
    
    # Create log directory if it doesn't exist
    try:
        log_dir.mkdir(parents=True, exist_ok=True)
    except (PermissionError, OSError) as e:
        # Fallback: use logs in current directory if possible
        # Log the error but don't fail completely
        print(f"Warning: Could not create log directory at {log_dir}: {e}", file=sys.stderr)
        # Try fallback to backend/logs only as last resort
        try:
            backend_dir = Path(__file__).parent
            log_dir = backend_dir / "logs"
            log_dir.mkdir(parents=True, exist_ok=True)
            print(f"Using fallback log directory: {log_dir}", file=sys.stderr)
        except Exception:
            # If even fallback fails, continue without file logging
            print("Warning: Could not create any log directory. File logging disabled.", file=sys.stderr)
            enable_file_logging = False
    
    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Clear any existing handlers
    root_logger.handlers.clear()
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    console_formatter = logging.Formatter(
        fmt='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
        datefmt='%H:%M:%S'
    )
    
    # File handler for all logs (with datewise rotation)
    if enable_file_logging:
        # Main application log - rotates daily at midnight
        app_log_file = log_dir / "app.log"
        app_file_handler = logging.handlers.TimedRotatingFileHandler(
            app_log_file,
            when='midnight',
            interval=1,
            backupCount=1,  # Keep 1 days of logs
            encoding='utf-8',
            utc=False
        )
        app_file_handler.setLevel(logging.DEBUG)
        app_file_handler.setFormatter(detailed_formatter)
        app_file_handler.suffix = "%Y-%m-%d"  # Format: app.log.2024-10-30
        root_logger.addHandler(app_file_handler)
        
        # Error log (only errors and above) - rotates daily at midnight
        error_log_file = log_dir / "error.log"
        error_file_handler = logging.handlers.TimedRotatingFileHandler(
            error_log_file,
            when='midnight',
            interval=1,
            backupCount=1,  # Keep 1 days of error logs
            encoding='utf-8',
            utc=False
        )
        error_file_handler.setLevel(logging.ERROR)
        error_file_handler.setFormatter(detailed_formatter)
        error_file_handler.suffix = "%Y-%m-%d"  # Format: error.log.2024-10-30
        root_logger.addHandler(error_file_handler)
    
    # Console handler
    if enable_console_logging:
        console_handler = logging.StreamHandler()
        console_handler.setLevel(level)
        console_handler.setFormatter(console_formatter)
        root_logger.addHandler(console_handler)
    
    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    
    return root_logger


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module
    
    Args:
        name: Logger name (usually __name__ of runner)
    
    Returns:
        Logger instance
    """
    return logging.getLogger(name)


# Initialize logging on module import
setup_logging()

