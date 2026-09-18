import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Upload, Camera, Image as ImageIcon, X, CheckCircle2,
  AlertTriangle, Info, Loader2, ChevronRight, ArrowLeft, RefreshCw
} from 'lucide-react';
import { Shell } from '../components/layout/Shell';
import { Button, Card, Callout, Spinner } from '../components/ui';
import { predictDisease, validateImageFile, fileToDataUrl, checkImageQuality, setStageCallback, ANALYSIS_STAGE_LABELS } from '../lib/inference';
import { getFields, saveAnalysis, getSettings } from '../lib/storage';
import { cn } from '../lib/utils';
import type { CropName, Field, ImageQualityResult } from '../types';
import { CROPS, CROP_DESCRIPTIONS } from '../lib/data';
import { useToast } from '../components/ui/Toast';

const CROP_ICONS: Record<CropName, string> = {
  Tomato: '🍅', Potato: '🥔', Rice: '🌾', Wheat: '🌿', Maize: '🌽', Cotton: '☁️', Chili: '🌶️',
};

// Sample images (using Unsplash for demo)
const SAMPLE_IMAGES: Record<CropName, { url: string; label: string }> = {
  Tomato: { url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80', label: 'Tomato leaf sample' },
  Potato: { url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80', label: 'Potato leaf sample' },
  Rice: { url: 'https://images.unsplash.com/photo-1536054425264-1dd9eef73c21?w=600&q=80', label: 'Rice crop sample' },
  Wheat: { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80', label: 'Wheat crop sample' },
  Maize: { url: 'https://images.unsplash.com/photo-1604940052602-d3a0d5fbee80?w=600&q=80', label: 'Maize leaf sample' },
  Cotton: { url: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=600&q=80', label: 'Cotton plant sample' },
  Chili: { url: 'https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=600&q=80', label: 'Chili plant sample' },
};

type Step = 1 | 2 | 3 | 4;

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [selectedCrop, setSelectedCrop] = useState<CropName | null>(null);
  const [selectedField, setSelectedField] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [isSampleImage, setIsSampleImage] = useState(false);
  const [sampleImageUrl, setSampleImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [quality, setQuality] = useState<ImageQualityResult | null>(null);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [currentStageName, setCurrentStageName] = useState('Preparing image');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [checkingQuality, setCheckingQuality] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFields(getFields());
    if (searchParams.get('sample') === 'true') {
      setSelectedCrop('Tomato');
    }
  }, [searchParams]);

  const handleCropSelect = (crop: CropName) => {
    setSelectedCrop(crop);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setImageError('');
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid file');
      return;
    }
    setCheckingQuality(true);
    const dataUrl = await fileToDataUrl(file);
    setImageFile(file);
    setImageDataUrl(dataUrl);
    setIsSampleImage(false);
    setSampleImageUrl('');
    const q = await checkImageQuality(file);
    setQuality(q);
    setCheckingQuality(false);
  }, []);

  const handleSampleImage = async (crop: CropName) => {
    const sample = SAMPLE_IMAGES[crop];
    setSampleImageUrl(sample.url);
    setImageDataUrl(sample.url);
    setIsSampleImage(true);
    setImageFile(null);
    setImageError('');
    setQuality({
      status: 'ready',
      label: 'Sample image',
      description: 'This is a bundled sample image suitable for demonstration.',
      suggestion: '',
      canContinue: true,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const clearImage = () => {
    setImageFile(null);
    setImageDataUrl('');
    setIsSampleImage(false);
    setSampleImageUrl('');
    setQuality(null);
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runAnalysis = async () => {
    if (!selectedCrop || (!imageDataUrl)) return;
    setIsAnalyzing(true);
    setStep(4);
    setAnalysisStage(0);

    setStageCallback((stageName, index) => {
      setCurrentStageName(stageName);
      setAnalysisStage(index);
    });

    try {
      const result = await predictDisease(imageDataUrl, selectedCrop, isSampleImage);
      result.fieldId = selectedField || undefined;
      result.fieldName = fields.find(f => f.id === selectedField)?.name;
      result.notes = notes || undefined;
      result.imageFileName = imageFile?.name;
      result.imageSize = imageFile?.size;
      result.imageQuality = quality?.status;

      if (selectedField) {
        result.saved = true;
        saveAnalysis(result);
        showToast(`Result saved to ${result.fieldName}.`, 'success');
      } else {
        saveAnalysis(result);
      }

      setStageCallback(null);
      navigate(`/result/${result.id}`);
    } catch {
      setIsAnalyzing(false);
      setStep(3);
      showToast("We couldn't process this image. Please try again.", 'error');
    }
  };

  const canProceedStep1 = !!selectedCrop;
  const canProceedStep2 = !!imageDataUrl;
  const canProceedStep3 = quality?.canContinue !== false;

  const stepProgress = ((step - 1) / 3) * 100;

  return (
    <Shell title="Analyze Crop">
      <div className="max-w-2xl mx-auto">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {(['Crop', 'Image', 'Quality', 'Result'] as const).map((label, i) => {
              const stepNum = (i + 1) as Step;
              const isActive = step === stepNum;
              const isComplete = step > stepNum;
              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                      isComplete ? 'bg-[#174A35] text-white' :
                      isActive ? 'bg-[#174A35] text-white ring-4 ring-[#DDEBDF]' :
                      'bg-[#EEF1E9] text-[#66736A]'
                    )}>
                      {isComplete ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      isActive || isComplete ? 'text-[#174A35]' : 'text-[#66736A]'
                    )}>{label}</span>
                  </div>
                  {i < 3 && (
                    <div className="flex-1 h-px mx-2 bg-[#DDE3DB] relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-[#174A35] transition-all duration-500"
                        style={{ width: step > stepNum ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step 1: Crop selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#1E2923] mb-1">Select the crop type</h1>
              <p className="text-sm text-[#66736A]">Choose the crop you're analysing a leaf image for.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {CROPS.map(crop => (
                <button
                  key={crop}
                  onClick={() => handleCropSelect(crop)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-[14px] border-2 transition-all text-left',
                    selectedCrop === crop
                      ? 'border-[#174A35] bg-[#DDEBDF]'
                      : 'border-[#DDE3DB] bg-white hover:border-[#6F8F55] hover:bg-[#EEF1E9]'
                  )}
                  aria-pressed={selectedCrop === crop}
                >
                  <span className="text-3xl">{CROP_ICONS[crop]}</span>
                  <div className="text-center">
                    <p className={cn('text-sm font-semibold', selectedCrop === crop ? 'text-[#174A35]' : 'text-[#1E2923]')}>
                      {crop}
                    </p>
                    <p className="text-xs text-[#66736A] mt-0.5 leading-tight">{CROP_DESCRIPTIONS[crop].split(',')[0]}</p>
                  </div>
                  {selectedCrop === crop && (
                    <CheckCircle2 className="h-4 w-4 text-[#174A35]" />
                  )}
                </button>
              ))}
            </div>

            {/* Field and notes */}
            <Card padding="md" className="mb-6">
              <h3 className="text-sm font-semibold text-[#1E2923] mb-3">Additional details (optional)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#1E2923] mb-1">Field</label>
                  <select
                    value={selectedField}
                    onChange={e => setSelectedField(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
                  >
                    <option value="">No field selected</option>
                    {fields.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.crop})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E2923] mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any observations about the plant or symptoms..."
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] placeholder:text-[#66736A] focus:outline-none focus:ring-2 focus:ring-[#174A35] resize-none h-16"
                  />
                </div>
              </div>
            </Card>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              iconRight={<ChevronRight className="h-4 w-4" />}
            >
              Continue to image upload
            </Button>
          </div>
        )}

        {/* Step 2: Image upload */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm text-[#66736A] hover:text-[#1E2923] mb-3 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to crop selection
              </button>
              <h1 className="text-xl font-bold text-[#1E2923] mb-1">Add a leaf image</h1>
              <p className="text-sm text-[#66736A]">Upload a close-up photo of the affected leaf for analysis.</p>
            </div>

            {/* Upload area or preview */}
            {!imageDataUrl ? (
              <div
                className={cn(
                  'border-2 border-dashed rounded-[14px] p-8 mb-4 text-center transition-all',
                  isDragOver ? 'border-[#174A35] bg-[#DDEBDF]' : 'border-[#DDE3DB] bg-white',
                  'cursor-pointer'
                )}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload leaf image"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              >
                <div className="h-14 w-14 rounded-full bg-[#EEF1E9] flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-[#6F8F55]" />
                </div>
                <p className="text-sm font-semibold text-[#1E2923] mb-1">
                  <span className="hidden lg:inline">Drag and drop, or </span>tap to browse
                </p>
                <p className="text-xs text-[#66736A]">JPG, PNG, WEBP · up to 10 MB</p>
              </div>
            ) : (
              <div className="mb-4 bg-white border border-[#DDE3DB] rounded-[14px] overflow-hidden">
                <div className="relative">
                  <img
                    src={imageDataUrl}
                    alt="Uploaded leaf"
                    className="w-full h-52 object-cover"
                    crossOrigin="anonymous"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FDECEA] transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4 text-[#B54747]" />
                  </button>
                  {isSampleImage && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#174A35] text-white text-xs font-medium rounded-full">
                      Sample image
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1E2923]">
                      {imageFile ? imageFile.name : `${selectedCrop} sample`}
                    </p>
                    <p className="text-xs text-[#66736A]">
                      {imageFile ? `${(imageFile.size / 1024).toFixed(0)} KB` : 'Bundled sample'} · {selectedCrop}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearImage} icon={<RefreshCw className="h-3.5 w-3.5" />}>
                    Replace
                  </Button>
                </div>
              </div>
            )}

            {/* Error */}
            {imageError && (
              <Callout type="danger" icon={<AlertTriangle className="h-4 w-4" />} className="mb-4">
                {imageError}
              </Callout>
            )}

            {/* Mobile actions */}
            <div className="grid grid-cols-2 gap-2 mb-4 lg:hidden">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'image/*';
                    fileInputRef.current.capture = 'environment';
                    fileInputRef.current.click();
                  }
                }}
                icon={<Camera className="h-4 w-4" />}
              >
                Take photo
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute('capture');
                    fileInputRef.current.click();
                  }
                }}
                icon={<ImageIcon className="h-4 w-4" />}
              >
                From gallery
              </Button>
            </div>

            {/* Sample images */}
            {selectedCrop && (
              <div className="mb-4">
                <button
                  onClick={() => handleSampleImage(selectedCrop)}
                  className="w-full text-sm text-[#174A35] font-medium py-2 hover:underline"
                >
                  Use {selectedCrop} sample image (recommended for demo)
                </button>
              </div>
            )}

            {/* Guidelines */}
            <Card padding="md" className="mb-6 bg-[#EEF1E9] border-[#DDE3DB]">
              <div className="flex items-start gap-2 mb-2">
                <Info className="h-4 w-4 text-[#174A35] shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-[#174A35]">Image guidelines for best results</p>
              </div>
              <ul className="text-xs text-[#66736A] space-y-1 ml-6 list-disc">
                <li>Photograph one leaf clearly — close up, not the whole field</li>
                <li>Keep the leaf centred and in focus</li>
                <li>Use bright, even natural light</li>
                <li>Avoid strong shadows or direct glare</li>
                <li>Avoid blurry images — hold the camera steady</li>
              </ul>
            </Card>

            <div className="flex gap-2.5">
              <Button variant="outline" size="lg" onClick={() => setStep(1)} className="w-24">
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setStep(3)}
                disabled={!canProceedStep2 || checkingQuality}
                iconRight={<ChevronRight className="h-4 w-4" />}
                loading={checkingQuality}
              >
                {checkingQuality ? 'Checking image...' : 'Check image quality'}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              aria-label="Choose image file"
            />
          </div>
        )}

        {/* Step 3: Quality check */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-sm text-[#66736A] hover:text-[#1E2923] mb-3 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to image
              </button>
              <h1 className="text-xl font-bold text-[#1E2923] mb-1">Image quality review</h1>
              <p className="text-sm text-[#66736A]">Review the quality assessment before running the analysis.</p>
            </div>

            {/* Image preview */}
            <div className="mb-4 rounded-[14px] overflow-hidden border border-[#DDE3DB]">
              <img
                src={imageDataUrl}
                alt={`${selectedCrop} leaf — selected for analysis`}
                className="w-full h-48 object-cover"
                crossOrigin="anonymous"
              />
            </div>

            {/* Quality result */}
            {quality && (
              <div className={cn(
                'p-4 rounded-[14px] border mb-4 flex items-start gap-3',
                quality.status === 'ready' ? 'bg-[#DCFCE7] border-[#a7f3c5]' :
                quality.canContinue ? 'bg-[#FEF3C7] border-[#f6d860]/40' :
                'bg-[#FDECEA] border-[#f5b5b5]'
              )}>
                {quality.status === 'ready' ? (
                  <CheckCircle2 className="h-5 w-5 text-[#2F7D4A] shrink-0 mt-0.5" />
                ) : quality.canContinue ? (
                  <AlertTriangle className="h-5 w-5 text-[#B7791F] shrink-0 mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-[#B54747] shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    'text-sm font-semibold mb-1',
                    quality.status === 'ready' ? 'text-[#2F7D4A]' :
                    quality.canContinue ? 'text-[#B7791F]' : 'text-[#B54747]'
                  )}>
                    {quality.label}
                  </p>
                  <p className="text-sm text-[#66736A]">{quality.description}</p>
                  {quality.suggestion && (
                    <p className="text-xs mt-1.5 italic text-[#66736A]">
                      Tip: {quality.suggestion}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Details */}
            <Card padding="md" className="mb-6">
              <div className="space-y-2.5">
                {[
                  { label: 'Crop', value: selectedCrop },
                  { label: 'Field', value: fields.find(f => f.id === selectedField)?.name || 'No field selected' },
                  { label: 'Image source', value: isSampleImage ? 'Sample image (demo)' : `${imageFile?.name || 'Uploaded image'}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-[#66736A]">{item.label}</span>
                    <span className="text-[#1E2923] font-medium text-right max-w-[60%] truncate">{item.value}</span>
                  </div>
                ))}
                {isSampleImage && (
                  <div className="pt-2 border-t border-[#DDE3DB]">
                    <span className="text-xs text-[#66736A]">
                      Using a bundled sample image for the demonstration. Results will be labelled as prototype inference.
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-2.5 mb-4">
              <Button variant="outline" size="lg" onClick={() => setStep(2)} className="w-28">
                Replace
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={runAnalysis}
                disabled={!canProceedStep3}
                icon={<Loader2 className="h-4 w-4" />}
              >
                {quality?.canContinue === false ? 'Replace image first' : 'Start analysis'}
              </Button>
            </div>

            {quality?.canContinue && quality.status !== 'ready' && (
              <p className="text-xs text-center text-[#66736A]">
                You can continue with this image, but results may be less reliable.
              </p>
            )}
          </div>
        )}

        {/* Step 4: Loading */}
        {step === 4 && (
          <div className="animate-fade-in min-h-[400px] flex flex-col items-center justify-center text-center px-4">
            <div className="h-20 w-20 rounded-full bg-[#DDEBDF] flex items-center justify-center mb-6 relative">
              <Spinner size={32} className="text-[#174A35]" />
              <span className="absolute text-2xl">🌿</span>
            </div>

            <h2 className="text-lg font-bold text-[#1E2923] mb-2">Analysing your image</h2>
            <p className="text-sm text-[#66736A] mb-8 max-w-xs">
              Keep this screen open while CropGuard reviews the image.
            </p>

            {/* Stage progress */}
            <div className="w-full max-w-sm mb-6">
              <div className="h-1.5 bg-[#EEF1E9] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-[#174A35] rounded-full transition-all duration-700"
                  style={{ width: `${(analysisStage / ANALYSIS_STAGE_LABELS.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-[#66736A] animate-pulse-subtle">{currentStageName}...</p>
            </div>

            {/* Stages */}
            <div className="w-full max-w-sm space-y-2">
              {ANALYSIS_STAGE_LABELS.map((label, i) => (
                <div key={label} className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm transition-all',
                  i < analysisStage ? 'text-[#174A35] bg-[#DDEBDF]' :
                  i === analysisStage ? 'text-[#1E2923] bg-[#EEF1E9] font-medium' :
                  'text-[#66736A]'
                )}>
                  {i < analysisStage ? (
                    <CheckCircle2 className="h-4 w-4 text-[#174A35] shrink-0" />
                  ) : i === analysisStage ? (
                    <Spinner size={16} className="text-[#174A35] shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-[#DDE3DB] shrink-0" />
                  )}
                  {label}
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-[#66736A] max-w-xs">
              This is a prototype model for demonstration purposes.
              Results are labelled accordingly and require expert verification.
            </p>
          </div>
        )}
      </div>
    </Shell>
  );
};

export default AnalyzePage;
