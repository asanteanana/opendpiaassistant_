"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class AssessmentStatus(str, Enum):
    """Assessment status"""
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class RiskLevel(str, Enum):
    """Risk level"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MitigationStatus(str, Enum):
    """Mitigation status"""
    PROPOSED = "proposed"
    IMPLEMENTED = "implemented"
    REJECTED = "rejected"


# Mitigation schemas
class MitigationBase(BaseModel):
    description: str
    gdpr_article: Optional[str] = None
    priority: Optional[str] = "medium"


class MitigationCreate(MitigationBase):
    response_id: str


class MitigationUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[MitigationStatus] = None
    gdpr_article: Optional[str] = None
    priority: Optional[str] = None


class MitigationResponse(MitigationBase):
    id: str
    response_id: str
    status: MitigationStatus
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Response schemas
class ResponseBase(BaseModel):
    question_id: str
    category: Optional[str] = None
    answer: Dict[str, Any]
    notes: Optional[str] = None


class ResponseCreate(ResponseBase):
    assessment_id: str


class ResponseUpdate(BaseModel):
    answer: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class ResponseResponse(ResponseBase):
    id: str
    assessment_id: str
    risk_score: float
    created_at: datetime
    updated_at: Optional[datetime]
    mitigations: List[MitigationResponse] = []

    class Config:
        from_attributes = True


# Assessment schemas
class AssessmentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    organization: str = Field(..., min_length=1, max_length=255)


class AssessmentCreate(AssessmentBase):
    pass


class AssessmentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    organization: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[AssessmentStatus] = None


class AssessmentResponse(AssessmentBase):
    id: str
    status: AssessmentStatus
    overall_risk_level: Optional[RiskLevel]
    overall_risk_score: float
    created_at: datetime
    updated_at: Optional[datetime]
    responses: List[ResponseResponse] = []

    class Config:
        from_attributes = True


class AssessmentListResponse(AssessmentBase):
    id: str
    status: AssessmentStatus
    overall_risk_level: Optional[RiskLevel]
    overall_risk_score: float
    created_at: datetime
    updated_at: Optional[datetime]
    response_count: int = 0

    class Config:
        from_attributes = True


# Risk summary schema
class RiskSummary(BaseModel):
    overall_risk_level: RiskLevel
    overall_risk_score: float
    category_scores: Dict[str, float]
    high_risk_areas: List[str]
    recommendations: List[str]


# Question schemas
class QuestionOption(BaseModel):
    value: str
    label: str
    risk_weight: Optional[float] = 0.0


class Question(BaseModel):
    id: str
    text: str
    type: str  # text, select, multi-select, radio, textarea, number
    category: str
    options: Optional[List[QuestionOption]] = None
    risk_weight: float = 0.5
    gdpr_articles: List[str] = []
    help_text: Optional[str] = None
    required: bool = True


class QuestionCategory(BaseModel):
    id: str
    title: str
    description: str
    questions: List[Question]


class QuestionsResponse(BaseModel):
    categories: List[QuestionCategory]


# GDPR Article schema
class GDPRArticle(BaseModel):
    number: str
    title: str
    summary: str
    full_text: Optional[str] = None
    relevance: Optional[str] = None

