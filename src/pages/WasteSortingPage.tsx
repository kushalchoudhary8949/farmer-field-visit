import React, { useMemo, useState } from 'react';
import {
  Leaf,
  Trash2,
  AlertTriangle,
  Check,
  XCircle,
  Pencil,
  Plus,
  Recycle,
} from 'lucide-react';
import { getCategoryLabel, useCompost } from '../context/CompostContext';
import { MATERIAL_LABELS, UI_TEXT } from '../i18n/translations';
import { WasteCategory, WasteEntry } from '../types';
import { getTodayDateString } from '../utils/storage';

const BIO_MATERIALS = [
  'Dry leaves',
  'Vegetable waste',
  'Fruit peels',
  'Crop residues',
  'Other grower-approved organic materials',
];

const REJECT_MATERIALS = ['Plastic', 'Glass', 'Metal', 'Other unwanted materials'];

export const WasteSortingPage: React.FC = () => {
  const {
    wasteEntries,
    batches,
    settings,
    addWasteEntry,
    updateWasteEntry,
    deleteWasteEntry,
    notify,
  } = useCompost();

  const lang = settings.language;
  const t = UI_TEXT[lang];

  const [category, setCategory] = useState<WasteCategory>('biodegradable');
  const [material, setMaterial] = useState<string>(BIO_MATERIALS[0]);
  const [customMaterial, setCustomMaterial] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [notes, setNotes] = useState<string>('');
  const [batchId, setBatchId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | WasteCategory>('all');

  const activeBatches = useMemo(
    () => batches.filter((b) => b.stage !== 'Ready for use'),
    [batches]
  );

  const totals = useMemo(() => {
    const bio = wasteEntries
      .filter((w) => w.category === 'biodegradable')
      .reduce((s, w) => s + w.weightKg, 0);
    const rejected = wasteEntries
      .filter((w) => w.category === 'non-compostable')
      .reduce((s, w) => s + w.weightKg, 0);
    const review = wasteEntries
      .filter((w) => w.category === 'review')
      .reduce((s, w) => s + w.weightKg, 0);
    const total = bio + rejected + review;
    const bioPct = total > 0 ? Math.round((bio / total) * 100) : 0;
    const rejectPct = total > 0 ? Math.round((rejected / total) * 100) : 0;
    return {
      bio: Number(bio.toFixed(1)),
      rejected: Number(rejected.toFixed(1)),
      review: Number(review.toFixed(1)),
      total: Number(total.toFixed(1)),
      bioPct,
      rejectPct,
    };
  }, [wasteEntries]);

  const reviewEntries = useMemo(
    () => wasteEntries.filter((w) => w.category === 'review'),
    [wasteEntries]
  );

  const filteredEntries = useMemo(() => {
    const list =
      filterCategory === 'all'
        ? wasteEntries
        : wasteEntries.filter((w) => w.category === filterCategory);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [filterCategory, wasteEntries]);

  const handleCategoryChange = (nextCat: WasteCategory) => {
    setCategory(nextCat);
    if (nextCat === 'biodegradable') {
      setMaterial(BIO_MATERIALS[0]);
    } else if (nextCat === 'non-compostable') {
      setMaterial(REJECT_MATERIALS[0]);
      setBatchId('');
    } else {
      setMaterial('Uncertain / Mixed material');
      setBatchId('');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCategory('biodegradable');
    setMaterial(BIO_MATERIALS[0]);
    setCustomMaterial('');
    setWeightKg('');
    setDate(getTodayDateString());
    setNotes('');
    setBatchId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weightKg);
    if (Number.isNaN(numWeight) || numWeight <= 0) {
      notify('error', lang === 'kn' ? 'ತೂಕವು 0 ಕ್ಕಿಂತ ಹೆಚ್ಚಿರಬೇಕು.' : 'Please enter a positive weight in kg.');
      return;
    }

    const finalMaterial =
      category === 'review'
        ? customMaterial.trim() || material
        : material;

    if (editingId) {
      updateWasteEntry(editingId, {
        category,
        material: finalMaterial,
        weightKg: numWeight,
        date,
        notes: notes.trim(),
        batchId: category === 'biodegradable' && batchId ? batchId : undefined,
      });
      resetForm();
    } else {
      addWasteEntry({
        category,
        material: finalMaterial,
        weightKg: numWeight,
        date,
        notes: notes.trim(),
        batchId: category === 'biodegradable' && batchId ? batchId : undefined,
      });
      setWeightKg('');
      setNotes('');
      setCustomMaterial('');
    }
  };

  const handleEdit = (entry: WasteEntry) => {
    setEditingId(entry.id);
    setCategory(entry.category);
    if (entry.category === 'review') {
      setCustomMaterial(entry.material);
    } else {
      setMaterial(entry.material);
    }
    setWeightKg(String(entry.weightKg));
    setDate(entry.date);
    setNotes(entry.notes);
    setBatchId(entry.batchId ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
          {t.sorting.heading}
        </h1>
        <p className="text-sm text-[#526057] mt-1">{t.sorting.subheading}</p>
      </div>

      {/* Visual Two-Bin Sorting Interface + Review Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bin A: Biodegradable */}
        <button
          type="button"
          onClick={() => handleCategoryChange('biodegradable')}
          className={`text-left rounded-xl p-5 border transition-colors ${
            category === 'biodegradable'
              ? 'bg-[#E9F5EE] border-[#1E6B3A] ring-2 ring-[#1E6B3A]/20'
              : 'bg-white border-[#E2DDD0] hover:bg-[#FAF9F5]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1E6B3A] text-white flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-[#18241D] font-mono-tabular">
              {totals.bio} {t.common.kg}
            </span>
          </div>
          <h2 className="text-base font-bold text-[#18241D] mt-4">{t.sorting.biodegradableBin}</h2>
          <p className="text-xs text-[#526057] mt-1">
            {lang === 'kn'
              ? 'ಒಣ ಎಲೆಗಳು, ತರಕಾರಿ, ಹಣ್ಣಿನ ಸಿಪ್ಪೆ, ಬೆಳೆ ಅವಶೇಷಗಳು'
              : 'Dry leaves, vegetable waste, fruit peels, crop residues'}
          </p>
        </button>

        {/* Bin B: Non-Compostable */}
        <button
          type="button"
          onClick={() => handleCategoryChange('non-compostable')}
          className={`text-left rounded-xl p-5 border transition-colors ${
            category === 'non-compostable'
              ? 'bg-[#FEF2F2] border-[#DC2626] ring-2 ring-[#DC2626]/20'
              : 'bg-white border-[#E2DDD0] hover:bg-[#FAF9F5]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-[#18241D] font-mono-tabular">
              {totals.rejected} {t.common.kg}
            </span>
          </div>
          <h2 className="text-base font-bold text-[#18241D] mt-4">{t.sorting.nonCompostableBin}</h2>
          <p className="text-xs text-[#526057] mt-1">
            {lang === 'kn'
              ? 'ಪ್ಲಾಸ್ಟಿಕ್, ಗಾಜು, ಲೋಹ ಮತ್ತು ಇತರ ಕೊಳೆಯದ ವಸ್ತುಗಳು'
              : 'Plastic, glass, metal, and other unwanted materials'}
          </p>
        </button>

        {/* Tray C: Needs Review */}
        <button
          type="button"
          onClick={() => handleCategoryChange('review')}
          className={`text-left rounded-xl p-5 border transition-colors ${
            category === 'review'
              ? 'bg-[#FFFBEB] border-[#D97706] ring-2 ring-[#D97706]/20'
              : 'bg-white border-[#E2DDD0] hover:bg-[#FAF9F5]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-[#18241D] font-mono-tabular">
              {totals.review} {t.common.kg}
            </span>
          </div>
          <h2 className="text-base font-bold text-[#18241D] mt-4">{t.sorting.reviewTray}</h2>
          <p className="text-xs text-[#526057] mt-1">{t.sorting.reviewNotice}</p>
        </button>
      </div>

      {/* Sorting Ratio Bar */}
      <div className="bg-white border border-[#E2DDD0] rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#526057] mb-2">
          <span>
            {t.sorting.totalBio}: <strong className="text-[#1E6B3A] font-mono-tabular">{totals.bioPct}%</strong>
          </span>
          <span>
            {t.sorting.totalRejected}: <strong className="text-[#DC2626] font-mono-tabular">{totals.rejectPct}%</strong>
          </span>
          <span>
            Total Logged: <strong className="text-[#18241D] font-mono-tabular">{totals.total} {t.common.kg}</strong>
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-[#F2EFE6] overflow-hidden flex">
          <div
            className="bg-[#1E6B3A] h-full transition-all duration-300"
            style={{ width: `${totals.bioPct}%` }}
          />
          <div
            className="bg-[#DC2626] h-full transition-all duration-300"
            style={{ width: `${totals.rejectPct}%` }}
          />
        </div>
      </div>

      {/* Entry Form + Review Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Add/Edit Waste Entry Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#18241D] flex items-center gap-2">
              <Recycle className="w-4 h-4 text-[#1E6B3A]" />
              <span>{editingId ? t.common.edit : t.sorting.addEntryTitle}</span>
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-medium text-[#526057] hover:text-[#18241D]"
              >
                {t.common.cancel}
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.sorting.categoryLabel}
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F2EFE6] rounded-lg">
              {(['biodegradable', 'non-compostable', 'review'] as WasteCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`min-h-[38px] px-2 py-1.5 rounded-md text-xs font-semibold transition-colors truncate ${
                    category === cat
                      ? 'bg-white text-[#18241D] shadow-xs'
                      : 'text-[#526057] hover:text-[#18241D]'
                  }`}
                >
                  {getCategoryLabel(cat, lang)}
                </button>
              ))}
            </div>
          </div>

          {category === 'review' ? (
            <div>
              <label htmlFor="custom-material" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.sorting.materialLabel}
              </label>
              <input
                id="custom-material"
                type="text"
                required
                placeholder={lang === 'kn' ? 'ಉದಾ: ಮೇಣದ ಕಾಗದ, ಮಿಶ್ರ ದಾರ...' : 'e.g. Waxed seed packet, unknown fiber'}
                value={customMaterial}
                onChange={(e) => setCustomMaterial(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm focus:outline-2 focus:outline-[#1E6B3A]"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="material-select" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.sorting.materialLabel}
              </label>
              <select
                id="material-select"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm focus:outline-2 focus:outline-[#1E6B3A]"
              >
                {(category === 'biodegradable' ? BIO_MATERIALS : REJECT_MATERIALS).map((mat) => (
                  <option key={mat} value={mat}>
                    {MATERIAL_LABELS[mat]?.[lang] ?? mat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="weight-input" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.sorting.weightLabel}
              </label>
              <input
                id="weight-input"
                type="number"
                step="0.1"
                min="0.1"
                required
                placeholder="0.0"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular focus:outline-2 focus:outline-[#1E6B3A]"
              />
            </div>
            <div>
              <label htmlFor="date-input" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.common.date}
              </label>
              <input
                id="date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular focus:outline-2 focus:outline-[#1E6B3A]"
              />
            </div>
          </div>

          {category === 'biodegradable' && !editingId && (
            <div>
              <label htmlFor="assign-batch" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.sorting.assignBatchLabel}
              </label>
              <select
                id="assign-batch"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm focus:outline-2 focus:outline-[#1E6B3A]"
              >
                <option value="">{lang === 'kn' ? 'ಯಾವುದೇ ಬ್ಯಾಚ್ ಇಲ್ಲ' : 'Keep at Sorting Point (unassigned)'}</option>
                {activeBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} – {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="notes-input" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.common.notes}
            </label>
            <textarea
              id="notes-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={lang === 'kn' ? 'ಸಂಗ್ರಹಣೆ ಸ್ಥಳ ಅಥವಾ ವಿವರ...' : 'Plot location or condition notes...'}
              className="w-full px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm focus:outline-2 focus:outline-[#1E6B3A]"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? t.common.save : t.common.save}</span>
          </button>
        </form>

        {/* Right Column: Review Queue + Entries Table */}
        <div className="lg:col-span-7 space-y-6">
          {reviewEntries.length > 0 && (
            <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#92400E]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {t.sorting.reviewTray} ({reviewEntries.length})
                </span>
              </div>
              <div className="space-y-2">
                {reviewEntries.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#FDE68A] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#18241D]">
                        {item.material} ·{' '}
                        <span className="font-mono-tabular">{item.weightKg} {t.common.kg}</span>
                      </p>
                      <p className="text-xs text-[#526057] mt-0.5">{item.notes || item.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateWasteEntry(item.id, {
                            category: 'biodegradable',
                            material: 'Other grower-approved organic materials',
                          })
                        }
                        className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#1E6B3A] text-white text-xs font-semibold hover:bg-[#16532C] inline-flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.sorting.markBio}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateWasteEntry(item.id, {
                            category: 'non-compostable',
                            material: 'Other unwanted materials',
                          })
                        }
                        className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-semibold hover:bg-[#B91C1C] inline-flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t.sorting.markRejected}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sorting Log Table */}
          <div className="bg-white border border-[#E2DDD0] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2DDD0] flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#18241D]">{t.sorting.entriesTitle}</h2>
              <div className="flex items-center gap-1 p-1 bg-[#F2EFE6] rounded-lg">
                {(['all', 'biodegradable', 'non-compostable', 'review'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterCategory(f)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      filterCategory === f
                        ? 'bg-white text-[#18241D] shadow-xs'
                        : 'text-[#526057] hover:text-[#18241D]'
                    }`}
                  >
                    {f === 'all' ? t.common.all : getCategoryLabel(f, lang)}
                  </button>
                ))}
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#526057]">{t.common.noRecords}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF9F5] text-xs text-[#526057] border-b border-[#E2DDD0]">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">{t.common.date}</th>
                      <th className="text-left px-4 py-3 font-semibold">{t.sorting.materialLabel}</th>
                      <th className="text-left px-4 py-3 font-semibold">{t.sorting.categoryLabel}</th>
                      <th className="text-right px-4 py-3 font-semibold">{t.sorting.weightLabel}</th>
                      <th className="text-right px-4 py-3 font-semibold">{t.common.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD0]">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#FAF9F5]">
                        <td className="px-4 py-3 font-mono-tabular text-xs text-[#526057] whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#18241D]">
                            {MATERIAL_LABELS[entry.material]?.[lang] ?? entry.material}
                            {entry.isDemo && (
                              <span className="ml-2 text-xs font-semibold text-[#1E6B3A]">
                                · {t.common.demoTag}
                              </span>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="text-xs text-[#526057] line-clamp-1 mt-0.5">{entry.notes}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap">
                          <span
                            className={`font-semibold ${
                              entry.category === 'biodegradable'
                                ? 'text-[#1E6B3A]'
                                : entry.category === 'non-compostable'
                                  ? 'text-[#DC2626]'
                                  : 'text-[#D97706]'
                            }`}
                          >
                            {getCategoryLabel(entry.category, lang)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono-tabular font-semibold text-[#18241D] whitespace-nowrap">
                          {entry.weightKg} {t.common.kg}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(entry)}
                              aria-label={`${t.common.edit} ${entry.id}`}
                              className="p-2 rounded-lg text-[#526057] hover:text-[#18241D] hover:bg-[#F2EFE6]"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteWasteEntry(entry.id)}
                              aria-label={`${t.common.delete} ${entry.id}`}
                              className="p-2 rounded-lg text-[#526057] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
