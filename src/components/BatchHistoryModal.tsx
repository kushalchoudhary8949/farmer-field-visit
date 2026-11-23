import React from 'react';
import { X, Droplets, RotateCw, Sprout, ClipboardCheck, Layers } from 'lucide-react';
import { useCompost } from '../context/CompostContext';
import { MATURITY_STATUS_LABELS, STAGE_LABELS, UI_TEXT } from '../i18n/translations';

interface BatchHistoryModalProps {
  batchId: string | null;
  onClose: () => void;
}

export const BatchHistoryModal: React.FC<BatchHistoryModalProps> = ({ batchId, onClose }) => {
  const { batches, records, assessments, settings } = useCompost();
  const lang = settings.language;
  const t = UI_TEXT[lang];

  if (!batchId) return null;
  const batch = batches.find((b) => b.id === batchId);
  if (!batch) return null;

  const batchRecords = records
    .filter((r) => r.batchId === batchId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const batchAssessments = assessments
    .filter((a) => a.batchId === batchId)
    .sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="batch-history-title"
    >
      <div className="bg-white border border-[#E2DDD0] rounded-xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD0] bg-[#FAF9F5]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#526057] font-mono-tabular">
              <span>{batch.id}</span>
              <span aria-hidden="true">·</span>
              <span>{STAGE_LABELS[batch.stage][lang]}</span>
              {batch.isDemo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#1E6B3A]">{t.common.demoTag}</span>
                </>
              )}
            </div>
            <h2 id="batch-history-title" className="text-lg font-bold text-[#18241D] mt-0.5">
              {batch.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[#E2DDD0] bg-white text-[#18241D] hover:bg-[#F2EFE6] transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Batch Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FAF9F5] border border-[#E2DDD0] rounded-xl p-4">
            <div>
              <p className="text-xs text-[#526057]">{t.batches.totalInput}</p>
              <p className="text-lg font-bold text-[#18241D] font-mono-tabular mt-0.5">
                {batch.totalInputWeightKg} {t.common.kg}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526057]">{t.batches.lastWatered}</p>
              <p className="text-sm font-semibold text-[#18241D] font-mono-tabular mt-1">
                {batch.lastWateringDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526057]">{t.batches.lastTurned}</p>
              <p className="text-sm font-semibold text-[#18241D] font-mono-tabular mt-1">
                {batch.lastTurningDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526057]">{t.dashboard.totalCompostProduced}</p>
              <p className="text-lg font-bold text-[#1E6B3A] font-mono-tabular mt-0.5">
                {batch.outputWeightKg ? `${batch.outputWeightKg} ${t.common.kg}` : '—'}
              </p>
            </div>
          </div>

          {/* Materials Added */}
          <div>
            <h3 className="text-sm font-semibold text-[#18241D] flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#1E6B3A]" />
              {lang === 'kn' ? 'ಸೇರಿಸಿದ ಸಾವಯವ ವಸ್ತುಗಳು' : 'Materials Added'} ({batch.materials.length})
            </h3>
            {batch.materials.length === 0 ? (
              <p className="text-sm text-[#526057]">{t.common.noRecords}</p>
            ) : (
              <div className="border border-[#E2DDD0] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F2EFE6] text-[#526057] text-xs">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-medium">{t.common.date}</th>
                      <th className="text-left px-4 py-2.5 font-medium">{t.records.materialAdded}</th>
                      <th className="text-right px-4 py-2.5 font-medium">{t.records.quantityKg}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD0]">
                    {batch.materials.map((m) => (
                      <tr key={m.id}>
                        <td className="px-4 py-2.5 font-mono-tabular text-[#526057]">{m.date}</td>
                        <td className="px-4 py-2.5 font-medium text-[#18241D]">{m.material}</td>
                        <td className="px-4 py-2.5 text-right font-mono-tabular font-semibold text-[#18241D]">
                          {m.weightKg} {t.common.kg}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Record Sheet Activity Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-[#18241D] flex items-center gap-2 mb-3">
              <Sprout className="w-4 h-4 text-[#1E6B3A]" />
              {lang === 'kn' ? 'ದಾಖಲೆ ಪುಸ್ತಕದ ಚಟುವಟಿಕೆಗಳು' : 'Record Sheet Activity Log'} ({batchRecords.length})
            </h3>
            {batchRecords.length === 0 ? (
              <p className="text-sm text-[#526057]">{t.common.noRecords}</p>
            ) : (
              <div className="divide-y divide-[#E2DDD0] border border-[#E2DDD0] rounded-lg">
                {batchRecords.map((rec) => (
                  <div key={rec.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#526057]">
                        <span className="font-mono-tabular font-medium text-[#18241D]">{rec.date}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{rec.id}</span>
                        {rec.wateringActivity && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-[#1E6B3A] font-medium">
                              <Droplets className="w-3.5 h-3.5" />
                              {t.records.watering}
                            </span>
                          </>
                        )}
                        {rec.turningActivity && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-[#8A5A12] font-medium">
                              <RotateCw className="w-3.5 h-3.5" />
                              {t.records.turning}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#18241D] mt-1">
                        {rec.materialAdded}
                        {rec.quantityKg > 0 ? ` (${rec.quantityKg} ${t.common.kg})` : ''}
                      </p>
                      {rec.otherObservations && (
                        <p className="text-xs text-[#526057] mt-0.5">{rec.otherObservations}</p>
                      )}
                    </div>
                    <div className="text-xs text-[#526057] shrink-0">
                      {t.records.moistureObs}: <span className="font-medium text-[#18241D]">{rec.moistureObservation}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maturity Assessments */}
          <div>
            <h3 className="text-sm font-semibold text-[#18241D] flex items-center gap-2 mb-3">
              <ClipboardCheck className="w-4 h-4 text-[#1E6B3A]" />
              {t.maturity.reviewListTitle} ({batchAssessments.length})
            </h3>
            {batchAssessments.length === 0 ? (
              <p className="text-sm text-[#526057]">
                {lang === 'kn' ? 'ಇನ್ನೂ ಪಕ್ವತೆ ಪರಿಶೀಲನೆ ದಾಖಲಾಗಿಲ್ಲ.' : 'No maturity observations recorded for this batch yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {batchAssessments.map((ass) => (
                  <div key={ass.id} className="border border-[#E2DDD0] rounded-lg p-4 bg-[#FAF9F5]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#526057] mb-2">
                      <span className="font-mono-tabular font-medium text-[#18241D]">
                        {ass.assessmentDate} · {ass.id}
                      </span>
                      <span className="font-semibold text-[#1E6B3A]">
                        {MATURITY_STATUS_LABELS[ass.status][lang]}
                        {ass.confirmedReady ? ` · ${t.batches.readyConfirmed}` : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#18241D]">
                      <p><span className="text-[#526057]">{t.maturity.appearance}:</span> {ass.appearance}</p>
                      <p><span className="text-[#526057]">{t.maturity.smell}:</span> {ass.smell}</p>
                      <p><span className="text-[#526057]">{t.maturity.texture}:</span> {ass.texture}</p>
                      <p><span className="text-[#526057]">{t.maturity.undecomposed}:</span> {ass.visibleUndecomposed}</p>
                    </div>
                    {ass.growerComments && (
                      <p className="text-xs text-[#526057] mt-2 pt-2 border-t border-[#E2DDD0]">
                        {ass.growerComments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#E2DDD0] bg-[#FAF9F5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#1E6B3A] text-white text-sm font-medium hover:bg-[#16532C] transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
