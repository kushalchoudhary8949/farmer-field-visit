import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Sprout } from 'lucide-react';
import { useCompost } from '../context/CompostContext';
import { PROCESS_GUIDE_STEPS, UI_TEXT } from '../i18n/translations';

export const ProcessGuidePage: React.FC = () => {
  const { settings, setLanguage } = useCompost();
  const [stepIdx, setStepIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const lang = settings.language;
  const t = UI_TEXT[lang];
  const current = PROCESS_GUIDE_STEPS[stepIdx];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
            {t.guide.heading}
          </h1>
          <p className="text-sm text-[#526057] mt-1">{t.guide.subheading}</p>
        </div>

        {/* Inline Language Toggle for Field Card Convenience */}
        <div className="flex items-center p-1 bg-[#F2EFE6] border border-[#E2DDD0] rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              lang === 'en' ? 'bg-white text-[#18241D] shadow-xs' : 'text-[#526057]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('kn')}
            className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              lang === 'kn' ? 'bg-white text-[#18241D] shadow-xs' : 'text-[#526057]'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>
      </div>

      {/* 5-Step Progress Indicator */}
      <div className="grid grid-cols-5 gap-2">
        {PROCESS_GUIDE_STEPS.map((s, idx) => {
          const isCurrent = idx === stepIdx;
          const isDone = idx < stepIdx;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setStepIdx(idx)}
              className={`text-left p-3 rounded-xl border transition-colors min-h-[56px] ${
                isCurrent
                  ? 'bg-[#132A1C] text-white border-[#132A1C]'
                  : isDone
                    ? 'bg-[#E9F5EE] text-[#132A1C] border-[#B7DFC6]'
                    : 'bg-white text-[#526057] border-[#E2DDD0] hover:bg-[#FAF9F5]'
              }`}
            >
              <span className="text-xs font-mono-tabular font-bold block">
                {t.guide.stepLabel} {s.step}
              </span>
              <span className="text-xs font-semibold hidden md:block truncate mt-0.5">
                {lang === 'kn' ? s.titleKn : s.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Visual Process Card */}
      <div className="bg-white border border-[#E2DDD0] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Illustration Frame */}
        <div className="lg:col-span-6 bg-[#FAF8F2] border-b lg:border-b-0 lg:border-r border-[#E2DDD0] flex items-center justify-center p-4 sm:p-6">
          {imgErrors[current.step] ? (
            <div className="w-full aspect-[4/3] rounded-lg bg-[#F2EFE6] border border-[#E2DDD0] flex flex-col items-center justify-center p-6 text-center">
              <Sprout className="w-12 h-12 text-[#1E6B3A] mb-3" />
              <p className="text-base font-bold text-[#18241D]">
                {t.guide.stepLabel} {current.step}: {lang === 'kn' ? current.titleKn : current.titleEn}
              </p>
            </div>
          ) : (
            <img
              src={current.image}
              alt={`${current.titleEn} (${current.titleKn})`}
              referrerPolicy="no-referrer"
              onError={() => setImgErrors((prev) => ({ ...prev, [current.step]: true }))}
              className="w-full aspect-[4/3] object-cover rounded-lg border border-[#E2DDD0]"
            />
          )}
        </div>

        {/* Step Instructions (Always shows active language + secondary bilingual label for clarity) */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-[#1E6B3A]">
              <span>
                {t.guide.stepLabel.toUpperCase()} {current.step} / 5
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#18241D]">
                {lang === 'kn' ? current.titleKn : current.titleEn}
              </h2>
              <p className="text-sm font-medium text-[#526057] mt-1">
                {lang === 'kn' ? current.titleEn : current.titleKn}
              </p>
            </div>

            <p className="text-base text-[#18241D] leading-relaxed">
              {lang === 'kn' ? current.summaryKn : current.summaryEn}
            </p>

            <ul className="space-y-3 pt-2">
              {(lang === 'kn' ? current.bulletsKn : current.bulletsEn).map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#18241D] leading-relaxed">
                  <span className="w-6 h-6 rounded-md bg-[#E9F5EE] text-[#1E6B3A] font-mono-tabular font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Previous / Next Large Farmer Buttons */}
          <div className="pt-4 border-t border-[#E2DDD0] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              disabled={stepIdx === 0}
              className="min-h-[46px] px-5 py-2.5 rounded-lg border border-[#E2DDD0] bg-white text-sm font-semibold text-[#18241D] hover:bg-[#F2EFE6] disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.guide.previous}</span>
            </button>
            <button
              type="button"
              onClick={() => setStepIdx((i) => Math.min(PROCESS_GUIDE_STEPS.length - 1, i + 1))}
              disabled={stepIdx === PROCESS_GUIDE_STEPS.length - 1}
              className="min-h-[46px] px-5 py-2.5 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-2"
            >
              <span>{t.guide.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advisory Disclaimer */}
      <div className="bg-[#F2EFE6] border border-[#E2DDD0] rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-[#526057]">
        <Info className="w-4 h-4 text-[#132A1C] shrink-0 mt-0.5" />
        <p>{t.guide.advisoryDisclaimer}</p>
      </div>
    </div>
  );
};
