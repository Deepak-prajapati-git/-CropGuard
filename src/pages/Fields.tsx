import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MapPin, ChevronRight, Leaf } from 'lucide-react';
import { Shell, PageHeader } from '../components/layout/Shell';
import { Button, Card, EmptyState } from '../components/ui';
import { BottomSheet, useToast } from '../components/ui/Toast';
import { getFields, saveField } from '../lib/storage';
import { formatDate } from '../lib/utils';
import type { Field, CropName, FieldHealthStatus } from '../types';
import { CROPS } from '../lib/data';
import { generateId } from '../lib/storage';

const STATUS_STYLES: Record<FieldHealthStatus, string> = {
  'Healthy': 'bg-[#DCFCE7] text-[#2F7D4A]',
  'Attention Needed': 'bg-[#FEF3C7] text-[#B7791F]',
  'At Risk': 'bg-[#FDECEA] text-[#B54747]',
  'Critical': 'bg-[#FDE8E8] text-[#7B1515]',
};

const CROP_ICONS: Record<string, string> = {
  Tomato: '🍅', Potato: '🥔', Rice: '🌾', Wheat: '🌿', Maize: '🌽', Cotton: '☁️', Chili: '🌶️',
};

export const FieldsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [search, setSearch] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add field form state
  const [form, setForm] = useState({
    name: '',
    crop: 'Tomato' as CropName,
    area: '',
    plantingDate: '',
    location: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFields(getFields());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filtered = fields.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.crop.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Field name is required.';
    return errors;
  };

  const handleAdd = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));

    const newField: Field = {
      id: generateId('field'),
      name: form.name.trim(),
      crop: form.crop,
      area: form.area.trim() || 'Area not specified',
      plantingDate: form.plantingDate || undefined,
      location: form.location.trim() || undefined,
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      healthStatus: 'Healthy',
      detectionCount: 0,
      analysisIds: [],
    };

    saveField(newField);
    setFields(prev => [newField, ...prev]);
    setShowAddSheet(false);
    setForm({ name: '', crop: 'Tomato', area: '', plantingDate: '', location: '', notes: '' });
    setFormErrors({});
    setSaving(false);
    showToast(`${newField.name} added successfully.`, 'success');
  };

  return (
    <Shell title="My Fields">
      <PageHeader
        title="My Fields"
        subtitle="Monitor and manage your crop fields"
        actions={
          <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddSheet(true)}>
            Add field
          </Button>
        }
      />

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#66736A]" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search fields..."
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] placeholder:text-[#66736A] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            aria-label="Search fields"
          />
        </div>
        <Button
          variant="primary"
          size="md"
          className="lg:hidden"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setShowAddSheet(true)}
          aria-label="Add field"
        />
      </div>

      {/* Fields grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 skeleton rounded-[14px]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title={search ? 'No matching fields' : 'No fields yet'}
          description={search
            ? 'Try a different search term.'
            : 'Add your first field to start tracking analyses and crop health.'}
          action={
            <Button variant="primary" size="sm" onClick={() => setShowAddSheet(true)} icon={<Plus className="h-4 w-4" />}>
              Add field
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(field => (
            <FieldCard key={field.id} field={field} onClick={() => navigate(`/fields/${field.id}`)} />
          ))}
        </div>
      )}

      {/* Add field sheet */}
      <BottomSheet
        open={showAddSheet}
        onClose={() => { setShowAddSheet(false); setFormErrors({}); }}
        title="Add a new field"
      >
        <div className="space-y-4 pb-4">
          <div>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">
              Field name <span className="text-[#B54747]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. North Tomato Field"
              className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] placeholder:text-[#66736A] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            />
            {formErrors.name && <p className="text-xs text-[#B54747] mt-1" role="alert">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Crop type</label>
            <select
              value={form.crop}
              onChange={e => setForm(f => ({ ...f, crop: e.target.value as CropName }))}
              className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            >
              {CROPS.map(c => <option key={c} value={c}>{CROP_ICONS[c]} {c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Area</label>
              <input
                type="text"
                value={form.area}
                onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                placeholder="e.g. 2.5 acres"
                className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] placeholder:text-[#66736A] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Planting date</label>
              <input
                type="date"
                value={form.plantingDate}
                onChange={e => setForm(f => ({ ...f, plantingDate: e.target.value }))}
                className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Nashik region, Maharashtra"
              className="w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] placeholder:text-[#66736A] focus:outline-none focus:ring-2 focus:ring-[#174A35]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E2923] mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any additional field details..."
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#DDE3DB] rounded-[10px] text-[#1E2923] placeholder:text-[#66736A] focus:outline-none focus:ring-2 focus:ring-[#174A35] resize-none h-16"
            />
          </div>

          <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleAdd}>
            Add field
          </Button>
        </div>
      </BottomSheet>
    </Shell>
  );
};

// ─── Field Card ───────────────────────────────────────────────────────────────

const FieldCard: React.FC<{ field: Field; onClick: () => void }> = ({ field, onClick }) => (
  <Card hoverable padding="none" onClick={onClick} className="cursor-pointer">
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-[10px] bg-[#EEF1E9] flex items-center justify-center text-lg shrink-0">
          {CROP_ICONS[field.crop] || '🌱'}
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[field.healthStatus]}`}>
          {field.healthStatus}
        </span>
      </div>
      <h3 className="text-sm font-bold text-[#1E2923] mb-0.5 leading-snug">{field.name}</h3>
      <p className="text-xs text-[#66736A] mb-3">{field.crop} · {field.area}</p>
      <div className="flex items-center justify-between text-xs text-[#66736A]">
        <span>{field.detectionCount} detection{field.detectionCount !== 1 ? 's' : ''}</span>
        {field.lastAnalyzedAt ? (
          <span className="flex items-center gap-1">
            <Leaf className="h-3 w-3" />
            {formatDate(field.lastAnalyzedAt)}
          </span>
        ) : (
          <span>Not analysed yet</span>
        )}
      </div>
    </div>
    <div className="px-4 py-2.5 border-t border-[#DDE3DB] flex items-center justify-between">
      <span className="text-xs font-medium text-[#174A35]">View field details</span>
      <ChevronRight className="h-3.5 w-3.5 text-[#174A35]" />
    </div>
  </Card>
);

export default FieldsPage;
