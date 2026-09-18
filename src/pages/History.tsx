import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortDesc, Trash2, Download, ChevronRight, X } from 'lucide-react';
import { Shell, PageHeader } from '../components/layout/Shell';
import { Button, Badge, Card, EmptyState, Spinner } from '../components/ui';
import { ConfirmDialog, BottomSheet, useToast } from '../components/ui/Toast';
import { getAnalyses, deleteAnalysis } from '../lib/storage';
import { formatDate, formatConfidence, getSeverityBg } from '../lib/utils';
import type { AnalysisResult, CropName, Severity } from '../types';
import { CROPS } from '../lib/data';

const SEVERITY_BADGE: Record<Severity, React.ComponentProps<typeof Badge>['variant']> = {
  Healthy: 'healthy', Low: 'low', Moderate: 'moderate', High: 'high', Critical: 'critical',
};

const CROP_ICONS: Record<string, string> = {
  Tomato: '🍅', Potato: '🥔', Rice: '🌾', Wheat: '🌿', Maize: '🌽', Cotton: '☁️', Chili: '🌶️',
};

type SortOrder = 'newest' | 'oldest';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCrop, setFilterCrop] = useState<CropName | ''>('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | ''>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyses(getAnalyses());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let result = [...analyses];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.crop.toLowerCase().includes(q) ||
        a.disease.toLowerCase().includes(q) ||
        (a.fieldName?.toLowerCase().includes(q))
      );
    }
    if (filterCrop) result = result.filter(a => a.crop === filterCrop);
    if (filterSeverity) result = result.filter(a => a.severity === filterSeverity);

    result.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
        : new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime()
    );

    return result;
  }, [analyses, search, filterCrop, filterSeverity, sortOrder]);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteAnalysis(deleteId);
    setAnalyses(prev => prev.filter(a => a.id !== deleteId));
    setDeleteId(null);
    showToast('Analysis deleted.', 'info');
  };

  const clearFilters = () => {
    setSearch('');
    setFilterCrop('');
    setFilterSeverity('');
  };

  const hasFilters = search || filterCrop || filterSeverity;

  return (
    <Shell title="Detection History">
      <PageHeader title="Detection History" subtitle="All your crop analyses in one place" />

      {/* Search + controls */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#66736A]" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by crop, disease, or field..."
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] placeholder:text-[#66736A] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            aria-label="Search analyses"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
              <X className="h-4 w-4 text-[#66736A]" />
            </button>
          )}
        </div>

        {/* Desktop filters */}
        <div className="hidden lg:flex gap-2">
          <select
            value={filterCrop}
            onChange={e => setFilterCrop(e.target.value as CropName | '')}
            className="h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            aria-label="Filter by crop"
          >
            <option value="">All crops</option>
            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value as Severity | '')}
            className="h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            aria-label="Filter by severity"
          >
            <option value="">All severity</option>
            {(['Healthy', 'Low', 'Moderate', 'High', 'Critical'] as Severity[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(o => o === 'newest' ? 'oldest' : 'newest')}
            className="h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#66736A] flex items-center gap-1.5 hover:bg-[#EEF1E9] transition-colors"
            aria-label={`Sort: ${sortOrder === 'newest' ? 'newest first' : 'oldest first'}`}
          >
            <SortDesc className="h-4 w-4" />
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </button>
        </div>

        {/* Mobile filter button */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden h-10 w-10 bg-white border border-[#DDE3DB] rounded-[10px] flex items-center justify-center hover:bg-[#EEF1E9] relative"
          aria-label="Open filters"
        >
          <Filter className="h-4 w-4 text-[#66736A]" />
          {hasFilters && <div className="absolute top-1 right-1 h-2 w-2 bg-[#174A35] rounded-full" />}
        </button>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filterCrop && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DDEBDF] text-[#174A35] text-xs font-medium rounded-full">
              {filterCrop}
              <button onClick={() => setFilterCrop('')} aria-label="Remove crop filter"><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterSeverity && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DDEBDF] text-[#174A35] text-xs font-medium rounded-full">
              {filterSeverity}
              <button onClick={() => setFilterSeverity('')} aria-label="Remove severity filter"><X className="h-3 w-3" /></button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DDEBDF] text-[#174A35] text-xs font-medium rounded-full">
              "{search}"
              <button onClick={() => setSearch('')} aria-label="Clear search"><X className="h-3 w-3" /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-[#B54747] font-medium hover:underline">
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-[#66736A] mb-3">
        {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'analysis' : 'analyses'}`}
      </p>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size={24} className="text-[#174A35]" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title={hasFilters ? 'No matching analyses' : 'No crop analyses yet'}
          description={hasFilters
            ? 'Try adjusting your filters or search term.'
            : 'Upload your first leaf image to start building your field history.'}
          action={
            hasFilters
              ? <Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>
              : <Button variant="primary" size="sm" onClick={() => navigate('/analyze')}>Analyze a crop</Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map(analysis => (
            <HistoryCard
              key={analysis.id}
              analysis={analysis}
              onOpen={() => navigate(`/result/${analysis.id}`)}
              onDelete={() => setDeleteId(analysis.id)}
            />
          ))}
        </div>
      )}

      {/* Mobile filter sheet */}
      <BottomSheet open={showFilters} onClose={() => setShowFilters(false)} title="Filters">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Crop</label>
            <select
              value={filterCrop}
              onChange={e => setFilterCrop(e.target.value as CropName | '')}
              className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            >
              <option value="">All crops</option>
              {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {(['', 'Healthy', 'Low', 'Moderate', 'High', 'Critical'] as (Severity | '')[]).map(s => (
                <button
                  key={s || 'all'}
                  onClick={() => setFilterSeverity(s)}
                  className={`h-9 rounded-[10px] text-sm font-medium border transition-colors ${
                    filterSeverity === s
                      ? 'border-[#174A35] bg-[#DDEBDF] text-[#174A35]'
                      : 'border-[#DDE3DB] bg-white text-[#66736A]'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Sort order</label>
            <div className="flex gap-2">
              {(['newest', 'oldest'] as SortOrder[]).map(o => (
                <button
                  key={o}
                  onClick={() => setSortOrder(o)}
                  className={`flex-1 h-9 rounded-[10px] text-sm font-medium border transition-colors capitalize ${
                    sortOrder === o
                      ? 'border-[#174A35] bg-[#DDEBDF] text-[#174A35]'
                      : 'border-[#DDE3DB] bg-white text-[#66736A]'
                  }`}
                >
                  {o} first
                </button>
              ))}
            </div>
          </div>
          <Button variant="primary" size="lg" fullWidth onClick={() => setShowFilters(false)}>
            Apply filters
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="md" fullWidth onClick={() => { clearFilters(); setShowFilters(false); }}>
              Clear all filters
            </Button>
          )}
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this analysis?"
        description="This action cannot be undone. The analysis will be permanently removed from your history."
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Shell>
  );
};

// ─── History Card ─────────────────────────────────────────────────────────────

const HistoryCard: React.FC<{
  analysis: AnalysisResult;
  onOpen: () => void;
  onDelete: () => void;
}> = ({ analysis, onOpen, onDelete }) => (
  <Card hoverable padding="none" className="cursor-pointer group" onClick={onOpen}>
    <div className="flex items-center gap-3 p-3.5">
      {/* Thumb */}
      <div
        className="h-12 w-12 rounded-[10px] flex items-center justify-center text-xl shrink-0 overflow-hidden"
        style={{ backgroundColor: getSeverityBg(analysis.severity) }}
      >
        {analysis.imageDataUrl && !analysis.imageDataUrl.startsWith('http') ? (
          <img src={analysis.imageDataUrl} alt="" className="h-full w-full object-cover rounded-[10px]" />
        ) : (
          CROP_ICONS[analysis.crop] || '🌱'
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-semibold text-[#1E2923] truncate">
            {analysis.crop} — Possible {analysis.disease}
          </p>
        </div>
        <p className="text-xs text-[#66736A] truncate mt-0.5">
          {analysis.fieldName || 'No field'} · {formatConfidence(analysis.confidence)} confidence
        </p>
        <p className="text-xs text-[#66736A]">{formatDate(analysis.analyzedAt)}</p>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Badge variant={SEVERITY_BADGE[analysis.severity]}>{analysis.severity}</Badge>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="h-7 w-7 rounded-[8px] flex items-center justify-center hover:bg-[#FDECEA] transition-colors"
            aria-label="Delete analysis"
          >
            <Trash2 className="h-3.5 w-3.5 text-[#B54747]" />
          </button>
          <ChevronRight className="h-4 w-4 text-[#DDE3DB]" />
        </div>
      </div>
    </div>
  </Card>
);

export default HistoryPage;
