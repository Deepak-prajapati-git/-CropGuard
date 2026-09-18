// ─── Core Types ─────────────────────────────────────────────────────────────

export type Severity = 'Healthy' | 'Low' | 'Moderate' | 'High' | 'Critical';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type CropName = 'Tomato' | 'Potato' | 'Rice' | 'Wheat' | 'Maize' | 'Cotton' | 'Chili';

export type FieldHealthStatus = 'Healthy' | 'Attention Needed' | 'At Risk' | 'Critical';

// ─── Analysis ────────────────────────────────────────────────────────────────

export interface AnalysisResult {
  id: string;
  crop: CropName;
  disease: string;
  confidence: number; // 0–1
  severity: Severity;
  symptoms: string[];
  recommendations: string[];
  prevention: string[];
  similarConditions: SimilarCondition[];
  modelMode: 'demo' | 'prototype';
  analyzedAt: string; // ISO date string
  imageDataUrl?: string;
  imageFileName?: string;
  imageSize?: number;
  imageQuality?: ImageQualityStatus;
  fieldId?: string;
  fieldName?: string;
  notes?: string;
  saved?: boolean;
}

export interface SimilarCondition {
  name: string;
  description: string;
}

export type ImageQualityStatus = 'good' | 'low-light' | 'blurry' | 'too-small' | 'too-far' | 'ready';

export interface ImageQualityResult {
  status: ImageQualityStatus;
  label: string;
  description: string;
  suggestion: string;
  canContinue: boolean;
}

// ─── Fields ──────────────────────────────────────────────────────────────────

export interface Field {
  id: string;
  name: string;
  crop: CropName;
  area: string;
  plantingDate?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  healthStatus: FieldHealthStatus;
  lastAnalyzedAt?: string;
  detectionCount: number;
  analysisIds: string[];
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
  fieldId?: string;
  analysisId?: string;
}

// ─── Library ─────────────────────────────────────────────────────────────────

export interface DiseaseEntry {
  id: string;
  name: string;
  crop: CropName;
  shortDescription: string;
  symptoms: string[];
  conditions: string[];
  prevention: string[];
  expertAdvice: string;
  imageUrl?: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface UserSettings {
  name: string;
  region: string;
  language: string;
  units: 'metric' | 'imperial';
  notifications: boolean;
  demoMode: boolean;
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface AppState {
  analyses: AnalysisResult[];
  fields: Field[];
  notifications: Notification[];
  settings: UserSettings;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
