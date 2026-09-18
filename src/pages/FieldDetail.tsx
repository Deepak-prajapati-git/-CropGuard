import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Microscope, Calendar, MapPin, ChevronRight, AlertTriangle, Leaf } from 'lucide-react';
import { Shell } from '../components/layout/Shell';
import { Button, Badge, Card, Callout, EmptyState } from '../components/ui';
import { getFieldById, getAnalysisById } from '../lib/storage';
import { formatDate, formatShortDate, getSeverityBg } from '../lib/utils';
import type { AnalysisResult, Field, Severity } from '../types';

const SEVERITY_BADGE: Record<Severity, React.ComponentProps<typeof Badge>['variant']> = {
  Healthy: 'healthy', Low: 'low', Moderate: 'moderate', High: 'high', Critical: 'critical',
};

const CROP_ICONS: Record<string, string> = {
  Tomato: '🍅', Potato: '🥔', Rice: '🌾', Wheat: '🌿', Maize: '🌽', Cotton: '☁️', Chili: '🌶️',
};

const STATUS_STYLES: Record<string, string> = {
  'Healthy': 'bg-[#DCFCE7] text-[#2F7D4A]',
  'Attention Needed': 'bg-[#FEF3C7] text-[#B7791F]',
  'At Risk': 'bg-[#FDECEA] text-[#B54747]',
  'Critical': 'bg-[#FDE8E8] text-[#7B1515]',
};

export const FieldDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<Field | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    if (!id) { navigate('/fields'); return; }
    const f = getFieldById(id);
    if (!f) { navigate('/fields'); return; }
    setField(f);

    const fieldAnalyses = f.analysisIds
      .map(aid => getAnalysisById(aid))
      .filter(Boolean) as AnalysisResult[];
    setAnalyses(fieldAnalyses);
  }, [id, navigate]);

  if (!field) return null;

  const monitoringRec = analyses.length >= 2
    ? `Inspect this field again within 3 days — ${analyses.length} detection${analyses.length !== 1 ? 's' : ''} recorded recently.`
    : field.healthStatus !== 'Healthy'
    ? 'Monitor this field regularly and consult an agricultural expert if symptoms worsen.'
    : 'Continue regular monitoring. No immediate action required.';

  return (
    <Shell title={field.name}>
      <div className="max-w-2xl mx-auto">
        {/* Back button (mobile) */}
        <button
          onClick={() => navigate('/fields')}
          className="lg:hidden flex items-center gap-1.5 text-sm text-[#66736A] hover:text-[#1E2923] mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> All fields
        </button>

        {/* Field header */}
        <div className="mb-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-14 w-14 rounded-[12px] bg-[#EEF1E9] flex items-center justify-center text-2xl shrink-0">
              {CROP_ICONS[field.crop] || '🌱'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#1E2923] mb-1">{field.name}</h1>
              <p className="text-sm text-[#66736A]">{field.crop} · {field.area}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[field.healthStatus] || STATUS_STYLES['Healthy']}`}>
                  {field.healthStatus}
                </span>
                {field.detectionCount > 0 && (
                  <span className="text-xs text-[#66736A]">{field.detectionCount} detection{field.detectionCount !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate(`/analyze?field=${field.id}`)}
            icon={<Microscope className="h-4 w-4" />}
          >
            Analyse this field
          </Button>
        </div>

        {/* Field info */}
        <Card padding="md" className="mb-4">
          <h2 className="text-sm font-semibold text-[#1E2923] mb-3">Field details</h2>
          <div className="space-y-2.5">
            {[
              { icon: Leaf, label: 'Crop', value: field.crop },
              { icon: MapPin, label: 'Area', value: field.area },
              { icon: MapPin, label: 'Location', value: field.location || 'Not specified' },
              { icon: Calendar, label: 'Planted', value: field.plantingDate ? formatShortDate(field.plantingDate) : 'Not specified' },
              { icon: Calendar, label: 'Last analysis', value: field.lastAnalyzedAt ? formatDate(field.lastAnalyzedAt) : 'Not analysed' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 text-sm">
                <item.icon className="h-4 w-4 text-[#66736A] shrink-0" />
                <span className="text-[#66736A] w-28 shrink-0">{item.label}</span>
                <span className="text-[#1E2923] font-medium truncate">{item.value}</span>
              </div>
            ))}
          </div>
          {field.notes && (
            <div className="mt-3 pt-3 border-t border-[#DDE3DB]">
              <p className="text-xs text-[#66736A]"><strong>Notes:</strong> {field.notes}</p>
            </div>
          )}
        </Card>

        {/* Monitoring recommendation */}
        <Callout
          type={field.healthStatus === 'Healthy' ? 'success' : field.healthStatus === 'At Risk' ? 'danger' : 'warning'}
          title="Monitoring recommendation"
          icon={<AlertTriangle className="h-4 w-4" />}
          className="mb-4"
        >
          {monitoringRec}
        </Callout>

        {/* Location panel */}
        <Card padding="md" className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-[#6F8F55]" />
            <h2 className="text-sm font-semibold text-[#1E2923]">Field location</h2>
            <span className="text-xs text-[#66736A] ml-auto">Approximate</span>
          </div>
          <div className="h-32 bg-[#EEF1E9] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            {/* Illustrative field map */}
            <svg viewBox="0 0 300 120" className="w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice">
              {/* Grid lines */}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="120" stroke="#6F8F55" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 3 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="#6F8F55" strokeWidth="0.5" />
              ))}
              {/* Field boundary */}
              <rect x="40" y="20" width="220" height="80" fill="#174A35" fillOpacity="0.2" stroke="#174A35" strokeWidth="1.5" rx="4" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <MapPin className="h-6 w-6 text-[#174A35]" />
              <p className="text-xs font-medium text-[#174A35] mt-1">{field.location || field.name}</p>
              <p className="text-xs text-[#66736A]">Illustrative field location · {field.area}</p>
            </div>
          </div>
        </Card>

        {/* Analysis history */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#1E2923] mb-3">
            Analysis history ({analyses.length})
          </h2>

          {analyses.length === 0 ? (
            <EmptyState
              icon={<Microscope className="h-5 w-5" />}
              title="No analyses yet"
              description="Run an analysis on this field to start tracking crop health."
              action={
                <Button variant="primary" size="sm" onClick={() => navigate('/analyze')}>
                  Analyse crop
                </Button>
              }
            />
          ) : (
            <div className="space-y-2.5">
              {analyses.map(a => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/result/${a.id}`)}
                  className="flex items-center gap-3 p-3.5 bg-white border border-[#DDE3DB] rounded-[14px] cursor-pointer hover:border-[#c4d0c0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all"
                >
                  <div
                    className="h-10 w-10 rounded-[10px] flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: getSeverityBg(a.severity) }}
                  >
                    {a.imageDataUrl && !a.imageDataUrl.startsWith('http') ? (
                      <img src={a.imageDataUrl} alt="" className="h-full w-full object-cover rounded-[10px]" />
                    ) : (
                      CROP_ICONS[a.crop] || '🌱'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1E2923] truncate">
                      Possible {a.disease}
                    </p>
                    <p className="text-xs text-[#66736A]">
                      {Math.round(a.confidence * 100)}% confidence · {formatDate(a.analyzedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant={SEVERITY_BADGE[a.severity]}>{a.severity}</Badge>
                    <ChevronRight className="h-3.5 w-3.5 text-[#DDE3DB]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default FieldDetailPage;
