import React, { useState } from 'react';
import { RotateCcw, Trash2, Download, Save, Globe } from 'lucide-react';
import { useCompost } from '../context/CompostContext';
import { UI_TEXT } from '../i18n/translations';
import { getTodayDateString } from '../utils/storage';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    wasteEntries,
    batches,
    records,
    assessments,
    updateSettings,
    setLanguage,
    resetDemoData,
    clearAllData,
    notify,
  } = useCompost();

  const lang = settings.language;
  const t = UI_TEXT[lang];

  const [stationName, setStationName] = useState(settings.stationName);
  const [farmerName, setFarmerName] = useState(settings.farmerName);
  const [village, setVillage] = useState(settings.village);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      stationName: stationName.trim() || 'Bannikuppe Simple Compost Station',
      farmerName: farmerName.trim() || 'Basavaraju Gowda',
      village: village.trim() || 'Bannikuppe, Karnataka',
    });
  };

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      wasteEntries,
      batches,
      records,
      assessments,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bannikuppe-compost-backup-${getTodayDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('success', 'JSON backup downloaded.');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
          {t.settings.heading}
        </h1>
        <p className="text-sm text-[#526057] mt-1">{t.settings.subheading}</p>
      </div>

      {/* Language Settings */}
      <section className="bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-base font-bold text-[#18241D]">
          <Globe className="w-4 h-4 text-[#1E6B3A]" />
          <h2>{t.settings.languageSection}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`min-h-[44px] px-5 py-2 rounded-lg border text-sm font-semibold transition-colors ${
              lang === 'en'
                ? 'bg-[#1E6B3A] text-white border-[#1E6B3A]'
                : 'bg-[#FAF9F5] text-[#18241D] border-[#E2DDD0] hover:bg-[#F2EFE6]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('kn')}
            className={`min-h-[44px] px-5 py-2 rounded-lg border text-sm font-semibold transition-colors ${
              lang === 'kn'
                ? 'bg-[#1E6B3A] text-white border-[#1E6B3A]'
                : 'bg-[#FAF9F5] text-[#18241D] border-[#E2DDD0] hover:bg-[#F2EFE6]'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>
      </section>

      {/* Station Profile */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-[#18241D]">{t.settings.profileSection}</h2>

        <div className="space-y-3">
          <div>
            <label htmlFor="set-station" className="block text-xs font-semibold text-[#526057] mb-1.5">
              {t.settings.stationName}
            </label>
            <input
              id="set-station"
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="set-farmer" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.settings.farmerName}
              </label>
              <input
                id="set-farmer"
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              />
            </div>

            <div>
              <label htmlFor="set-village" className="block text-xs font-semibold text-[#526057] mb-1.5">
                {t.settings.village}
              </label>
              <input
                id="set-village"
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="min-h-[42px] px-5 py-2 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{t.common.save}</span>
        </button>
      </form>

      {/* Demo & LocalStorage Data Controls */}
      <section className="bg-white border border-[#E2DDD0] rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#18241D]">{t.settings.dataSection}</h2>
          <p className="text-xs text-[#526057] mt-1">
            {lang === 'kn'
              ? 'ಎಲ್ಲಾ ದಾಖಲೆಗಳು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನ LocalStorage ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹವಾಗುತ್ತವೆ.'
              : 'All entries are persisted automatically in browser LocalStorage across refreshes.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F5] border border-[#E2DDD0] rounded-lg p-3 text-xs">
          <div>
            <span className="text-[#526057] block">{t.nav.sorting}</span>
            <span className="font-mono-tabular font-bold text-base text-[#18241D]">
              {wasteEntries.length}
            </span>
          </div>
          <div>
            <span className="text-[#526057] block">{t.nav.batches}</span>
            <span className="font-mono-tabular font-bold text-base text-[#18241D]">
              {batches.length}
            </span>
          </div>
          <div>
            <span className="text-[#526057] block">{t.nav.records}</span>
            <span className="font-mono-tabular font-bold text-base text-[#18241D]">
              {records.length}
            </span>
          </div>
          <div>
            <span className="text-[#526057] block">{t.nav.maturity}</span>
            <span className="font-mono-tabular font-bold text-base text-[#18241D]">
              {assessments.length}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={resetDemoData}
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#132A1C] text-white text-sm font-semibold hover:bg-[#1E6B3A] inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.settings.resetDemoBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="min-h-[42px] px-4 py-2 rounded-lg border border-[#E2DDD0] bg-[#FAF9F5] text-sm font-semibold text-[#18241D] hover:bg-[#F2EFE6] inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t.settings.exportBackupBtn}</span>
          </button>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="min-h-[42px] px-4 py-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-sm font-semibold text-[#DC2626] hover:bg-[#FEE2E2] inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.settings.clearAllBtn}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllData();
                  setConfirmClear(false);
                }}
                className="min-h-[42px] px-4 py-2 rounded-lg bg-[#DC2626] text-white text-sm font-semibold"
              >
                {t.common.confirm}
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="min-h-[42px] px-3 py-2 rounded-lg border border-[#E2DDD0] text-sm font-medium text-[#526057]"
              >
                {t.common.cancel}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
