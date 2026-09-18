import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Microscope, TrendingUp, AlertTriangle, Leaf, Clock, MapPin, ChevronRight, Info } from 'lucide-react';
import { Shell, PageHeader } from '../components/layout/Shell';
import { Button, Card, Badge, Skeleton } from '../components/ui';
import { getAnalyses, getFields, getSettings } from '../lib/storage';
import { formatDate, getGreeting, getSeverityBg, getSeverityColor, formatConfidence } from '../lib/utils';
import type { AnalysisResult, Field, Severity } from '../types';

const SEVERITY_BADGE_MAP: Record<Severity, React.ComponentProps<typeof Badge>['variant']> = {
  Healthy: 'healthy',
  Low: 'low',
  Moderate: 'moderate',
  High: 'high',
  Critical: 'critical',
};

const CROP_ICONS: Record<string, string> = {
  Tomato: '🍅', Potato: '🥔', Rice: '🌾', Wheat: '🌿', Maize: '🌽', Cotton: '☁️', Chili: '🌶️',
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const settings = getSettings();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyses(getAnalyses().slice(0, 5));
      setFields(getFields());
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const fieldsNeedingAttention = fields.filter(f => f.healthStatus !== 'Healthy').length;
  const healthyFields = fields.filter(f => f.healthStatus === 'Healthy').length;
  const analysesThisMonth = analyses.length;

  const insights = [
    fields.find(f => f.detectionCount >= 2)
      ? `${fields.find(f => f.detectionCount >= 2)!.name} has ${fields.find(f => f.detectionCount >= 2)!.detectionCount} recorded detections recently.`
      : null,
    analyses.find(a => a.confidence < 0.7)
      ? `Your last ${analyses.find(a => a.confidence < 0.7)!.crop} analysis had medium confidence. A clearer image may improve the result.`
      : null,
    fields.find(f => f.lastAnalyzedAt && (new Date().getTime() - new Date(f.lastAnalyzedAt).getTime()) > 7 * 86400000)
      ? `${fields.find(f => f.lastAnalyzedAt && (new Date().getTime() - new Date(f.lastAnalyzedAt).getTime()) > 7 * 86400000)!.name} has not been checked in over 7 days.`
      : null,
  ].filter(Boolean) as string[];

  return (
    <Shell title="Home">
      <PageHeader
        title={`${getGreeting()}, ${settings.name}`}
        subtitle={settings.region}
      />

      {/* Hero action panel */}
      <Card className="mb-6 overflow-hidden" padding="none">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-5 lg:p-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#DDEBDF] rounded-full mb-3">
              <Leaf className="h-3 w-3 text-[#174A35]" />
              <span className="text-xs font-semibold text-[#174A35]">Quick action</span>
            </div>
            <h2 className="text-xl font-bold text-[#1E2923] mb-2 leading-snug">
              Check a crop before<br className="lg:hidden" /> the problem spreads.
            </h2>
            <p className="text-sm text-[#66736A] mb-4 leading-relaxed max-w-sm">
              Upload a close-up leaf image and review possible symptoms, severity, and recommended next steps.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/analyze')}
                icon={<Microscope className="h-4 w-4" />}
              >
                Analyze crop
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/analyze?sample=true')}
              >
                Try sample image
              </Button>
              <button
                className="text-sm text-[#174A35] underline underline-offset-2 font-medium hover:text-[#103A29] transition-colors"
                onClick={() => navigate('/library')}
              >
                How it works
              </button>
            </div>
          </div>
          {/* Visual accent */}
          <div className="hidden lg:flex w-48 bg-gradient-to-br from-[#174A35] to-[#6F8F55] items-center justify-center rounded-r-[14px]">
            <div className="text-5xl opacity-90">🌿</div>
          </div>
        </div>
      </Card>

      {/* How it works */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { step: '1', label: 'Capture', icon: '📷' },
          { step: '2', label: 'Analyse', icon: '🔍' },
          { step: '3', label: 'Understand', icon: '📋' },
          { step: '4', label: 'Act', icon: '✅' },
        ].map((s, i) => (
          <div key={s.step} className="flex flex-col items-center text-center gap-1 relative">
            <div className="h-10 w-10 rounded-full bg-[#DDEBDF] flex items-center justify-center text-lg mb-1 relative z-10">
              {s.icon}
            </div>
            {i < 3 && <div className="hidden lg:block absolute left-1/2 top-5 w-full h-px bg-[#DDE3DB] z-0" />}
            <span className="text-xs font-semibold text-[#1E2923]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-[14px]" />)
        ) : (
          <>
            <StatCard label="Fields monitored" value={fields.length} icon="🌾" context="Total active fields" />
            <StatCard label="Analyses this month" value={analysesThisMonth} icon="🔬" context="Total completed" />
            <StatCard label="Needs attention" value={fieldsNeedingAttention} icon="⚠️" context="Fields at moderate+ risk" color="#B7791F" />
            <StatCard label="Healthy fields" value={healthyFields} icon="✅" context="Low or no risk detected" color="#2F7D4A" />
          </>
        )}
      </div>

      {/* Insights */}
      {!loading && insights.length > 0 && (
        <div className="mb-6 space-y-2">
          {insights.map((insight, i) => (
            <div key={i} className="flex gap-2.5 items-start p-3.5 bg-[#DDEBDF] rounded-[10px]">
              <Info className="h-4 w-4 text-[#174A35] shrink-0 mt-0.5" />
              <p className="text-sm text-[#174A35]">{insight}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent detections */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1E2923]">Recent analyses</h2>
          <button
            onClick={() => navigate('/history')}
            className="text-sm text-[#174A35] font-medium flex items-center gap-0.5 hover:underline"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-[14px]" />)}
          </div>
        ) : analyses.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-sm text-[#66736A]">No analyses yet. Upload your first leaf image to get started.</p>
            <Button variant="primary" size="sm" className="mt-3" onClick={() => navigate('/analyze')}>
              Analyze a crop
            </Button>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {analyses.map(analysis => (
              <AnalysisCard key={analysis.id} analysis={analysis} onClick={() => navigate(`/result/${analysis.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Field health */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1E2923]">Field overview</h2>
          <button
            onClick={() => navigate('/fields')}
            className="text-sm text-[#174A35] font-medium flex items-center gap-0.5 hover:underline"
          >
            Manage fields <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-[14px]" />)}
          </div>
        ) : (
          <div className="space-y-2.5">
            {fields.map(field => (
              <FieldRow key={field.id} field={field} onClick={() => navigate(`/fields/${field.id}`)} />
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: string;
  context: string;
  color?: string;
}> = ({ label, value, icon, context, color }) => (
  <Card padding="md" className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-lg">{icon}</span>
      <TrendingUp className="h-3.5 w-3.5 text-[#DDE3DB]" />
    </div>
    <div>
      <p className="text-2xl font-bold" style={{ color: color || '#1E2923' }}>{value}</p>
      <p className="text-xs font-medium text-[#1E2923] truncate">{label}</p>
      <p className="text-xs text-[#66736A] truncate">{context}</p>
    </div>
  </Card>
);

const AnalysisCard: React.FC<{
  analysis: AnalysisResult;
  onClick: () => void;
}> = ({ analysis, onClick }) => (
  <Card hoverable padding="none" onClick={onClick} className="cursor-pointer">
    <div className="flex items-center gap-3 p-3.5">
      <div
        className="h-10 w-10 rounded-[10px] flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: getSeverityBg(analysis.severity) }}
      >
        {CROP_ICONS[analysis.crop] || '🌱'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-[#1E2923] truncate">
            {analysis.crop} — Possible {analysis.disease}
          </p>
        </div>
        <p className="text-xs text-[#66736A] truncate">
          {analysis.fieldName || 'No field'} · {formatConfidence(analysis.confidence)} confidence · {formatDate(analysis.analyzedAt)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Badge variant={SEVERITY_BADGE_MAP[analysis.severity]}>{analysis.severity}</Badge>
        <ChevronRight className="h-3.5 w-3.5 text-[#DDE3DB]" />
      </div>
    </div>
  </Card>
);

const FieldRow: React.FC<{
  field: Field;
  onClick: () => void;
}> = ({ field, onClick }) => {
  const statusStyles: Record<string, string> = {
    'Healthy': 'bg-[#DCFCE7] text-[#2F7D4A]',
    'Attention Needed': 'bg-[#FEF3C7] text-[#B7791F]',
    'At Risk': 'bg-[#FDECEA] text-[#B54747]',
    'Critical': 'bg-[#FDE8E8] text-[#7B1515]',
  };
  return (
    <Card hoverable padding="none" onClick={onClick} className="cursor-pointer">
      <div className="flex items-center gap-3 p-3.5">
        <div className="h-10 w-10 rounded-[10px] bg-[#EEF1E9] flex items-center justify-center shrink-0">
          <MapPin className="h-4.5 w-4.5 text-[#6F8F55]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1E2923] truncate">{field.name}</p>
          <p className="text-xs text-[#66736A]">
            {field.crop} · {field.area} · {field.detectionCount} detection{field.detectionCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[field.healthStatus] || statusStyles['Healthy']}`}>
            {field.healthStatus}
          </span>
          {field.lastAnalyzedAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#DDE3DB]" />
              <span className="text-xs text-[#66736A]">{formatDate(field.lastAnalyzedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HomePage;
