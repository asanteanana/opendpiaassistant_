/**
 * API client for Open DPIA Assistant
 */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Assessment API
export const assessmentApi = {
    create: (data: AssessmentCreate) => api.post('/assessments', data),
    list: (params?: AssessmentListParams) => api.get('/assessments', { params }),
    get: (id: string) => api.get(`/assessments/${id}`),
    update: (id: string, data: AssessmentUpdate) => api.put(`/assessments/${id}`, data),
    delete: (id: string) => api.delete(`/assessments/${id}`),
    getRiskSummary: (id: string) => api.get(`/assessments/${id}/risk-summary`),
    exportPDF: (id: string) => api.get(`/assessments/${id}/export/pdf`, { responseType: 'blob' }),
    exportJSON: (id: string) => api.get(`/assessments/${id}/export/json`, { responseType: 'blob' }),
};

// Response API
export const responseApi = {
    create: (assessmentId: string, data: ResponseCreate) =>
        api.post(`/assessments/${assessmentId}/responses`, data),
    list: (assessmentId: string) => api.get(`/assessments/${assessmentId}/responses`),
    update: (id: string, data: ResponseUpdate) => api.put(`/responses/${id}`, data),
};

// Mitigation API
export const mitigationApi = {
    create: (data: MitigationCreate) => api.post('/mitigations', data),
    update: (id: string, data: MitigationUpdate) => api.put(`/mitigations/${id}`, data),
};

// Questions API
export const questionsApi = {
    getAll: () => api.get('/questions'),
    getByCategory: (category: string) => api.get(`/questions/${category}`),
};

// GDPR Articles API
export const gdprApi = {
    getAll: () => api.get('/gdpr-articles'),
    get: (articleNumber: string) => api.get(`/gdpr-articles/${articleNumber}`),
};

// Types
export interface AssessmentCreate {
    title: string;
    description?: string;
    organization: string;
}

export interface AssessmentUpdate {
    title?: string;
    description?: string;
    organization?: string;
    status?: 'draft' | 'in_progress' | 'completed';
}

export interface AssessmentListParams {
    status?: string;
    risk_level?: string;
    skip?: number;
    limit?: number;
}

export interface ResponseCreate {
    question_id: string;
    category?: string;
    answer: Record<string, any>;
    notes?: string;
}

export interface ResponseUpdate {
    answer?: Record<string, any>;
    notes?: string;
}

export interface MitigationCreate {
    response_id: string;
    description: string;
    gdpr_article?: string;
    priority?: string;
}

export interface MitigationUpdate {
    description?: string;
    status?: 'proposed' | 'implemented' | 'rejected';
    gdpr_article?: string;
    priority?: string;
}

