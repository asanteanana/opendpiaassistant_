"""
Main FastAPI application for Open DPIA Assistant
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from db import get_db, init_db
from models import Assessment, Response, Mitigation, AssessmentStatus, RiskLevel
from schemas import (
    AssessmentCreate,
    AssessmentUpdate,
    AssessmentResponse,
    AssessmentListResponse,
    ResponseCreate,
    ResponseUpdate,
    ResponseResponse,
    MitigationCreate,
    MitigationUpdate,
    MitigationResponse,
    RiskSummary,
    QuestionsResponse,
    GDPRArticle,
)
from config import CORS_ORIGINS
from utils import (
    calculate_response_risk_score,
    calculate_assessment_risk,
    determine_risk_level,
    export_to_pdf,
    export_to_json,
    load_questions,
    load_gdpr_articles,
    get_question_by_id,
)

# Initialize FastAPI app
app = FastAPI(
    title="Open DPIA Assistant API",
    description="API for conducting Data Protection Impact Assessments",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables"""
    init_db()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Open DPIA Assistant API",
        "version": "1.0.0",
        "docs": "/docs",
    }


# ============================================================================
# Assessment Endpoints
# ============================================================================

@app.post("/api/assessments", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment: AssessmentCreate,
    db: Session = Depends(get_db)
):
    """Create a new assessment"""
    db_assessment = Assessment(
        title=assessment.title,
        description=assessment.description,
        organization=assessment.organization,
        status=AssessmentStatus.DRAFT,
    )
    
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    
    return db_assessment


@app.get("/api/assessments", response_model=List[AssessmentListResponse])
async def list_assessments(
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all assessments with optional filters"""
    query = db.query(Assessment)
    
    if status:
        query = query.filter(Assessment.status == status)
    
    if risk_level:
        query = query.filter(Assessment.overall_risk_level == risk_level)
    
    assessments = query.offset(skip).limit(limit).all()
    
    # Add response count to each assessment
    result = []
    for assessment in assessments:
        assessment_dict = AssessmentListResponse.from_orm(assessment).dict()
        assessment_dict["response_count"] = len(assessment.responses)
        result.append(assessment_dict)
    
    return result


@app.get("/api/assessments/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific assessment by ID"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    return assessment


@app.put("/api/assessments/{assessment_id}", response_model=AssessmentResponse)
async def update_assessment(
    assessment_id: str,
    assessment_update: AssessmentUpdate,
    db: Session = Depends(get_db)
):
    """Update an assessment"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Update fields
    update_data = assessment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assessment, field, value)
    
    db.commit()
    db.refresh(assessment)
    
    return assessment


@app.delete("/api/assessments/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Delete an assessment"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    db.delete(assessment)
    db.commit()
    
    return None


@app.get("/api/assessments/{assessment_id}/risk-summary", response_model=RiskSummary)
async def get_risk_summary(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Get risk summary for an assessment"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Get all responses
    responses = [
        {
            "question_id": r.question_id,
            "category": r.category,
            "answer": r.answer,
            "risk_score": r.risk_score,
        }
        for r in assessment.responses
    ]
    
    # Calculate risk
    risk_analysis = calculate_assessment_risk(responses)
    
    # Update assessment with calculated risk
    assessment.overall_risk_score = risk_analysis["overall_risk_score"]
    assessment.overall_risk_level = RiskLevel(risk_analysis["overall_risk_level"])
    db.commit()
    
    return risk_analysis


# ============================================================================
# Response Endpoints
# ============================================================================

@app.post("/api/assessments/{assessment_id}/responses", response_model=ResponseResponse, status_code=status.HTTP_201_CREATED)
async def create_response(
    assessment_id: str,
    response: ResponseCreate,
    db: Session = Depends(get_db)
):
    """Submit a response to a question"""
    # Verify assessment exists
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Get question data
    question_data = get_question_by_id(response.question_id)
    
    if not question_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Calculate risk score
    risk_score = calculate_response_risk_score(
        response.question_id,
        response.answer,
        question_data
    )
    
    # Check if response already exists
    existing_response = db.query(Response).filter(
        Response.assessment_id == assessment_id,
        Response.question_id == response.question_id
    ).first()
    
    if existing_response:
        # Update existing response
        existing_response.answer = response.answer
        existing_response.notes = response.notes
        existing_response.risk_score = risk_score
        existing_response.category = question_data.get("category")
        db.commit()
        db.refresh(existing_response)
        return existing_response
    
    # Create new response
    db_response = Response(
        assessment_id=assessment_id,
        question_id=response.question_id,
        category=question_data.get("category"),
        answer=response.answer,
        risk_score=risk_score,
        notes=response.notes,
    )
    
    db.add(db_response)
    
    # Update assessment status
    if assessment.status == AssessmentStatus.DRAFT:
        assessment.status = AssessmentStatus.IN_PROGRESS
    
    db.commit()
    db.refresh(db_response)
    
    return db_response


@app.get("/api/assessments/{assessment_id}/responses", response_model=List[ResponseResponse])
async def get_responses(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Get all responses for an assessment"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    return assessment.responses


@app.put("/api/responses/{response_id}", response_model=ResponseResponse)
async def update_response(
    response_id: str,
    response_update: ResponseUpdate,
    db: Session = Depends(get_db)
):
    """Update a response"""
    response = db.query(Response).filter(Response.id == response_id).first()
    
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found"
        )
    
    # Update fields
    if response_update.answer is not None:
        response.answer = response_update.answer
        
        # Recalculate risk score
        question_data = get_question_by_id(response.question_id)
        if question_data:
            response.risk_score = calculate_response_risk_score(
                response.question_id,
                response_update.answer,
                question_data
            )
    
    if response_update.notes is not None:
        response.notes = response_update.notes
    
    db.commit()
    db.refresh(response)
    
    return response


# ============================================================================
# Mitigation Endpoints
# ============================================================================

@app.post("/api/mitigations", response_model=MitigationResponse, status_code=status.HTTP_201_CREATED)
async def create_mitigation(
    mitigation: MitigationCreate,
    db: Session = Depends(get_db)
):
    """Create a mitigation measure"""
    # Verify response exists
    response = db.query(Response).filter(Response.id == mitigation.response_id).first()
    
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found"
        )
    
    db_mitigation = Mitigation(
        response_id=mitigation.response_id,
        description=mitigation.description,
        gdpr_article=mitigation.gdpr_article,
        priority=mitigation.priority,
    )
    
    db.add(db_mitigation)
    db.commit()
    db.refresh(db_mitigation)
    
    return db_mitigation


@app.put("/api/mitigations/{mitigation_id}", response_model=MitigationResponse)
async def update_mitigation(
    mitigation_id: str,
    mitigation_update: MitigationUpdate,
    db: Session = Depends(get_db)
):
    """Update a mitigation measure"""
    mitigation = db.query(Mitigation).filter(Mitigation.id == mitigation_id).first()
    
    if not mitigation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mitigation not found"
        )
    
    # Update fields
    update_data = mitigation_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(mitigation, field, value)
    
    db.commit()
    db.refresh(mitigation)
    
    return mitigation


