/**
 * TypeScript type definitions for Open DPIA Assistant
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AssessmentStatus = 'draft' | 'in_progress' | 'completed';
export type MitigationStatus = 'proposed' | 'implemented' | 'rejected';

export interface Assessment {
    id: string;
    title: string;
    description?: string;
    organization: string;
    status: AssessmentStatus;
    overall_risk_level?: RiskLevel;
    overall_risk_score: number;
    created_at: string;
    updated_at?: string;
    responses?: Response[];
    response_count?: number;
}

export interface Response {
    id: string;
    assessment_id: string;
    question_id: string;
    category?: string;
    answer: Record<string, any>;
    risk_score: number;
    notes?: string;
    created_at: string;
    updated_at?: string;
    mitigations?: Mitigation[];
}

export interface Mitigation {
    id: string;
    response_id: string;
    description: string;
    status: MitigationStatus;
    gdpr_article?: string;
    priority?: string;
    created_at: string;
    updated_at?: string;
}

export interface QuestionOption {
    value: string;
    label: string;
    risk_weight?: number;
}

export interface Question {
    id: string;
    text: string;
    type: 'text' | 'textarea' | 'select' | 'multi-select' | 'radio' | 'number';
    category: string;
    options?: QuestionOption[];
    risk_weight: number;
    gdpr_articles: string[];
    help_text?: string;
    required: boolean;
}

export interface QuestionCategory {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

export interface QuestionsData {
    categories: QuestionCategory[];
}

export interface RiskSummary {
    overall_risk_level: RiskLevel;
    overall_risk_score: number;
    category_scores: Record<string, number>;
    high_risk_areas: string[];
    recommendations: string[];
}

export interface GDPRArticle {
    number: string;
    title: string;
    summary: string;
    full_text?: string;
    relevance?: string;
}

