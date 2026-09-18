import type { AnalysisResult, CropName, ImageQualityResult, Severity } from '../types';
import { DEMO_RESULTS } from './data';
import { generateId } from './storage';

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Main inference entry point.
 * This is a replaceable adapter — swap with a real ML API call by implementing
 * the same interface and returning the same AnalysisResult shape.
 */
export async function predictDisease(
  imageDataUrl: string,
  crop: CropName,
  isSampleImage: boolean = false
): Promise<AnalysisResult> {
  // Simulate network latency for staged loading experience
  await simulateAnalysisStages();

  const template = DEMO_RESULTS[crop];

  // For demo: deterministic results based on crop
  // For arbitrary uploads: slightly lower confidence to represent uncertainty
  const confidenceAdjustment = isSampleImage ? 0 : -0.08;
  const confidence = Math.max(0.45, Math.min(0.99, template.confidence + confidenceAdjustment + (Math.random() * 0.04 - 0.02)));

  return {
    id: generateId('analysis'),
    crop,
    disease: template.disease,
    confidence: parseFloat(confidence.toFixed(2)),
    severity: isSampleImage ? template.severity : adjustSeverityForConfidence(template.severity, confidence),
    symptoms: template.symptoms,
    recommendations: template.recommendations,
    prevention: template.prevention,
    similarConditions: template.similarConditions,
    modelMode: 'demo',
    analyzedAt: new Date().toISOString(),
    imageDataUrl,
    saved: false,
  };
}

// ─── Image Quality Check ──────────────────────────────────────────────────────

export function checkImageQuality(file: File): Promise<ImageQualityResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const minDimension = Math.min(width, height);

      if (minDimension < 150) {
        resolve({
          status: 'too-small',
          label: 'Image too small',
          description: 'The image resolution is very low, which may make analysis unreliable.',
          suggestion: 'Use a higher resolution image or move the camera closer to the leaf.',
          canContinue: false,
        });
        return;
      }

      if (minDimension < 300) {
        resolve({
          status: 'low-light',
          label: 'Low resolution',
          description: 'The image resolution may be too low for reliable symptom detection.',
          suggestion: 'Try a higher resolution image or get closer to the leaf.',
          canContinue: true,
        });
        return;
      }

      // Heuristic: very small file size relative to dimensions = likely low quality/blurry
      const expectedMinBytes = (width * height) / 20;
      if (file.size < expectedMinBytes && file.size < 30000) {
        resolve({
          status: 'blurry',
          label: 'Image may be blurry',
          description: 'The image appears to be heavily compressed or low quality.',
          suggestion: 'Try taking a new photo in good lighting with the camera steady.',
          canContinue: true,
        });
        return;
      }

      resolve({
        status: 'ready',
        label: 'Image ready',
        description: 'The image looks suitable for analysis.',
        suggestion: '',
        canContinue: true,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        status: 'ready',
        label: 'Image ready',
        description: 'Image loaded successfully.',
        suggestion: '',
        canContinue: true,
      });
    };
    img.src = url;
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `We couldn't use this file. Please upload a JPG, PNG, or WEBP image under ${MAX_SIZE_MB} MB.`,
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `This image is too large. Please upload an image under ${MAX_SIZE_MB} MB.`,
    };
  }

  return { valid: true };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Internals ────────────────────────────────────────────────────────────────

const ANALYSIS_STAGES = [
  { label: 'Preparing image', duration: 600 },
  { label: 'Checking visual symptoms', duration: 900 },
  { label: 'Comparing disease patterns', duration: 1100 },
  { label: 'Estimating severity', duration: 700 },
  { label: 'Preparing recommendations', duration: 500 },
];

type StageCallback = (stage: string, index: number, total: number) => void;
let stageCallback: StageCallback | null = null;

export function setStageCallback(cb: StageCallback | null) {
  stageCallback = cb;
}

async function simulateAnalysisStages(): Promise<void> {
  const total = ANALYSIS_STAGES.length;
  for (let i = 0; i < total; i++) {
    const stage = ANALYSIS_STAGES[i];
    stageCallback?.(stage.label, i, total);
    await sleep(stage.duration);
  }
  stageCallback?.(ANALYSIS_STAGES[total - 1].label, total, total);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function adjustSeverityForConfidence(severity: Severity, confidence: number): Severity {
  if (confidence < 0.6) return 'Low';
  if (confidence < 0.7 && severity === 'Critical') return 'High';
  return severity;
}

export const ANALYSIS_STAGE_LABELS = ANALYSIS_STAGES.map(s => s.label);
