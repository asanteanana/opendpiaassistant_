"""
Export functionality for generating PDF and JSON reports
"""
import json
from datetime import datetime
from typing import Dict, Any
from pathlib import Path
from config import EXPORT_DIR


def export_to_json(assessment_data: Dict[str, Any]) -> str:
    """
    Export assessment to JSON format
    Returns path to the exported file
    """
    # Prepare export data
    export_data = {
        "export_date": datetime.now().isoformat(),
        "assessment": {
            "id": assessment_data.get("id"),
            "title": assessment_data.get("title"),
            "description": assessment_data.get("description"),
            "organization": assessment_data.get("organization"),
            "status": assessment_data.get("status"),
            "overall_risk_level": assessment_data.get("overall_risk_level"),
            "overall_risk_score": assessment_data.get("overall_risk_score"),
            "created_at": assessment_data.get("created_at"),
            "updated_at": assessment_data.get("updated_at"),
        },
        "responses": assessment_data.get("responses", []),
        "risk_summary": assessment_data.get("risk_summary", {}),
    }
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"dpia_assessment_{assessment_data.get('id')}_{timestamp}.json"
    filepath = EXPORT_DIR / filename
    
    # Write to file
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, default=str)
    
    return str(filepath)


def export_to_pdf(assessment_data: Dict[str, Any]) -> str:
    """
    Export assessment to PDF format
    Returns path to the exported file
    
    Note: This is a simplified version. For production, use libraries like:
    - ReportLab
    - WeasyPrint
    - xhtml2pdf
    """
    try:
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    except ImportError:
        # Fallback: create a simple HTML file if ReportLab is not available
        return _export_to_html(assessment_data)
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"dpia_assessment_{assessment_data.get('id')}_{timestamp}.pdf"
    filepath = EXPORT_DIR / filename
    
    # Create PDF
    doc = SimpleDocTemplate(str(filepath), pagesize=A4)
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#2d2d2d'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    # Title page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("Data Protection Impact Assessment", title_style))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph(f"<b>{assessment_data.get('title', 'Untitled Assessment')}</b>", styles['Heading2']))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(f"Organization: {assessment_data.get('organization', 'N/A')}", styles['Normal']))
    story.append(Paragraph(f"Date: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
    story.append(PageBreak())
    
    # Executive Summary
    story.append(Paragraph("Executive Summary", heading_style))
    story.append(Paragraph(assessment_data.get('description', 'No description provided.'), styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    # Risk Summary
    risk_level = assessment_data.get('overall_risk_level', 'N/A').upper()
    risk_score = assessment_data.get('overall_risk_score', 0)
    
    risk_color = {
        'LOW': colors.green,
        'MEDIUM': colors.orange,
        'HIGH': colors.orangered,
        'CRITICAL': colors.red
    }.get(risk_level, colors.gray)
    
    story.append(Paragraph("Risk Assessment", heading_style))
    
    risk_data = [
        ['Risk Level', 'Risk Score', 'Status'],
        [risk_level, f"{risk_score:.2f}", assessment_data.get('status', 'N/A')]
    ]
    
    risk_table = Table(risk_data, colWidths=[2*inch, 2*inch, 2*inch])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(risk_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Responses section
    responses = assessment_data.get('responses', [])
    if responses:
        story.append(PageBreak())
        story.append(Paragraph("Assessment Responses", heading_style))
        
        for idx, response in enumerate(responses, 1):
            story.append(Paragraph(f"<b>Question {idx}:</b> {response.get('question_id', 'N/A')}", styles['Normal']))
            story.append(Paragraph(f"Answer: {json.dumps(response.get('answer', 'N/A'))}", styles['Normal']))
            story.append(Paragraph(f"Risk Score: {response.get('risk_score', 0):.2f}", styles['Normal']))
            if response.get('notes'):
                story.append(Paragraph(f"Notes: {response.get('notes')}", styles['Normal']))
            story.append(Spacer(1, 0.15*inch))
    
    # Build PDF
    doc.build(story)
    
    return str(filepath)


def _export_to_html(assessment_data: Dict[str, Any]) -> str:
    """
    Fallback HTML export if PDF libraries are not available
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"dpia_assessment_{assessment_data.get('id')}_{timestamp}.html"
    filepath = EXPORT_DIR / filename
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>DPIA Assessment - {assessment_data.get('title')}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #2c3e50; }}
            h2 {{ color: #34495e; margin-top: 30px; }}
            .risk-badge {{ 
                display: inline-block;
                padding: 5px 15px;
                border-radius: 5px;
                font-weight: bold;
            }}
            .risk-low {{ background-color: #2ecc71; color: white; }}
            .risk-medium {{ background-color: #f39c12; color: white; }}
            .risk-high {{ background-color: #e74c3c; color: white; }}
            .risk-critical {{ background-color: #c0392b; color: white; }}
            .response {{ margin: 20px 0; padding: 15px; background-color: #ecf0f1; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <h1>Data Protection Impact Assessment</h1>
        <h2>{assessment_data.get('title')}</h2>
        <p><strong>Organization:</strong> {assessment_data.get('organization')}</p>
        <p><strong>Date:</strong> {datetime.now().strftime('%B %d, %Y')}</p>
        
        <h2>Risk Assessment</h2>
        <p>
            <strong>Risk Level:</strong> 
            <span class="risk-badge risk-{assessment_data.get('overall_risk_level', 'low')}">
                {assessment_data.get('overall_risk_level', 'N/A').upper()}
            </span>
        </p>
        <p><strong>Risk Score:</strong> {assessment_data.get('overall_risk_score', 0):.2f}</p>
        
        <h2>Description</h2>
        <p>{assessment_data.get('description', 'No description provided.')}</p>
        
        <h2>Responses</h2>
        {"".join(f'''
        <div class="response">
            <p><strong>Question:</strong> {r.get('question_id')}</p>
            <p><strong>Answer:</strong> {json.dumps(r.get('answer'))}</p>
            <p><strong>Risk Score:</strong> {r.get('risk_score', 0):.2f}</p>
            {f"<p><strong>Notes:</strong> {r.get('notes')}</p>" if r.get('notes') else ""}
        </div>
        ''' for r in assessment_data.get('responses', []))}
    </body>
    </html>
    """
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    return str(filepath)

