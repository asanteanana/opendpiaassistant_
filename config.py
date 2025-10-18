"""
Root configuration file for Open DPIA Assistant
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Import backend config
import sys
sys.path.insert(0, str(BASE_DIR / "backend"))

from backend.config import *

# Additional global configuration
PROJECT_NAME = "Open DPIA Assistant"
VERSION = "1.0.0"
DESCRIPTION = "An open-source tool for conducting Data Protection Impact Assessments (DPIAs) in compliance with GDPR Article 35"

# Environment
ENV = os.getenv("ENV", "development")
DEBUG = ENV == "development"

# Frontend URL
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Backend URL
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