# ============================================================================
# Questions & GDPR Articles Endpoints
# ============================================================================

@app.get("/api/questions", response_model=QuestionsResponse)
async def get_questions():
    """Get all questions"""
    questions_data = load_questions()
    return questions_data


@app.get("/api/questions/{category}")
async def get_questions_by_category(category: str):
    """Get questions by category"""
    questions_data = load_questions()
    
    for cat in questions_data.get("categories", []):
        if cat.get("id") == category:
            return cat
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Category not found"
    )


@app.get("/api/gdpr-articles", response_model=List[GDPRArticle])
async def get_gdpr_articles():
    """Get all GDPR articles"""
    gdpr_data = load_gdpr_articles()
    return gdpr_data.get("articles", [])


@app.get("/api/gdpr-articles/{article_number}", response_model=GDPRArticle)
async def get_gdpr_article(article_number: str):
    """Get a specific GDPR article"""
    gdpr_data = load_gdpr_articles()
    
    for article in gdpr_data.get("articles", []):
        if article.get("number") == article_number:
            return article
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Article not found"
    )


# ============================================================================
# Export Endpoints
# ============================================================================

@app.get("/api/assessments/{assessment_id}/export/pdf")
async def export_assessment_pdf(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Export assessment as PDF"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Prepare assessment data
    assessment_data = {
        "id": assessment.id,
        "title": assessment.title,
        "description": assessment.description,
        "organization": assessment.organization,
        "status": assessment.status.value,
        "overall_risk_level": assessment.overall_risk_level.value if assessment.overall_risk_level else "low",
        "overall_risk_score": assessment.overall_risk_score,
        "created_at": assessment.created_at,
        "updated_at": assessment.updated_at,
        "responses": [
            {
                "question_id": r.question_id,
                "answer": r.answer,
                "risk_score": r.risk_score,
                "notes": r.notes,
            }
            for r in assessment.responses
        ],
    }
    
    # Generate PDF
    filepath = export_to_pdf(assessment_data)
    
    # Return file
    if os.path.exists(filepath):
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename=os.path.basename(filepath)
        )
    
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to generate PDF"
    )


@app.get("/api/assessments/{assessment_id}/export/json")
async def export_assessment_json(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Export assessment as JSON"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Prepare assessment data
    assessment_data = {
        "id": assessment.id,
        "title": assessment.title,
        "description": assessment.description,
        "organization": assessment.organization,
        "status": assessment.status.value,
        "overall_risk_level": assessment.overall_risk_level.value if assessment.overall_risk_level else "low",
        "overall_risk_score": assessment.overall_risk_score,
        "created_at": str(assessment.created_at),
        "updated_at": str(assessment.updated_at),
        "responses": [
            {
                "question_id": r.question_id,
                "answer": r.answer,
                "risk_score": r.risk_score,
                "notes": r.notes,
            }
            for r in assessment.responses
        ],
    }
    
    # Generate JSON
    filepath = export_to_json(assessment_data)
    
    # Return file
    if os.path.exists(filepath):
        return FileResponse(
            filepath,
            media_type="application/json",
            filename=os.path.basename(filepath)
        )
    
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to generate JSON"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

