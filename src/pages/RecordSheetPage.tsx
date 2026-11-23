import React, { useMemo, useState } from 'react';
import {
  Download,
  Plus,
  Search,
  Pencil,
  Trash2,
  Droplets,
  RotateCw,
  History,
} from 'lucide-react';
import { BatchHistoryModal } from '../components/BatchHistoryModal';
import { useCompost } from '../context/CompostContext';
import { MATERIAL_LABELS, MOISTURE_LABELS, UI_TEXT } from '../i18n/translations';
import { CompostRecord, MoistureObservation } from '../types';
import { downloadCsvFile, getTodayDateString } from '../utils/storage';

const MATERIAL_CHOICES = [
  'Dry leaves',
  'Vegetable waste',
  'Fruit peels',
  'Crop residues',
  'Other grower-approved organic materials',
  'None (Maintenance)',
];

export const RecordSheetPage: React.FC = () => {
  const { batches, records, settings, addRecord, updateRecord, deleteRecord, notify } = useCompost();
  const lang = settings.language;
  const t = UI_TEXT[lang];

  const [date, setDate] = useState(getTodayDateString());
  const [batchId, setBatchId] = useState(batches[0]?.id ?? '');
  const [materialAdded, setMaterialAdded] = useState(MATERIAL_CHOICES[0]);
  const [quantityKg, setQuantityKg] = useState('0');
  const [wateringActivity, setWateringActivity] = useState(false);
  const [turningActivity, setTurningActivity] = useState(false);
  const [moistureObservation, setMoistureObservation] = useState<string>('Optimal (Damp Sponge)');
  const [otherObservations, setOtherObservations] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [historyBatchId, setHistoryBatchId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records
      .filter((r) => {
        if (filterBatch !== 'all' && r.batchId !== filterBatch) return false;
        if (fromDate && r.date < fromDate) return false;
        if (toDate && r.date > toDate) return false;
        if (q) {
          const hay = `${r.id} ${r.batchId} ${r.materialAdded} ${r.moistureObservation} ${r.otherObservations}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [filterBatch, fromDate, records, searchQuery, toDate]);

  const resetForm = () => {
    setEditingId(null);
    setDate(getTodayDateString());
    setBatchId(batches[0]?.id ?? '');
    setMaterialAdded(MATERIAL_CHOICES[0]);
    setQuantityKg('0');
    setWateringActivity(false);
    setTurningActivity(false);
    setMoistureObservation('Optimal (Damp Sponge)');
    setOtherObservations('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) {
      notify('error', lang === 'kn' ? 'ದಯವಿಟ್ಟು ಮೊದಲು ಬ್ಯಾಚ್ ರಚಿಸಿ.' : 'Please select or create a compost batch first.');
      return;
    }
    const qty = quantityKg ? parseFloat(quantityKg) : 0;
    if (Number.isNaN(qty) || qty < 0) {
      notify('error', 'Quantity cannot be negative.');
      return;
    }

    if (editingId) {
      updateRecord(editingId, {
        date,
        batchId,
        materialAdded,
        quantityKg: qty,
        wateringActivity,
        turningActivity,
        moistureObservation,
        otherObservations: otherObservations.trim(),
      });
      resetForm();
    } else {
      addRecord({
        date,
        batchId,
        materialAdded,
        quantityKg: qty,
        wateringActivity,
        turningActivity,
        moistureObservation,
        otherObservations: otherObservations.trim(),
      });
      setQuantityKg('0');
      setWateringActivity(false);
      setTurningActivity(false);
      setOtherObservations('');
    }
  };

  const handleEdit = (rec: CompostRecord) => {
    setEditingId(rec.id);
    setDate(rec.date);
    setBatchId(rec.batchId);
    setMaterialAdded(rec.materialAdded);
    setQuantityKg(String(rec.quantityKg));
    setWateringActivity(rec.wateringActivity);
    setTurningActivity(rec.turningActivity);
    setMoistureObservation(rec.moistureObservation);
    setOtherObservations(rec.otherObservations);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportCsv = () => {
    const headers = [
      'Record ID',
      'Date',
      'Batch ID',
      'Material Added',
      'Quantity (kg)',
      'Watering Activity',
      'Turning Activity',
      'Moisture Observation',
      'Other Observations',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      r.batchId,
      r.materialAdded,
      r.quantityKg,
      r.wateringActivity ? 'Yes' : 'No',
      r.turningActivity ? 'Yes' : 'No',
      r.moistureObservation,
      r.otherObservations,
    ]);
    downloadCsvFile(`bannikuppe-compost-record-sheet-${getTodayDateString()}.csv`, headers, rows);
    notify('success', 'Compost record sheet downloaded as CSV.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
            {t.records.heading}
          </h1>
          <p className="text-sm text-[#526057] mt-1">{t.records.subheading}</p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filteredRecords.length === 0}
          className="min-h-[42px] px-4 py-2 rounded-lg bg-[#132A1C] text-white text-sm font-semibold hover:bg-[#1E6B3A] disabled:opacity-40 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{t.common.downloadCsv}</span>
        </button>
      </div>

      {/* Add / Edit Record Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#18241D]">
            {editingId ? `${t.common.edit} (${editingId})` : t.records.addRecord}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="rec-date" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.common.date}
            </label>
            <input
              id="rec-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular"
            />
          </div>

          <div>
            <label htmlFor="rec-batch" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.common.batchId}
            </label>
            <select
              id="rec-batch"
              required
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            >
              {batches.length === 0 ? (
                <option value="">{lang === 'kn' ? 'ಬ್ಯಾಚ್ ಲಭ್ಯವಿಲ್ಲ' : 'No batches created'}</option>
              ) : (
                batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} – {b.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label htmlFor="rec-material" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.records.materialAdded}
            </label>
            <select
              id="rec-material"
              value={materialAdded}
              onChange={(e) => setMaterialAdded(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            >
              {MATERIAL_CHOICES.map((m) => (
                <option key={m} value={m}>
                  {MATERIAL_LABELS[m]?.[lang] ?? m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rec-qty" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.records.quantityKg}
            </label>
            <input
              id="rec-qty"
              type="number"
              min="0"
              step="0.1"
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex items-center gap-4 min-h-[42px]">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#18241D] cursor-pointer">
              <input
                type="checkbox"
                checked={wateringActivity}
                onChange={(e) => setWateringActivity(e.target.checked)}
                className="w-4 h-4 accent-[#1E6B3A]"
              />
              <Droplets className="w-4 h-4 text-[#1E6B3A]" />
              <span>{t.records.watering}</span>
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#18241D] cursor-pointer">
              <input
                type="checkbox"
                checked={turningActivity}
                onChange={(e) => setTurningActivity(e.target.checked)}
                className="w-4 h-4 accent-[#1E6B3A]"
              />
              <RotateCw className="w-4 h-4 text-[#9A5B13]" />
              <span>{t.records.turning}</span>
            </label>
          </div>

          <div>
            <label htmlFor="rec-moisture" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.records.moistureObs}
            </label>
            <select
              id="rec-moisture"
              value={moistureObservation}
              onChange={(e) => setMoistureObservation(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            >
              {(Object.keys(MOISTURE_LABELS) as MoistureObservation[]).map((m) => (
                <option key={m} value={m}>
                  {MOISTURE_LABELS[m][lang]}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="rec-obs" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.records.otherObs}
              </label>
              <input
                id="rec-obs"
                type="text"
                value={otherObservations}
                onChange={(e) => setOtherObservations(e.target.value)}
                placeholder={lang === 'kn' ? 'ಕೀಟ, ವಾಸನೆ ಅಥವಾ ಇತರ ಟಿಪ್ಪಣಿ...' : 'Smell, temperature feel, or general notes...'}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              />
            </div>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 self-end"
            >
              <Plus className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E2DDD0] rounded-xl p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="rec-search" className="block text-xs font-semibold text-[#526057] mb-1">
            {t.common.search}
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#526057] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="rec-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.search}
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            />
          </div>
        </div>

        <div className="min-w-[160px]">
          <label htmlFor="filter-batch" className="block text-xs font-semibold text-[#526057] mb-1">
            {t.common.batchId}
          </label>
          <select
            id="filter-batch"
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
          >
            <option value="all">{t.common.all}</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="from-date" className="block text-xs font-semibold text-[#526057] mb-1">
            {t.records.fromDate}
          </label>
          <input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular"
          />
        </div>

        <div>
          <label htmlFor="to-date" className="block text-xs font-semibold text-[#526057] mb-1">
            {t.records.toDate}
          </label>
          <input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular"
          />
        </div>

        {(searchQuery || filterBatch !== 'all' || fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterBatch('all');
              setFromDate('');
              setToDate('');
            }}
            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] text-xs font-semibold text-[#526057] hover:text-[#18241D] hover:bg-[#F2EFE6]"
          >
            {t.records.clearFilters}
          </button>
        )}
      </div>

      {/* Digital Record Sheet Table */}
      <div className="bg-white border border-[#E2DDD0] rounded-xl overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#526057]">{t.common.noRecords}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F2EFE6] text-xs text-[#526057] border-b border-[#E2DDD0]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">{t.common.date}</th>
                  <th className="text-left px-4 py-3 font-semibold">{t.common.batchId}</th>
                  <th className="text-left px-4 py-3 font-semibold">{t.records.materialAdded}</th>
                  <th className="text-right px-4 py-3 font-semibold">{t.records.quantityKg}</th>
                  <th className="text-center px-4 py-3 font-semibold">{t.records.watering}</th>
                  <th className="text-center px-4 py-3 font-semibold">{t.records.turning}</th>
                  <th className="text-left px-4 py-3 font-semibold">{t.records.moistureObs}</th>
                  <th className="text-left px-4 py-3 font-semibold">{t.records.otherObs}</th>
                  <th className="text-right px-4 py-3 font-semibold">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD0]">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#FAF9F5]">
                    <td className="px-4 py-3 font-mono-tabular text-xs text-[#526057] whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setHistoryBatchId(rec.batchId)}
                        className="font-mono-tabular text-xs font-bold text-[#1E6B3A] hover:underline inline-flex items-center gap-1"
                        title={t.common.viewHistory}
                      >
                        <span>{rec.batchId}</span>
                        <History className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#18241D]">
                      {MATERIAL_LABELS[rec.materialAdded]?.[lang] ?? rec.materialAdded}
                      {rec.isDemo && (
                        <span className="ml-2 text-xs font-semibold text-[#1E6B3A]">
                          · {t.common.demoTag}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono-tabular font-semibold text-[#18241D] whitespace-nowrap">
                      {rec.quantityKg > 0 ? `${rec.quantityKg} ${t.common.kg}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold">
                      <span className={rec.wateringActivity ? 'text-[#1E6B3A]' : 'text-[#9CA3AF]'}>
                        {rec.wateringActivity ? t.common.yes : t.common.no}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold">
                      <span className={rec.turningActivity ? 'text-[#9A5B13]' : 'text-[#9CA3AF]'}>
                        {rec.turningActivity ? t.common.yes : t.common.no}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#18241D] whitespace-nowrap">
                      {rec.moistureObservation}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#526057] max-w-xs truncate">
                      {rec.otherObservations || '—'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(rec)}
                          aria-label={`${t.common.edit} ${rec.id}`}
                          className="p-2 rounded-lg text-[#526057] hover:text-[#18241D] hover:bg-[#F2EFE6]"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecord(rec.id)}
                          aria-label={`${t.common.delete} ${rec.id}`}
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

      <BatchHistoryModal batchId={historyBatchId} onClose={() => setHistoryBatchId(null)} />
    </div>
  );
};
