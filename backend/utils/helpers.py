"""
Helper functions for data loading and processing
"""
import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from config import QUESTIONS_FILE, GDPR_ARTICLES_FILE


def load_json_file(file_path: Path) -> Dict[str, Any]:
    """Load JSON file"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}


def load_questions() -> Dict[str, Any]:
    """Load questions from JSON file"""
    return load_json_file(QUESTIONS_FILE)


def load_gdpr_articles() -> Dict[str, Any]:
    """Load GDPR articles from JSON file"""
    return load_json_file(GDPR_ARTICLES_FILE)


def get_question_by_id(question_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific question by ID"""
    questions_data = load_questions()
    
    for category in questions_data.get("categories", []):
        for question in category.get("questions", []):
            if question.get("id") == question_id:
                return {
                    **question,
                    "category": category.get("id")
                }
    
    return None


def get_category_questions(category_id: str) -> List[Dict[str, Any]]:
    """Get all questions for a specific category"""
    questions_data = load_questions()
    
    for category in questions_data.get("categories", []):
        if category.get("id") == category_id:
            return category.get("questions", [])
    
    return []


def get_gdpr_article(article_number: str) -> Optional[Dict[str, Any]]:
    """Get a specific GDPR article by number"""
    gdpr_data = load_gdpr_articles()
    
    for article in gdpr_data.get("articles", []):
        if article.get("number") == article_number:
            return article
    
    return None


def validate_answer(question: Dict[str, Any], answer: Any) -> bool:
    """Validate answer based on question type"""
    question_type = question.get("type")
    
    if question.get("required") and not answer:
        return False
    
    if question_type == "multi-select":
        return isinstance(answer, list)
    elif question_type == "number":
        return isinstance(answer, (int, float))
    elif question_type in ["text", "textarea", "select", "radio"]:
        return isinstance(answer, str)
    
    return True

