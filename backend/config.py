"""
Configuration settings for Open DPIA Assistant
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dpia_assistant.db")

# CORS settings
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Risk calculation weights
RISK_WEIGHTS = {
    "data_sensitivity": 0.25,
    "data_volume": 0.15,
    "data_subjects": 0.20,
    "processing_purpose": 0.15,
    "third_parties": 0.10,
    "security_measures": 0.15,
}

# Risk level thresholds
RISK_THRESHOLDS = {
    "low": 0.3,
    "medium": 0.6,
    "high": 0.8,
    "critical": 1.0,
}

# File paths
QUESTIONS_FILE = BASE_DIR / "data" / "questions.json"
GDPR_ARTICLES_FILE = BASE_DIR / "data" / "gdpr_articles.json"

# Export settings
EXPORT_DIR = BASE_DIR / "exports"
EXPORT_DIR.mkdir(exist_ok=True)

