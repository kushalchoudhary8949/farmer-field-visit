import React, { useState } from 'react';
import {
  Plus,
  Droplets,
  RotateCw,
  ArrowRight,
  History,
  CheckCircle2,
  ClipboardCheck,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { BatchHistoryModal } from '../components/BatchHistoryModal';
import { isBatchReadyEligible, useCompost } from '../context/CompostContext';
import { MATERIAL_LABELS, MOISTURE_LABELS, STAGE_LABELS, UI_TEXT } from '../i18n/translations';
import { COMPOST_STAGES, CompostBatch, MoistureObservation } from '../types';
import { getTodayDateString } from '../utils/storage';

const ORGANIC_OPTIONS = [
  'Dry leaves',
  'Vegetable waste',
  'Fruit peels',
  'Crop residues',
  'Other grower-approved organic materials',
];

export const CompostBatchesPage: React.FC = () => {
  const {
    batches,
    assessments,
    settings,
    createBatch,
    updateBatch,
    addMaterialToBatch,
    recordBatchWatering,
    recordBatchTurning,
    advanceBatchStage,
    setActivePage,
    setSelectedBatchForMaturity,
  } = useCompost();

  const lang = settings.language;
  const t = UI_TEXT[lang];

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState(getTodayDateString());
  const [newMaterial, setNewMaterial] = useState(ORGANIC_OPTIONS[0]);
  const [newWeight, setNewWeight] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Inline action modal state per batch
  const [activeAction, setActiveAction] = useState<{
    batchId: string;
    type: 'material' | 'watering' | 'turning';
  } | null>(null);
  const [actionMaterial, setActionMaterial] = useState(ORGANIC_OPTIONS[0]);
  const [actionWeight, setActionWeight] = useState('');
  const [actionDate, setActionDate] = useState(getTodayDateString());
  const [actionMoisture, setActionMoisture] = useState<MoistureObservation>('Optimal (Damp Sponge)');
  const [actionNote, setActionNote] = useState('');

  const [historyBatchId, setHistoryBatchId] = useState<string | null>(null);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = newWeight ? parseFloat(newWeight) : 0;
    createBatch({
      name: newName,
      createdDate: newDate,
      initialMaterial: parsedWeight > 0 ? newMaterial : undefined,
      initialWeightKg: parsedWeight,
      farmerNotes: newNotes,
    });
    setNewName('');
    setNewWeight('');
    setNewNotes('');
    setShowCreateForm(false);
  };

  const openActionPanel = (batch: CompostBatch, type: 'material' | 'watering' | 'turning') => {
    setActiveAction({ batchId: batch.id, type });
    setActionDate(getTodayDateString());
    setActionMoisture(batch.moistureObservation);
    setActionWeight('');
    setActionNote('');
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAction) return;
    if (activeAction.type === 'material') {
      const w = parseFloat(actionWeight);
      addMaterialToBatch(activeAction.batchId, actionMaterial, w, actionDate, true);
    } else if (activeAction.type === 'watering') {
      recordBatchWatering(activeAction.batchId, actionDate, actionMoisture, actionNote.trim());
    } else if (activeAction.type === 'turning') {
      recordBatchTurning(activeAction.batchId, actionDate, actionMoisture, actionNote.trim());
    }
    setActiveAction(null);
  };

  const goToMaturityForBatch = (batchId: string) => {
    setSelectedBatchForMaturity(batchId);
    setActivePage('maturity');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
            {t.batches.heading}
          </h1>
          <p className="text-sm text-[#526057] mt-1">{t.batches.subheading}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm((v) => !v)}
          className="min-h-[44px] px-4 py-2.5 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.batches.createBatch}</span>
        </button>
      </div>

      {/* Guidance Notice */}
      <div className="bg-[#F2EFE6] border border-[#E2DDD0] rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-[#18241D]">
        <AlertCircle className="w-4 h-4 text-[#1E6B3A] shrink-0 mt-0.5" />
        <p>{t.batches.maturityRequiredNotice}</p>
      </div>

      {/* Create Batch Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateBatch}
          className="bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-4"
        >
          <h2 className="text-base font-bold text-[#18241D]">{t.batches.createBatch}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="batch-name" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.batches.batchName}
              </label>
              <input
                id="batch-name"
                type="text"
                required
                placeholder={lang === 'kn' ? 'ಉದಾ: ಗುಂಡಿ 5 - ತೋಟದ ಎಲೆಗಳು' : 'e.g. Bay 5 – Maize Stalk & Greens'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              />
            </div>
            <div>
              <label htmlFor="batch-date" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.common.date}
              </label>
              <input
                id="batch-date"
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular"
              />
            </div>
            <div>
              <label htmlFor="batch-init-weight" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.sorting.weightLabel} ({lang === 'kn' ? 'ಐಚ್ಛಿಕ' : 'Optional'})
              </label>
              <input
                id="batch-init-weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="batch-init-mat" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.sorting.materialLabel}
              </label>
              <select
                id="batch-init-mat"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              >
                {ORGANIC_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {MATERIAL_LABELS[m]?.[lang] ?? m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="batch-notes" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.common.notes}
              </label>
              <input
                id="batch-notes"
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder={lang === 'kn' ? 'ಬ್ಯಾಚ್ ಕುರಿತು ಟಿಪ್ಪಣಿ...' : 'Layering plan or source plot...'}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="min-h-[40px] px-4 py-2 rounded-lg border border-[#E2DDD0] text-sm font-medium text-[#526057] hover:bg-[#F2EFE6]"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[40px] px-5 py-2 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C]"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      )}

      {/* Batch Visual Progress Cards */}
      {batches.length === 0 ? (
        <div className="bg-white border border-[#E2DDD0] rounded-xl p-10 text-center">
          <Layers className="w-8 h-8 text-[#526057] mx-auto mb-2" />
          <p className="text-sm text-[#526057]">{t.common.noRecords}</p>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold"
          >
            {t.batches.createBatch}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {batches.map((batch) => {
            const stageIdx = COMPOST_STAGES.indexOf(batch.stage);
            const isReady = batch.stage === 'Ready for use';
            const nextStage = !isReady ? COMPOST_STAGES[stageIdx + 1] : null;
            const readyEligible = isBatchReadyEligible(batch.id, assessments);
            const isActionOpen = activeAction?.batchId === batch.id;

            return (
              <article
                key={batch.id}
                className="bg-white border border-[#E2DDD0] rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#526057]">
                        <span className="font-mono-tabular font-bold text-[#18241D]">{batch.id}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{batch.createdDate}</span>
                        {batch.isDemo && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#1E6B3A]">{t.common.demoTag}</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-[#18241D] mt-1">{batch.name}</h2>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${
                        isReady
                          ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]'
                          : 'bg-[#FAF9F5] text-[#132A1C] border-[#E2DDD0]'
                      }`}
                    >
                      {STAGE_LABELS[batch.stage][lang]}
                    </span>
                  </div>

                  {/* 6-Stage Progress Track */}
                  <div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {COMPOST_STAGES.map((st, idx) => {
                        const completed = idx <= stageIdx;
                        return (
                          <div key={st} className="space-y-1">
                            <div
                              className={`h-2 rounded-full transition-colors ${
                                completed ? 'bg-[#1E6B3A]' : 'bg-[#EAE5D7]'
                              }`}
                            />
                            <p className="text-[11px] text-[#526057] truncate font-medium">
                              {idx + 1}. {STAGE_LABELS[st][lang].replace(/^\d+\.\s*/, '')}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F5] border border-[#E2DDD0] rounded-lg p-3 text-xs">
                    <div>
                      <span className="text-[#526057] block">{t.batches.totalInput}</span>
                      <span className="font-mono-tabular font-bold text-sm text-[#18241D]">
                        {batch.totalInputWeightKg} {t.common.kg}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#526057] block">{t.batches.moistureStatus}</span>
                      <select
                        aria-label={`${t.batches.moistureStatus} ${batch.id}`}
                        value={batch.moistureObservation}
                        onChange={(e) =>
                          updateBatch(batch.id, {
                            moistureObservation: e.target.value as MoistureObservation,
                          })
                        }
                        className="mt-0.5 w-full bg-white border border-[#E2DDD0] rounded px-1.5 py-0.5 text-xs font-medium text-[#18241D]"
                      >
                        {(Object.keys(MOISTURE_LABELS) as MoistureObservation[]).map((m) => (
                          <option key={m} value={m}>
                            {MOISTURE_LABELS[m][lang]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[#526057] block">{t.batches.lastWatered}</span>
                      <span className="font-mono-tabular font-semibold text-[#18241D]">
                        {batch.lastWateringDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#526057] block">{t.batches.lastTurned}</span>
                      <span className="font-mono-tabular font-semibold text-[#18241D]">
                        {batch.lastTurningDate}
                      </span>
                    </div>
                  </div>

                  {/* Materials List Summary + Farmer Notes */}
                  <div className="text-xs text-[#526057] space-y-1">
                    <p>
                      <strong className="text-[#18241D]">
                        {lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳು' : 'Materials'}:
                      </strong>{' '}
                      {batch.materials.length === 0
                        ? '—'
                        : batch.materials
                            .map((m) => `${MATERIAL_LABELS[m.material]?.[lang] ?? m.material} (${m.weightKg} ${t.common.kg})`)
                            .join(', ')}
                    </p>
                    {batch.farmerNotes && (
                      <p>
                        <strong className="text-[#18241D]">{t.common.notes}:</strong> {batch.farmerNotes}
                      </p>
                    )}
                    {isReady && batch.outputWeightKg && (
                      <p className="text-[#1E6B3A] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                        {t.batches.readyConfirmed} ({batch.readyConfirmedAt}) ·{' '}
                        <span className="font-mono-tabular">
                          {batch.outputWeightKg} {t.common.kg}
                        </span>{' '}
                        {t.dashboard.totalCompostProduced}
                      </p>
                    )}
                  </div>
                </div>

                {/* Inline Action Drawer for Add Material / Watering / Turning */}
                {isActionOpen && activeAction && (
                  <form
                    onSubmit={handleActionSubmit}
                    className="bg-[#F2EFE6] border border-[#E2DDD0] rounded-lg p-3.5 space-y-3"
                  >
                    <p className="text-xs font-bold text-[#18241D]">
                      {activeAction.type === 'material'
                        ? t.batches.addMaterial
                        : activeAction.type === 'watering'
                          ? t.batches.logWatering
                          : t.batches.logTurning}{' '}
                      ({batch.id})
                    </p>

                    {activeAction.type === 'material' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={actionMaterial}
                          onChange={(e) => setActionMaterial(e.target.value)}
                          className="min-h-[38px] px-2.5 rounded-md border border-[#E2DDD0] bg-white text-xs"
                        >
                          {ORGANIC_OPTIONS.map((m) => (
                            <option key={m} value={m}>
                              {MATERIAL_LABELS[m]?.[lang] ?? m}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          required
                          placeholder={t.sorting.weightLabel}
                          value={actionWeight}
                          onChange={(e) => setActionWeight(e.target.value)}
                          className="min-h-[38px] px-2.5 rounded-md border border-[#E2DDD0] bg-white text-xs font-mono-tabular"
                        />
                        <input
                          type="date"
                          required
                          value={actionDate}
                          onChange={(e) => setActionDate(e.target.value)}
                          className="min-h-[38px] px-2.5 rounded-md border border-[#E2DDD0] bg-white text-xs font-mono-tabular"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="date"
                          required
                          value={actionDate}
                          onChange={(e) => setActionDate(e.target.value)}
                          className="min-h-[38px] px-2.5 rounded-md border border-[#E2DDD0] bg-white text-xs font-mono-tabular"
                        />
                        <select
                          value={actionMoisture}
                          onChange={(e) => setActionMoisture(e.target.value as MoistureObservation)}
                          className="min-h-[38px] px-2.5 rounded-md border border-[#E2DDD0] bg-white text-xs"
                        >
                          {(Object.keys(MOISTURE_LABELS) as MoistureObservation[]).map((m) => (
                            <option key={m} value={m}>
                              {MOISTURE_LABELS[m][lang]}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder={t.common.notes}
                          value={actionNote}
                          onChange={(e) => setActionNote(e.target.value)}
                          className="min-h-[38px] px-2.5 rounded-md border border-[#E2DDD0] bg-white text-xs"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveAction(null)}
                        className="px-3 py-1.5 rounded-md border border-[#E2DDD0] bg-white text-xs font-medium text-[#526057]"
                      >
                        {t.common.cancel}
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-md bg-[#1E6B3A] text-white text-xs font-semibold"
                      >
                        {t.common.save}
                      </button>
                    </div>
                  </form>
                )}

                {/* Action Buttons Bar */}
                <div className="pt-3 border-t border-[#E2DDD0] flex flex-wrap items-center gap-2">
                  {!isReady && (
                    <>
                      <button
                        type="button"
                        onClick={() => openActionPanel(batch, 'material')}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] hover:bg-[#F2EFE6] text-xs font-semibold text-[#18241D] inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#1E6B3A]" />
                        <span>{t.batches.addMaterial}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openActionPanel(batch, 'watering')}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] hover:bg-[#F2EFE6] text-xs font-semibold text-[#18241D] inline-flex items-center gap-1.5"
                      >
                        <Droplets className="w-3.5 h-3.5 text-[#1E6B3A]" />
                        <span>{t.batches.logWatering}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openActionPanel(batch, 'turning')}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] hover:bg-[#F2EFE6] text-xs font-semibold text-[#18241D] inline-flex items-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-[#9A5B13]" />
                        <span>{t.batches.logTurning}</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setHistoryBatchId(batch.id)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-white hover:bg-[#F2EFE6] text-xs font-semibold text-[#18241D] inline-flex items-center gap-1.5"
                  >
                    <History className="w-3.5 h-3.5 text-[#526057]" />
                    <span>{t.common.viewHistory}</span>
                  </button>

                  {nextStage && nextStage !== 'Ready for use' && (
                    <button
                      type="button"
                      onClick={() => advanceBatchStage(batch.id, nextStage)}
                      className="ml-auto min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#132A1C] text-white hover:bg-[#1E6B3A] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t.batches.advanceStage}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {nextStage === 'Ready for use' && !readyEligible && (
                    <button
                      type="button"
                      onClick={() => goToMaturityForBatch(batch.id)}
                      className="ml-auto min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#1E6B3A] text-white hover:bg-[#16532C] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>{t.batches.assessMaturity}</span>
                    </button>
                  )}

                  {nextStage === 'Ready for use' && readyEligible && (
                    <button
                      type="button"
                      onClick={() => advanceBatchStage(batch.id, 'Ready for use')}
                      className="ml-auto min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{STAGE_LABELS['Ready for use'][lang]}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <BatchHistoryModal batchId={historyBatchId} onClose={() => setHistoryBatchId(null)} />
    </div>
  );
};
