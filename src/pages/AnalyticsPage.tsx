import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Download } from 'lucide-react';
import { useCompost } from '../context/CompostContext';
import { MATERIAL_LABELS, STAGE_LABELS, UI_TEXT } from '../i18n/translations';
import { downloadCsvFile, getTodayDateString } from '../utils/storage';

export const AnalyticsPage: React.FC = () => {
  const { wasteEntries, batches, settings, notify } = useCompost();
  const lang = settings.language;
  const t = UI_TEXT[lang];

  const summary = useMemo(() => {
    const bioKg = wasteEntries
      .filter((w) => w.category === 'biodegradable')
      .reduce((s, w) => s + w.weightKg, 0);
    const rejectedKg = wasteEntries
      .filter((w) => w.category === 'non-compostable')
      .reduce((s, w) => s + w.weightKg, 0);
    const reviewKg = wasteEntries
      .filter((w) => w.category === 'review')
      .reduce((s, w) => s + w.weightKg, 0);
    const totalCollectedKg = bioKg + rejectedKg + reviewKg;
    const batchesCreated = batches.length;
    const batchesCompleted = batches.filter((b) => b.stage === 'Ready for use').length;
    const compostOutputKg = batches
      .filter((b) => b.stage === 'Ready for use')
      .reduce((s, b) => s + (b.outputWeightKg ?? 0), 0);

    return {
      totalCollectedKg: Number(totalCollectedKg.toFixed(1)),
      bioKg: Number(bioKg.toFixed(1)),
      rejectedKg: Number(rejectedKg.toFixed(1)),
      batchesCreated,
      batchesCompleted,
      compostOutputKg: Number(compostOutputKg.toFixed(1)),
    };
  }, [batches, wasteEntries]);

  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; biodegradable: number; rejected: number }> = {};
    wasteEntries.forEach((entry) => {
      const m = entry.date.slice(0, 7);
      if (!months[m]) {
        months[m] = { month: m, biodegradable: 0, rejected: 0 };
      }
      if (entry.category === 'biodegradable') {
        months[m].biodegradable = Number((months[m].biodegradable + entry.weightKg).toFixed(1));
      } else if (entry.category === 'non-compostable') {
        months[m].rejected = Number((months[m].rejected + entry.weightKg).toFixed(1));
      }
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [wasteEntries]);

  const materialData = useMemo(() => {
    const map: Record<string, number> = {};
    wasteEntries.forEach((w) => {
      const label = MATERIAL_LABELS[w.material]?.[lang] ?? w.material;
      map[label] = Number(((map[label] ?? 0) + w.weightKg).toFixed(1));
    });
    return Object.entries(map)
      .map(([material, kg]) => ({ material, kg }))
      .sort((a, b) => b.kg - a.kg);
  }, [lang, wasteEntries]);

  const batchComparisonData = useMemo(() => {
    return batches.map((b) => ({
      id: b.id,
      stage: STAGE_LABELS[b.stage][lang],
      inputKg: b.totalInputWeightKg,
      outputKg: b.outputWeightKg ?? 0,
    }));
  }, [batches, lang]);

  const handleExportSummary = () => {
    const headers = ['Metric', 'Value', 'Unit / Notes'];
    const rows: (string | number)[][] = [
      ['Station Name', settings.stationName, settings.village],
      ['Report Date', getTodayDateString(), ''],
      ['Total Organic & Collected Waste', summary.totalCollectedKg, 'kg'],
      ['Biodegradable Waste', summary.bioKg, 'kg'],
      ['Rejected (Non-Compostable) Waste', summary.rejectedKg, 'kg'],
      ['Compost Batches Created', summary.batchesCreated, 'batches'],
      ['Compost Batches Completed', summary.batchesCompleted, 'batches'],
      ['Harvested Compost Output', summary.compostOutputKg, 'kg'],
      ['', '', ''],
      ['Batch ID', 'Stage', 'Input Weight (kg) / Output Weight (kg)'],
      ...batches.map((b) => [
        b.id,
        b.stage,
        `${b.totalInputWeightKg} kg in / ${b.outputWeightKg ?? 0} kg out`,
      ]),
    ];

    downloadCsvFile(`bannikuppe-compost-summary-${getTodayDateString()}.csv`, headers, rows);
    notify('success', 'Summary report exported as CSV.');
  };

  const statTiles = [
    { label: t.dashboard.totalOrganicWaste, val: `${summary.totalCollectedKg} ${t.common.kg}` },
    { label: t.sorting.totalBio, val: `${summary.bioKg} ${t.common.kg}` },
    { label: t.sorting.totalRejected, val: `${summary.rejectedKg} ${t.common.kg}` },
    { label: t.dashboard.totalBatches, val: String(summary.batchesCreated) },
    { label: t.dashboard.completedBatches, val: String(summary.batchesCompleted) },
    { label: t.dashboard.totalCompostProduced, val: `${summary.compostOutputKg} ${t.common.kg}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
            {t.analytics.heading}
          </h1>
          <p className="text-sm text-[#526057] mt-1">{t.analytics.subheading}</p>
        </div>
        <button
          type="button"
          onClick={handleExportSummary}
          className="min-h-[42px] px-4 py-2 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{t.analytics.exportSummary}</span>
        </button>
      </div>

      {/* 6 Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statTiles.map((tile) => (
          <div key={tile.label} className="bg-white border border-[#E2DDD0] rounded-xl p-4">
            <p className="text-xs text-[#526057] truncate">{tile.label}</p>
            <p className="text-xl font-bold text-[#18241D] font-mono-tabular mt-1">{tile.val}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collection Chart */}
        <div className="bg-white border border-[#E2DDD0] rounded-xl p-5">
          <h2 className="text-base font-bold text-[#18241D] mb-4">
            {t.analytics.monthlyCollectionTitle}
          </h2>
          <div className="h-72 w-full">
            {monthlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-[#526057]">
                {t.common.noRecords}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#526057' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#526057' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2DDD0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    dataKey="biodegradable"
                    name={t.sorting.biodegradableBin}
                    fill="#1E6B3A"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rejected"
                    name={t.sorting.nonCompostableBin}
                    fill="#DC2626"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Batch Input vs Harvested Output */}
        <div className="bg-white border border-[#E2DDD0] rounded-xl p-5">
          <h2 className="text-base font-bold text-[#18241D] mb-4">{t.analytics.batchOutputTitle}</h2>
          <div className="h-72 w-full">
            {batchComparisonData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-[#526057]">
                {t.common.noRecords}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={batchComparisonData}
                  margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
                  <XAxis dataKey="id" tick={{ fontSize: 11, fill: '#526057' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#526057' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2DDD0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    dataKey="inputKg"
                    name={t.batches.totalInput}
                    fill="#8BA88E"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="outputKg"
                    name={t.dashboard.totalCompostProduced}
                    fill="#132A1C"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Material Breakdown Horizontal Chart */}
      <div className="bg-white border border-[#E2DDD0] rounded-xl p-5">
        <h2 className="text-base font-bold text-[#18241D] mb-4">
          {t.analytics.materialBreakdownTitle}
        </h2>
        <div className="h-72 w-full">
          {materialData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#526057]">
              {t.common.noRecords}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={materialData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 24, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#526057' }} />
                <YAxis
                  type="category"
                  dataKey="material"
                  width={150}
                  tick={{ fontSize: 12, fill: '#18241D' }}
                />
                <Tooltip
                  formatter={(value) => [`${value ?? 0} ${t.common.kg}`, 'Weight']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2DDD0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="kg" fill="#1E6B3A" radius={[0, 4, 4, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
