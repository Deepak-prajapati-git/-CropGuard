import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Share2, Download, CheckCircle2, AlertTriangle,
  ZoomIn, X, ChevronDown, ChevronUp, BookOpen, Microscope,
  Clock, Info, Shield, Printer
} from 'lucide-react';
import { Shell } from '../components/layout/Shell';
import { Button, Badge, Card, ConfidenceBar, Callout, CheckboxRow } from '../components/ui';
import { getAnalysisById, saveAnalysis, getFields } from '../lib/storage';
import { formatFullDate, getSeverityBg, getSeverityColor, formatConfidence } from '../lib/utils';
import type { AnalysisResult, Severity } from '../types';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/Toast';

const SEVERITY_BADGE: Record<Severity, React.ComponentProps<typeof Badge>['variant']> = {
  Healthy: 'healthy', Low: 'low', Moderate: 'moderate', High: 'high', Critical: 'critical',
};

const CROP_ICONS: Record<string, string> = {
  Tomato: '🍅', Potato: '🥔', Rice: '🌾', Wheat: '🌿', Maize: '🌽', Cotton: '☁️', Chili: '🌶️',
};

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [preventionChecked, setPreventionChecked] = useState<boolean[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['detected', 'symptoms', 'recommendations']));
  const [fields, setFields] = useState<ReturnType<typeof getFields>>([]);
  const [selectedField, setSelectedField] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const a = getAnalysisById(id);
    if (!a) { navigate('/history'); return; }
    
    // Fallback for older localStorage records missing these properties
    a.prevention = a.prevention || [];
    a.symptoms = a.symptoms || [];
    a.recommendations = a.recommendations || [];
    a.similarConditions = a.similarConditions || [];
    
    setAnalysis(a);
    setPreventionChecked(new Array(a.prevention.length).fill(false));
    setFields(getFields());
    if (a.fieldId) setSelectedField(a.fieldId);
  }, [id, navigate]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = () => {
    if (!analysis) return;
    const fieldId = selectedField;
    const field = fields.find(f => f.id === fieldId);
    const updated = { ...analysis, fieldId: fieldId || undefined, fieldName: field?.name, saved: true };
    saveAnalysis(updated);
    setAnalysis(updated);
    setShowSaveDialog(false);
    showToast(field ? `Result saved to ${field.name}.` : 'Result saved to history.', 'success');
  };

  const handleExport = () => {
    if (!analysis) return;
    const reportContent = generateReportHTML(analysis);
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CropGuard-Report-${analysis.crop}-${analysis.disease.replace(/\s/g, '-')}-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report downloaded successfully.', 'success');
  };

  const handleShare = async () => {
    if (!analysis) return;
    const text = `CropGuard Analysis — ${analysis.crop}: Possible ${analysis.disease} (${formatConfidence(analysis.confidence)} confidence, ${analysis.severity} severity). AI-assisted result — verify with a local expert before treatment.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'CropGuard Analysis Result', text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('Result copied to clipboard.', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!analysis) {
    return (
      <Shell title="Analysis Result">
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-[#66736A]">Loading result...</p>
        </div>
      </Shell>
    );
  }

  const confidence = analysis.confidence;
  const confidenceLevel = confidence >= 0.8 ? 'high' : confidence >= 0.6 ? 'medium' : 'low';
  const isLowConfidence = confidenceLevel === 'low';
  const needsExpert = analysis.severity === 'High' || analysis.severity === 'Critical' || isLowConfidence;

  const SectionHeader: React.FC<{ sectionKey: string; title: string; icon?: React.ReactNode }> = ({ sectionKey, title, icon }) => (
    <button
      className="w-full flex items-center gap-2 py-3 text-left focus-visible:outline-2 focus-visible:outline-[#174A35] rounded"
      onClick={() => toggleSection(sectionKey)}
      aria-expanded={expandedSections.has(sectionKey)}
    >
      {icon && <span className="text-[#174A35]">{icon}</span>}
      <h2 className="text-sm font-semibold text-[#1E2923] flex-1">{title}</h2>
      {expandedSections.has(sectionKey) ? <ChevronUp className="h-4 w-4 text-[#66736A]" /> : <ChevronDown className="h-4 w-4 text-[#66736A]" />}
    </button>
  );

  return (
    <Shell title="Analysis Result">
      <div className="max-w-2xl mx-auto" ref={reportRef}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 no-print">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-[10px] border border-[#DDE3DB] flex items-center justify-center hover:bg-[#EEF1E9] transition-colors" aria-label="Go back">
            <ArrowLeft className="h-4 w-4 text-[#1E2923]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#1E2923]">Analysis result</h1>
            <p className="text-xs text-[#66736A]">{formatFullDate(analysis.analyzedAt)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={handleShare} className="h-9 w-9 rounded-[10px] border border-[#DDE3DB] flex items-center justify-center hover:bg-[#EEF1E9] transition-colors" aria-label="Share result">
              <Share2 className="h-4 w-4 text-[#66736A]" />
            </button>
            <button onClick={handlePrint} className="h-9 w-9 rounded-[10px] border border-[#DDE3DB] flex items-center justify-center hover:bg-[#EEF1E9] transition-colors hidden lg:flex" aria-label="Print report">
              <Printer className="h-4 w-4 text-[#66736A]" />
            </button>
            <button onClick={handleExport} className="h-9 w-9 rounded-[10px] border border-[#DDE3DB] flex items-center justify-center hover:bg-[#EEF1E9] transition-colors" aria-label="Export report">
              <Download className="h-4 w-4 text-[#66736A]" />
            </button>
          </div>
        </div>

        {/* Demo badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="demo">
            <Shield className="h-3 w-3" />
            Prototype model · Demo inference
          </Badge>
          {analysis.saved && (
            <Badge variant="healthy">
              <CheckCircle2 className="h-3 w-3" />
              Saved
            </Badge>
          )}
        </div>

        {/* Image */}
        {analysis.imageDataUrl && (
          <div className="mb-5 rounded-[14px] overflow-hidden border border-[#DDE3DB] relative group cursor-pointer"
            onClick={() => setShowLightbox(true)}>
            <img
              src={analysis.imageDataUrl}
              alt={`${analysis.crop} leaf — analysed image`}
              className="w-full h-52 lg:h-64 object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full h-10 w-10 flex items-center justify-center">
                <ZoomIn className="h-5 w-5 text-[#1E2923]" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex gap-2">
              {analysis.imageQuality === 'ready' || analysis.imageQuality === undefined ? (
                <span className="text-xs bg-[#174A35]/90 text-white px-2 py-1 rounded-full">Good image quality</span>
              ) : (
                <span className="text-xs bg-[#B7791F]/90 text-white px-2 py-1 rounded-full">Analysis may be less reliable</span>
              )}
            </div>
          </div>
        )}

        {/* Result summary */}
        <Card padding="md" className="mb-5">
          <div className="flex items-start gap-4">
            <div
              className="h-14 w-14 rounded-[12px] flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: getSeverityBg(analysis.severity) }}
            >
              {CROP_ICONS[analysis.crop] || '🌱'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg font-bold text-[#1E2923]">{analysis.crop}</h2>
                <Badge variant={SEVERITY_BADGE[analysis.severity]} size="md">
                  {analysis.severity}
                </Badge>
              </div>
              <p className="text-base font-semibold" style={{ color: getSeverityColor(analysis.severity) }}>
                {analysis.disease === 'Healthy' ? '✓ No disease detected' : `Possible ${analysis.disease}`}
              </p>
              {analysis.fieldName && (
                <p className="text-xs text-[#66736A] mt-1">📍 {analysis.fieldName}</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#DDE3DB]">
            <ConfidenceBar confidence={analysis.confidence} showText showLabel />
          </div>

          {isLowConfidence && (
            <Callout type="warning" className="mt-3" icon={<AlertTriangle className="h-4 w-4" />}>
              The image does not provide enough evidence for a reliable prediction. Try a closer image with better lighting.
            </Callout>
          )}
        </Card>

        {/* Sections */}
        <div className="space-y-3 mb-5">

          {/* What was detected */}
          <Card padding="md">
            <SectionHeader sectionKey="detected" title="What CropGuard detected" icon={<Microscope className="h-4 w-4" />} />
            {expandedSections.has('detected') && (
              <div className="pt-1 animate-fade-in">
                <p className="text-sm text-[#66736A] leading-relaxed">
                  {analysis.disease === 'Healthy'
                    ? `The image shows characteristics consistent with a healthy ${analysis.crop} leaf. No clear disease symptoms were identified. Continue regular monitoring to maintain field health.`
                    : `The image shows patterns commonly associated with ${analysis.disease} on ${analysis.crop} plants. This analysis is based on visible visual features and should be verified by an agricultural expert.`
                  }
                </p>
              </div>
            )}
          </Card>

          {/* Symptoms */}
          {analysis.symptoms.length > 0 && (
            <Card padding="md">
              <SectionHeader sectionKey="symptoms" title="Visual symptoms observed" icon={<Info className="h-4 w-4" />} />
              {expandedSections.has('symptoms') && (
                <ul className="pt-1 space-y-1.5 animate-fade-in">
                  {analysis.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#66736A]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6F8F55] shrink-0 mt-2" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {/* Recommendations */}
          <Card padding="md">
            <SectionHeader sectionKey="recommendations" title="Recommended next steps" icon={<CheckCircle2 className="h-4 w-4" />} />
            {expandedSections.has('recommendations') && (
              <ol className="pt-1 space-y-2 animate-fade-in list-none">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="h-5 w-5 rounded-full bg-[#DDEBDF] text-[#174A35] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[#66736A]">{r}</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          {/* Prevention */}
          {analysis.prevention.length > 0 && (
            <Card padding="md">
              <SectionHeader sectionKey="prevention" title="Prevention checklist" icon={<Shield className="h-4 w-4" />} />
              {expandedSections.has('prevention') && (
                <div className="pt-1 animate-fade-in">
                  {analysis.prevention.map((p, i) => (
                    <CheckboxRow
                      key={i}
                      label={p}
                      checked={preventionChecked[i]}
                      onChange={(checked) => {
                        const next = [...preventionChecked];
                        next[i] = checked;
                        setPreventionChecked(next);
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Expert help callout */}
          {needsExpert && (
            <Callout
              type="warning"
              title="When to contact an expert"
              icon={<AlertTriangle className="h-4 w-4" />}
            >
              <ul className="mt-1 space-y-1 text-xs">
                {analysis.severity === 'High' || analysis.severity === 'Critical' ? (
                  <li>• Symptoms appear to be spreading rapidly or affect a large portion of the field</li>
                ) : null}
                {isLowConfidence && (
                  <li>• This result has low confidence — do not make treatment decisions without expert confirmation</li>
                )}
                <li>• Multiple fields are showing similar symptoms</li>
                <li>• The plant is severely wilted or defoliated</li>
                <li>• You are unsure about the appropriate action to take</li>
              </ul>
            </Callout>
          )}

          {/* Similar conditions */}
          {analysis.similarConditions.length > 0 && (
            <Card padding="md">
              <SectionHeader sectionKey="similar" title="Similar possible conditions" icon={<BookOpen className="h-4 w-4" />} />
              {expandedSections.has('similar') && (
                <div className="pt-1 space-y-3 animate-fade-in">
                  <p className="text-xs text-[#66736A] italic">Some symptoms can appear similar to the following conditions:</p>
                  {analysis.similarConditions.map((c, i) => (
                    <div key={i} className="p-3 bg-[#EEF1E9] rounded-[10px]">
                      <p className="text-sm font-semibold text-[#1E2923] mb-0.5">{c.name}</p>
                      <p className="text-xs text-[#66736A]">{c.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Disclaimer */}
        <Callout type="warning" className="mb-6" icon={<AlertTriangle className="h-4 w-4" />}>
          <strong>AI-assisted result.</strong> Verify with a local agricultural expert before applying any treatment. This is a prototype demonstration model — not a certified diagnostic tool.
        </Callout>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-[#66736A] mb-6">
          <Clock className="h-3.5 w-3.5" />
          Analysed {formatFullDate(analysis.analyzedAt)}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8 no-print">
          {!analysis.saved && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setShowSaveDialog(true)}
              icon={<CheckCircle2 className="h-4 w-4" />}
              className="col-span-2"
            >
              Save result
            </Button>
          )}
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => navigate('/analyze')}
            icon={<Microscope className="h-4 w-4" />}
          >
            Analyse another
          </Button>
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={handleExport}
            icon={<Download className="h-4 w-4" />}
          >
            Export report
          </Button>
        </div>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSaveDialog(false)} />
          <div className="relative bg-white rounded-[16px] shadow-xl p-6 w-full max-w-sm animate-fade-in">
            <h2 className="text-base font-semibold text-[#1E2923] mb-1">Save this result</h2>
            <p className="text-sm text-[#66736A] mb-4">Optionally attach this result to a field for tracking.</p>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Field (optional)</label>
            <select
              value={selectedField}
              onChange={e => setSelectedField(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#174A35] mb-4"
            >
              <option value="">No field</option>
              {fields.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <Button variant="outline" size="md" fullWidth onClick={() => setShowSaveDialog(false)}>Cancel</Button>
              <Button variant="primary" size="md" fullWidth onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && analysis.imageDataUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowLightbox(false)}>
          <button className="absolute top-4 right-4 h-10 w-10 bg-white/20 rounded-full flex items-center justify-center" aria-label="Close lightbox">
            <X className="h-5 w-5 text-white" />
          </button>
          <img
            src={analysis.imageDataUrl}
            alt="Leaf image — full view"
            className="max-w-full max-h-full object-contain rounded-[12px]"
            crossOrigin="anonymous"
          />
        </div>
      )}
    </Shell>
  );
};

// ─── Report HTML Generator ────────────────────────────────────────────────────

function generateReportHTML(analysis: AnalysisResult): string {
  const date = new Date(analysis.analyzedAt).toLocaleString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CropGuard Analysis Report — ${analysis.crop} ${analysis.disease}</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; max-width: 680px; margin: 0 auto; padding: 40px 24px; color: #1E2923; background: #fff; }
  h1 { font-size: 22px; margin-bottom: 4px; color: #174A35; }
  h2 { font-size: 14px; color: #174A35; border-bottom: 1px solid #DDE3DB; padding-bottom: 6px; margin-top: 24px; }
  .header { border-bottom: 2px solid #174A35; padding-bottom: 16px; margin-bottom: 24px; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; }
  .moderate { background: #FEF3C7; color: #B7791F; }
  .high { background: #FDECEA; color: #B54747; }
  .healthy { background: #DCFCE7; color: #2F7D4A; }
  .low { background: #DDEBDF; color: #6F8F55; }
  .critical { background: #FDE8E8; color: #7B1515; }
  .result-box { background: #EEF1E9; border-radius: 10px; padding: 16px; margin: 16px 0; }
  .disclaimer { background: #FEF3C7; border-left: 3px solid #B7791F; padding: 12px; border-radius: 0 8px 8px 0; font-size: 12px; color: #B7791F; margin-top: 24px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; font-size: 13px; color: #66736A; }
  .conf-bar-bg { background: #EEF1E9; border-radius: 99px; height: 8px; margin: 8px 0; }
  .conf-bar-fill { height: 8px; border-radius: 99px; background: #2F7D4A; }
  .meta { font-size: 11px; color: #66736A; }
  img { max-width: 100%; border-radius: 10px; margin: 12px 0; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
    <div style="width:32px;height:32px;background:#174A35;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;">C</div>
    <span style="font-size:18px;font-weight:700;color:#174A35;">CropGuard</span>
    <span style="font-size:12px;background:#E8F4FD;color:#1a6fa8;padding:2px 8px;border-radius:99px;border:1px solid #bee3f8;">Prototype model · Demo inference</span>
  </div>
  <h1>Analysis Report</h1>
  <p class="meta">Generated: ${date}</p>
</div>

<div class="result-box">
  <div style="font-size:22px;margin-bottom:8px;">${{ Tomato: '🍅', Potato: '🥔', Rice: '🌾', Wheat: '🌿', Maize: '🌽', Cotton: '☁️', Chili: '🌶️' }[analysis.crop] || '🌱'} ${analysis.crop}</div>
  <p style="margin:0;font-size:18px;font-weight:700;color:#B54747;">${analysis.disease === 'Healthy' ? '✓ No disease detected' : `Possible ${analysis.disease}`}</p>
  ${analysis.fieldName ? `<p class="meta" style="margin-top:4px;">📍 ${analysis.fieldName}</p>` : ''}
  <div style="margin-top:12px;">
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
      <span>Confidence</span>
      <span><strong>${Math.round(analysis.confidence * 100)}%</strong></span>
    </div>
    <div class="conf-bar-bg"><div class="conf-bar-fill" style="width:${Math.round(analysis.confidence * 100)}%;background:${analysis.confidence >= 0.8 ? '#2F7D4A' : analysis.confidence >= 0.6 ? '#B7791F' : '#B54747'};"></div></div>
  </div>
  <div style="margin-top:12px;">
    Severity: <span class="badge ${analysis.severity.toLowerCase()}">${analysis.severity}</span>
  </div>
</div>

${analysis.imageDataUrl && !analysis.imageDataUrl.startsWith('http') ? `<img src="${analysis.imageDataUrl}" alt="Analysed leaf image" />` : ''}

<h2>Visual Symptoms</h2>
<ul>${analysis.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>

<h2>Recommended Next Steps</h2>
<ol>${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ol>

<h2>Prevention Checklist</h2>
<ul>${analysis.prevention.map(p => `<li>☐ ${p}</li>`).join('')}</ul>

${analysis.similarConditions.length > 0 ? `
<h2>Similar Possible Conditions</h2>
<p style="font-size:12px;font-style:italic;color:#66736A;">Some symptoms can appear similar to:</p>
<ul>${analysis.similarConditions.map(c => `<li><strong>${c.name}</strong> — ${c.description}</li>`).join('')}</ul>
` : ''}

<div class="disclaimer">
  <strong>⚠ AI-assisted result.</strong> Verify with a local agricultural expert before applying any treatment. This is a prototype model — not a certified diagnostic tool. Follow locally approved agricultural guidance and product labels.
</div>
</body>
</html>`;
}

export default ResultPage;
