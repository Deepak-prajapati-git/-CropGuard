import type { AnalysisResult, AppState, Field, Notification, UserSettings } from '../types';
import { SEED_ANALYSES, SEED_FIELDS, SEED_NOTIFICATIONS } from './data';

const STORAGE_KEY = 'cropguard_data';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Ravi',
  region: 'Nashik region, Maharashtra',
  language: 'English',
  units: 'metric',
  notifications: true,
  demoMode: true,
};

function getDefaultState(): AppState {
  return {
    analyses: SEED_ANALYSES,
    fields: SEED_FIELDS,
    notifications: SEED_NOTIFICATIONS,
    settings: DEFAULT_SETTINGS,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultState = getDefaultState();
      saveState(defaultState);
      return defaultState;
    }
    return JSON.parse(raw) as AppState;
  } catch {
    const defaultState = getDefaultState();
    saveState(defaultState);
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('CropGuard: Failed to persist state to localStorage.', e);
  }
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export function getAnalyses(): AnalysisResult[] {
  return loadState().analyses;
}

export function getAnalysisById(id: string): AnalysisResult | undefined {
  return loadState().analyses.find(a => a.id === id);
}

export function saveAnalysis(analysis: AnalysisResult): void {
  const state = loadState();
  const existing = state.analyses.findIndex(a => a.id === analysis.id);
  if (existing >= 0) {
    state.analyses[existing] = analysis;
  } else {
    state.analyses.unshift(analysis);
  }
  // Update field if linked
  if (analysis.fieldId) {
    const field = state.fields.find(f => f.id === analysis.fieldId);
    if (field) {
      if (!field.analysisIds.includes(analysis.id)) {
        field.analysisIds.unshift(analysis.id);
        field.detectionCount = field.analysisIds.length;
      }
      field.lastAnalyzedAt = analysis.analyzedAt;
      if (analysis.severity === 'Critical' || analysis.severity === 'High') {
        field.healthStatus = 'At Risk';
      } else if (analysis.severity === 'Moderate') {
        field.healthStatus = 'Attention Needed';
      }
    }
  }
  saveState(state);
}

export function deleteAnalysis(id: string): void {
  const state = loadState();
  state.analyses = state.analyses.filter(a => a.id !== id);
  state.fields.forEach(f => {
    f.analysisIds = f.analysisIds.filter(aid => aid !== id);
    f.detectionCount = f.analysisIds.length;
  });
  saveState(state);
}

// ─── Fields ───────────────────────────────────────────────────────────────────

export function getFields(): Field[] {
  return loadState().fields;
}

export function getFieldById(id: string): Field | undefined {
  return loadState().fields.find(f => f.id === id);
}

export function saveField(field: Field): void {
  const state = loadState();
  const existing = state.fields.findIndex(f => f.id === field.id);
  if (existing >= 0) {
    state.fields[existing] = field;
  } else {
    state.fields.unshift(field);
  }
  saveState(state);
}

export function deleteField(id: string): void {
  const state = loadState();
  state.fields = state.fields.filter(f => f.id !== id);
  saveState(state);
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function getNotifications(): Notification[] {
  return loadState().notifications;
}

export function markNotificationRead(id: string): void {
  const state = loadState();
  const n = state.notifications.find(n => n.id === id);
  if (n) n.read = true;
  saveState(state);
}

export function markAllNotificationsRead(): void {
  const state = loadState();
  state.notifications.forEach(n => { n.read = true; });
  saveState(state);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function getSettings(): UserSettings {
  return loadState().settings;
}

export function saveSettings(settings: UserSettings): void {
  const state = loadState();
  state.settings = settings;
  saveState(state);
}

// ─── Clear Data ───────────────────────────────────────────────────────────────

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
