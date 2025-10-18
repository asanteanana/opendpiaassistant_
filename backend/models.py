"""
Database models for Open DPIA Assistant
"""
from sqlalchemy import Column, String, Text, DateTime, Float, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db import Base
import uuid
import enum


class AssessmentStatus(str, enum.Enum):
    """Assessment status enum"""
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class RiskLevel(str, enum.Enum):
    """Risk level enum"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MitigationStatus(str, enum.Enum):
    """Mitigation status enum"""
    PROPOSED = "proposed"
    IMPLEMENTED = "implemented"
    REJECTED = "rejected"


class Assessment(Base):
    """Assessment model"""
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    organization = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    status = Column(Enum(AssessmentStatus), default=AssessmentStatus.DRAFT)
    overall_risk_level = Column(Enum(RiskLevel), nullable=True)
    overall_risk_score = Column(Float, default=0.0)

    # Relationships
    responses = relationship("Response", back_populates="assessment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Assessment {self.title}>"


class Response(Base):
    """Response model for storing answers to questions"""
    __tablename__ = "responses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String(36), ForeignKey("assessments.id"), nullable=False)
    question_id = Column(String(50), nullable=False)
    category = Column(String(100))
    answer = Column(JSON, nullable=False)  # Stores the actual answer data
    risk_score = Column(Float, default=0.0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    assessment = relationship("Assessment", back_populates="responses")
    mitigations = relationship("Mitigation", back_populates="response", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Response {self.question_id}>"


class Mitigation(Base):
    """Mitigation measures for responses"""
    __tablename__ = "mitigations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    response_id = Column(String(36), ForeignKey("responses.id"), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(MitigationStatus), default=MitigationStatus.PROPOSED)
    gdpr_article = Column(String(50))
    priority = Column(String(20))  # low, medium, high
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    response = relationship("Response", back_populates="mitigations")

    def __repr__(self):
        return f"<Mitigation {self.id}>"

