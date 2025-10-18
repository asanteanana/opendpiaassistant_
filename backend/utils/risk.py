"""
Risk calculation and assessment logic
"""
from typing import Dict, List, Any, Tuple
from config import RISK_WEIGHTS, RISK_THRESHOLDS
from .helpers import get_question_by_id


def calculate_response_risk_score(
    question_id: str,
    answer: Any,
    question_data: Dict[str, Any] = None
) -> float:
    """
    Calculate risk score for a single response
    """
    if not question_data:
        question_data = get_question_by_id(question_id)
    
    if not question_data:
        return 0.0
    
    base_weight = question_data.get("risk_weight", 0.5)
    question_type = question_data.get("type")
    
    # Calculate score based on question type
    if question_type == "multi-select":
        if not isinstance(answer, list):
            return 0.0
        
        # Check if any high-risk options are selected
        options = question_data.get("options", [])
        selected_risk_weights = []
        
        for option in options:
            if option.get("value") in answer:
                selected_risk_weights.append(option.get("risk_weight", 0.5))
        
        if selected_risk_weights:
            # Take the average of selected risk weights
            option_risk = sum(selected_risk_weights) / len(selected_risk_weights)
            return base_weight * option_risk
        
        return 0.0
    
    elif question_type in ["select", "radio"]:
        # Find the selected option's risk weight
        options = question_data.get("options", [])
        
        for option in options:
            if option.get("value") == answer:
                option_risk = option.get("risk_weight", 0.5)
                return base_weight * option_risk
        
        return base_weight * 0.5
    
    elif question_type == "number":
        # Normalize number-based risk
        # This is a simplified approach - can be customized per question
        try:
            value = float(answer)
            # Normalize to 0-1 range (assuming 0-100 scale for most questions)
            normalized = min(value / 100, 1.0)
            return base_weight * normalized
        except (ValueError, TypeError):
            return 0.0
    
    elif question_type in ["text", "textarea"]:
        # For text responses, use default weight
        # Could implement NLP-based risk assessment here
        if answer and len(str(answer)) > 0:
            return base_weight * 0.5
        return 0.0
    
    return base_weight * 0.5


def calculate_category_risk(
    responses: List[Dict[str, Any]],
    category: str
) -> Tuple[float, List[str]]:
    """
    Calculate risk score for a specific category
    Returns: (risk_score, high_risk_questions)
    """
    category_responses = [r for r in responses if r.get("category") == category]
    
    if not category_responses:
        return 0.0, []
    
    total_score = sum(r.get("risk_score", 0.0) for r in category_responses)
    avg_score = total_score / len(category_responses)
    
    # Identify high-risk questions (score > 0.7)
    high_risk_questions = [
        r.get("question_id")
        for r in category_responses
        if r.get("risk_score", 0.0) > 0.7
    ]
    
    return avg_score, high_risk_questions


def calculate_assessment_risk(responses: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculate overall assessment risk from all responses
    Returns comprehensive risk analysis
    """
    if not responses:
        return {
            "overall_risk_score": 0.0,
            "overall_risk_level": "low",
            "category_scores": {},
            "high_risk_areas": [],
            "recommendations": []
        }
    
    # Calculate overall score
    total_score = sum(r.get("risk_score", 0.0) for r in responses)
    overall_score = total_score / len(responses)
    
    # Apply modifiers for high-risk scenarios
    special_category_data = any(
        "special category" in str(r.get("answer", "")).lower() or
        "sensitive" in str(r.get("answer", "")).lower()
        for r in responses
    )
    
    children_data = any(
        "child" in str(r.get("answer", "")).lower() or
        "minor" in str(r.get("answer", "")).lower()
        for r in responses
    )
    
    if special_category_data:
        overall_score *= 1.3
    
    if children_data:
        overall_score *= 1.2
    
    # Cap at 1.0
    overall_score = min(overall_score, 1.0)
    
    # Calculate category scores
    categories = set(r.get("category") for r in responses if r.get("category"))
    category_scores = {}
    high_risk_areas = []
    
    for category in categories:
        cat_score, high_risk_questions = calculate_category_risk(responses, category)
        category_scores[category] = cat_score
        
        if cat_score > 0.7:
            high_risk_areas.append(category)
    
    # Determine risk level
    risk_level = determine_risk_level(overall_score)
    
    # Generate recommendations
    recommendations = generate_recommendations(
        overall_score,
        category_scores,
        high_risk_areas,
        special_category_data,
        children_data
    )
    
    return {
        "overall_risk_score": round(overall_score, 3),
        "overall_risk_level": risk_level,
        "category_scores": {k: round(v, 3) for k, v in category_scores.items()},
        "high_risk_areas": high_risk_areas,
        "recommendations": recommendations
    }


def determine_risk_level(score: float) -> str:
    """
    Determine risk level based on score
    """
    if score < RISK_THRESHOLDS["low"]:
        return "low"
    elif score < RISK_THRESHOLDS["medium"]:
        return "medium"
    elif score < RISK_THRESHOLDS["high"]:
        return "high"
    else:
        return "critical"


def generate_recommendations(
    overall_score: float,
    category_scores: Dict[str, float],
    high_risk_areas: List[str],
    has_special_category: bool,
    has_children_data: bool
) -> List[str]:
    """
    Generate risk mitigation recommendations
    """
    recommendations = []
    
    if overall_score > 0.7:
        recommendations.append(
            "Overall risk is high. Consider conducting a thorough review with your DPO and legal team."
        )
    
    if has_special_category:
        recommendations.extend([
            "Processing special category data requires explicit consent or a legal basis under Article 9 GDPR.",
            "Implement enhanced security measures for special category data.",
            "Consider pseudonymization or anonymization where possible."
        ])
    
    if has_children_data:
        recommendations.extend([
            "Processing children's data requires parental consent (Article 8 GDPR).",
            "Implement age verification mechanisms.",
            "Provide clear, age-appropriate privacy notices."
        ])
    
    for category, score in category_scores.items():
        if score > 0.7:
            recommendations.append(
                f"High risk identified in '{category}'. Review and strengthen controls in this area."
            )
    
    if "data-security" in high_risk_areas:
        recommendations.extend([
            "Implement encryption for data at rest and in transit.",
            "Conduct regular security audits and penetration testing.",
            "Establish incident response procedures."
        ])
    
    if "data-sharing" in high_risk_areas or "third-parties" in high_risk_areas:
        recommendations.extend([
            "Ensure data processing agreements are in place with all third parties.",
            "Conduct due diligence on third-party processors.",
            "Implement Standard Contractual Clauses for international transfers."
        ])
    
    if not recommendations:
        recommendations.append(
            "Risk level is acceptable. Continue to monitor and review your data processing activities regularly."
        )
    
    return recommendations


def calculate_risk_score(responses: List[Dict[str, Any]]) -> float:
    """
    Legacy function for backward compatibility
    """
    result = calculate_assessment_risk(responses)
    return result["overall_risk_score"]

