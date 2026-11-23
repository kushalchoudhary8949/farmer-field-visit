import React, { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Info, Trash2, AlertCircle } from 'lucide-react';
import { useCompost } from '../context/CompostContext';
import { MATURITY_STATUS_LABELS, UI_TEXT } from '../i18n/translations';
import { MaturityStatus } from '../types';
import { getTodayDateString } from '../utils/storage';

export const MaturityAssessmentPage: React.FC = () => {
  const {
    batches,
    assessments,
    settings,
    selectedBatchForMaturity,
    setSelectedBatchForMaturity,
    addAssessment,
    deleteAssessment,
    confirmBatchReadyFromAssessment,
    notify,
  } = useCompost();

  const lang = settings.language;
  const t = UI_TEXT[lang];

  const [batchId, setBatchId] = useState<string>(
    selectedBatchForMaturity ?? batches.find((b) => b.stage !== 'Ready for use')?.id ?? batches[0]?.id ?? ''
  );
  const [assessmentDate, setAssessmentDate] = useState(getTodayDateString());
  const [appearance, setAppearance] = useState('Dark brown / black, uniform');
  const [smell, setSmell] = useState('Earthy forest soil odor, no sour smell');
  const [texture, setTexture] = useState('Loose and crumbly');
  const [visibleUndecomposed, setVisibleUndecomposed] = useState('None visible');
  const [moistureCondition, setMoistureCondition] = useState('Moist like a wrung sponge');
  const [growerComments, setGrowerComments] = useState('');
  const [status, setStatus] = useState<MaturityStatus>('Under observation');
  const [confirmedReady, setConfirmedReady] = useState(false);
  const [outputWeightKg, setOutputWeightKg] = useState('');

  // Inline confirm dialog state for existing 'Ready for grower review' unconfirmed assessments
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmOutputKg, setConfirmOutputKg] = useState('');

  useEffect(() => {
    if (selectedBatchForMaturity) {
      setBatchId(selectedBatchForMaturity);
      setSelectedBatchForMaturity(null);
    }
  }, [selectedBatchForMaturity, setSelectedBatchForMaturity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) {
      notify('error', 'Please select a compost batch.');
      return;
    }

    const markReady = status === 'Ready for grower review' && confirmedReady;
    const parsedOut = outputWeightKg ? parseFloat(outputWeightKg) : undefined;
    if (markReady && (!parsedOut || parsedOut <= 0)) {
      notify('error', 'Please enter harvested compost output weight (kg > 0) when marking ready.');
      return;
    }

    addAssessment(
      {
        batchId,
        assessmentDate,
        appearance: appearance.trim(),
        smell: smell.trim(),
        texture: texture.trim(),
        visibleUndecomposed: visibleUndecomposed.trim(),
        moistureCondition: moistureCondition.trim(),
        growerComments: growerComments.trim(),
        status,
        confirmedReady: markReady,
        outputWeightKg: parsedOut,
      },
      markReady
    );

    setGrowerComments('');
    setConfirmedReady(false);
    setOutputWeightKg('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
          {t.maturity.heading}
        </h1>
        <p className="text-sm text-[#526057] mt-1">{t.maturity.subheading}</p>
      </div>

      {/* Agricultural Guidance Banner */}
      <div className="bg-[#F2EFE6] border border-[#E2DDD0] rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-[#18241D]">
        <Info className="w-4 h-4 text-[#1E6B3A] shrink-0 mt-0.5" />
        <p>{t.maturity.guidanceNote}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Observation Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-4"
        >
          <h2 className="text-base font-bold text-[#18241D] flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-[#1E6B3A]" />
            <span>{t.maturity.newAssessment}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="mat-batch" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.common.batchId}
              </label>
              <select
                id="mat-batch"
                required
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              >
                {batches.length === 0 ? (
                  <option value="">{lang === 'kn' ? 'ಬ್ಯಾಚ್ ಲಭ್ಯವಿಲ್ಲ' : 'No batches available'}</option>
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
              <label htmlFor="mat-date" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.common.date}
              </label>
              <input
                id="mat-date"
                type="date"
                required
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-mono-tabular"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mat-appearance" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.maturity.appearance}
            </label>
            <input
              id="mat-appearance"
              type="text"
              required
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            />
          </div>

          <div>
            <label htmlFor="mat-smell" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.maturity.smell}
            </label>
            <input
              id="mat-smell"
              type="text"
              required
              value={smell}
              onChange={(e) => setSmell(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="mat-texture" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.maturity.texture}
              </label>
              <input
                id="mat-texture"
                type="text"
                required
                value={texture}
                onChange={(e) => setTexture(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              />
            </div>
            <div>
              <label htmlFor="mat-moisture" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.maturity.moistureCond}
              </label>
              <input
                id="mat-moisture"
                type="text"
                required
                value={moistureCondition}
                onChange={(e) => setMoistureCondition(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mat-undecomposed" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.maturity.undecomposed}
            </label>
            <input
              id="mat-undecomposed"
              type="text"
              required
              value={visibleUndecomposed}
              onChange={(e) => setVisibleUndecomposed(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            />
          </div>

          <div>
            <label htmlFor="mat-status" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.maturity.assessmentStatus}
            </label>
            <select
              id="mat-status"
              value={status}
              onChange={(e) => {
                const val = e.target.value as MaturityStatus;
                setStatus(val);
                if (val !== 'Ready for grower review') {
                  setConfirmedReady(false);
                }
              }}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-medium"
            >
              {(Object.keys(MATURITY_STATUS_LABELS) as MaturityStatus[]).map((st) => (
                <option key={st} value={st}>
                  {MATURITY_STATUS_LABELS[st][lang]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mat-comments" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.maturity.growerComments}
            </label>
            <textarea
              id="mat-comments"
              rows={2}
              value={growerComments}
              onChange={(e) => setGrowerComments(e.target.value)}
              placeholder={lang === 'kn' ? 'ಜಮೀನಿಗೆ ಬಳಕೆಗೆ ಸಿದ್ಧತೆ ಅಥವಾ ಮುಂದಿನ ಕ್ರಮ...' : 'Notes on readiness or next turn...'}
              className="w-full px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            />
          </div>

          {status === 'Ready for grower review' && (
            <div className="bg-[#E9F5EE] border border-[#B7DFC6] rounded-lg p-3.5 space-y-3">
              <label className="flex items-start gap-2.5 text-xs font-medium text-[#132A1C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedReady}
                  onChange={(e) => setConfirmedReady(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#1E6B3A]"
                />
                <span>{t.maturity.confirmCheckbox}</span>
              </label>

              {confirmedReady && (
                <div>
                  <label htmlFor="mat-output" className="block text-xs font-semibold text-[#132A1C] mb-1">
                    {t.maturity.outputWeightLabel}
                  </label>
                  <input
                    id="mat-output"
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    placeholder="e.g. 120"
                    value={outputWeightKg}
                    onChange={(e) => setOutputWeightKg(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#B7DFC6] bg-white text-sm font-mono-tabular"
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] transition-colors"
          >
            {status === 'Ready for grower review' && confirmedReady
              ? t.maturity.markBatchReady
              : t.common.save}
          </button>
        </form>

        {/* Recorded Observations Review Screen */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-[#18241D]">
            {t.maturity.reviewListTitle} ({assessments.length})
          </h2>

          {assessments.length === 0 ? (
            <div className="bg-white border border-[#E2DDD0] rounded-xl p-10 text-center text-sm text-[#526057]">
              {t.common.noRecords}
            </div>
          ) : (
            assessments.map((ass) => {
              const statusColor =
                ass.status === 'Ready for grower review'
                  ? 'text-[#166534] bg-[#DCFCE7] border-[#BBF7D0]'
                  : ass.status === 'Needs further processing'
                    ? 'text-[#991B1B] bg-[#FEF2F2] border-[#FECACA]'
                    : 'text-[#92400E] bg-[#FFFBEB] border-[#FDE68A]';

              const batchObj = batches.find((b) => b.id === ass.batchId);

              return (
                <article
                  key={ass.id}
                  className="bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#526057] font-mono-tabular">
                        <span className="font-bold text-[#18241D]">{ass.batchId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ass.assessmentDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ass.id}</span>
                        {ass.isDemo && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#1E6B3A]">{t.common.demoTag}</span>
                          </>
                        )}
                      </div>
                      {batchObj && (
                        <h3 className="text-sm font-bold text-[#18241D] mt-0.5">{batchObj.name}</h3>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${statusColor}`}>
                        {MATURITY_STATUS_LABELS[ass.status][lang]}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteAssessment(ass.id)}
                        aria-label={`${t.common.delete} ${ass.id}`}
                        className="p-1.5 rounded-lg text-[#526057] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF9F5] border border-[#E2DDD0] rounded-lg p-3.5">
                    <div>
                      <span className="text-[#526057] block">{t.maturity.appearance}</span>
                      <span className="font-medium text-[#18241D]">{ass.appearance}</span>
                    </div>
                    <div>
                      <span className="text-[#526057] block">{t.maturity.smell}</span>
                      <span className="font-medium text-[#18241D]">{ass.smell}</span>
                    </div>
                    <div>
                      <span className="text-[#526057] block">{t.maturity.texture}</span>
                      <span className="font-medium text-[#18241D]">{ass.texture}</span>
                    </div>
                    <div>
                      <span className="text-[#526057] block">{t.maturity.undecomposed}</span>
                      <span className="font-medium text-[#18241D]">{ass.visibleUndecomposed}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#526057] block">{t.maturity.moistureCond}</span>
                      <span className="font-medium text-[#18241D]">{ass.moistureCondition}</span>
                    </div>
                  </div>

                  {ass.growerComments && (
                    <p className="text-xs text-[#526057]">
                      <strong className="text-[#18241D]">{t.maturity.growerComments}:</strong>{' '}
                      {ass.growerComments}
                    </p>
                  )}

                  {ass.confirmedReady ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1E6B3A] pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {t.batches.readyConfirmed}
                        {ass.outputWeightKg ? ` · ${ass.outputWeightKg} ${t.common.kg}` : ''}
                      </span>
                    </div>
                  ) : (
                    batchObj &&
                    batchObj.stage !== 'Ready for use' && (
                      <div className="pt-2 border-t border-[#E2DDD0]">
                        {confirmingId === ass.id ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              step="0.5"
                              placeholder={t.maturity.outputWeightLabel}
                              value={confirmOutputKg}
                              onChange={(e) => setConfirmOutputKg(e.target.value)}
                              className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-xs font-mono-tabular w-48"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                confirmBatchReadyFromAssessment(ass.id, parseFloat(confirmOutputKg));
                                setConfirmingId(null);
                                setConfirmOutputKg('');
                              }}
                              className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#1E6B3A] text-white text-xs font-semibold"
                            >
                              {t.common.confirm}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(null)}
                              className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2DDD0] text-xs font-medium text-[#526057]"
                            >
                              {t.common.cancel}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmingId(ass.id);
                              setConfirmOutputKg(
                                String(Math.round(batchObj.totalInputWeightKg * 0.58) || 50)
                              );
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E6B3A] hover:underline"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{t.maturity.markBatchReady}</span>
                          </button>
                        )}
                      </div>
                    )
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
