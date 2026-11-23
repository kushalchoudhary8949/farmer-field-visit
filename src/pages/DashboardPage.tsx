import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import {
  Leaf,
  Layers,
  Activity,
  CheckCircle2,
  Recycle,
  PackageCheck,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Plus,
} from 'lucide-react';
import { useCompost } from '../context/CompostContext';
import { STAGE_LABELS, UI_TEXT } from '../i18n/translations';
import { COMPOST_STAGES } from '../types';

export const DashboardPage: React.FC = () => {
  const { wasteEntries, batches, records, assessments, settings, setActivePage } = useCompost();
  const lang = settings.language;
  const t = UI_TEXT[lang];

  const metrics = useMemo(() => {
    const bioKg = wasteEntries
      .filter((w) => w.category === 'biodegradable')
      .reduce((sum, w) => sum + w.weightKg, 0);
    const rejectedKg = wasteEntries
      .filter((w) => w.category === 'non-compostable')
      .reduce((sum, w) => sum + w.weightKg, 0);
    const reviewKg = wasteEntries
      .filter((w) => w.category === 'review')
      .reduce((sum, w) => sum + w.weightKg, 0);
    const totalSortedKg = bioKg + rejectedKg;
    const totalAllKg = totalSortedKg + reviewKg;
    const sortedPct = totalAllKg > 0 ? Math.round((totalSortedKg / totalAllKg) * 100) : 0;

    const totalBatches = batches.length;
    const completedBatches = batches.filter((b) => b.stage === 'Ready for use').length;
    const activeBatches = totalBatches - completedBatches;
    const totalCompostProducedKg = batches
      .filter((b) => b.stage === 'Ready for use')
      .reduce((sum, b) => sum + (b.outputWeightKg ?? 0), 0);

    return {
      bioKg: Number(bioKg.toFixed(1)),
      totalSortedKg: Number(totalSortedKg.toFixed(1)),
      sortedPct,
      totalBatches,
      activeBatches,
      completedBatches,
      totalCompostProducedKg: Number(totalCompostProducedKg.toFixed(1)),
    };
  }, [batches, wasteEntries]);

  const stageChartData = useMemo(() => {
    return COMPOST_STAGES.map((stage, idx) => ({
      stageShort: lang === 'kn' ? `ಹಂತ ${idx + 1}` : `Step ${idx + 1}`,
      stageLabel: STAGE_LABELS[stage][lang],
      batches: batches.filter((b) => b.stage === stage).length,
    }));
  }, [batches, lang]);

  const collectionHistoryData = useMemo(() => {
    const byDate: Record<string, { date: string; biodegradable: number; nonCompostable: number }> = {};
    wasteEntries.forEach((entry) => {
      if (!byDate[entry.date]) {
        byDate[entry.date] = { date: entry.date, biodegradable: 0, nonCompostable: 0 };
      }
      if (entry.category === 'biodegradable') {
        byDate[entry.date].biodegradable = Number(
          (byDate[entry.date].biodegradable + entry.weightKg).toFixed(1)
        );
      } else if (entry.category === 'non-compostable') {
        byDate[entry.date].nonCompostable = Number(
          (byDate[entry.date].nonCompostable + entry.weightKg).toFixed(1)
        );
      }
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [wasteEntries]);

  const recentActivities = useMemo(() => {
    const items: { id: string; date: string; title: string; detail: string; isDemo?: boolean }[] = [];

    wasteEntries.forEach((w) => {
      items.push({
        id: `act-w-${w.id}`,
        date: w.date,
        title:
          w.category === 'biodegradable'
            ? `${lang === 'kn' ? 'ಸಾವಯವ ತ್ಯಾಜ್ಯ' : 'Sorted Organic'}: ${w.material}`
            : w.category === 'non-compostable'
              ? `${lang === 'kn' ? 'ಕೊಳೆಯದ ತ್ಯಾಜ್ಯ' : 'Separated Reject'}: ${w.material}`
              : `${lang === 'kn' ? 'ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ' : 'Held for Review'}: ${w.material}`,
        detail: `${w.weightKg} ${t.common.kg}${w.batchId ? ` · ${w.batchId}` : ''}`,
        isDemo: w.isDemo,
      });
    });

    records.forEach((r) => {
      const actions: string[] = [];
      if (r.quantityKg > 0) actions.push(`+${r.quantityKg} ${t.common.kg} ${r.materialAdded}`);
      if (r.wateringActivity) actions.push(t.records.watering);
      if (r.turningActivity) actions.push(t.records.turning);
      items.push({
        id: `act-r-${r.id}`,
        date: r.date,
        title: `${r.batchId} · ${actions.join(', ') || t.nav.records}`,
        detail: r.otherObservations || r.moistureObservation,
        isDemo: r.isDemo,
      });
    });

    assessments.forEach((a) => {
      items.push({
        id: `act-a-${a.id}`,
        date: a.assessmentDate,
        title: `${t.nav.maturity}: ${a.batchId}`,
        detail: `${a.status}${a.confirmedReady ? ` · ${t.batches.readyConfirmed}` : ''}`,
        isDemo: a.isDemo,
      });
    });

    return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  }, [assessments, lang, records, t, wasteEntries]);

  const kpis = [
    {
      label: t.dashboard.totalOrganicWaste,
      value: `${metrics.bioKg} ${t.common.kg}`,
      icon: Leaf,
      tone: 'text-[#1E6B3A] bg-[#1E6B3A]/10',
    },
    {
      label: t.dashboard.totalBatches,
      value: String(metrics.totalBatches),
      icon: Layers,
      tone: 'text-[#132A1C] bg-[#F2EFE6]',
    },
    {
      label: t.dashboard.activeBatches,
      value: String(metrics.activeBatches),
      icon: Activity,
      tone: 'text-[#9A5B13] bg-[#FEF3C7]',
    },
    {
      label: t.dashboard.completedBatches,
      value: String(metrics.completedBatches),
      icon: CheckCircle2,
      tone: 'text-[#16A34A] bg-[#DCFCE7]',
    },
    {
      label: t.dashboard.wasteSortedRate,
      value: `${metrics.totalSortedKg} ${t.common.kg} (${metrics.sortedPct}%)`,
      icon: Recycle,
      tone: 'text-[#1E6B3A] bg-[#1E6B3A]/10',
    },
    {
      label: t.dashboard.totalCompostProduced,
      value: `${metrics.totalCompostProducedKg} ${t.common.kg}`,
      icon: PackageCheck,
      tone: 'text-[#132A1C] bg-[#E8F3EC]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Primary Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18241D] tracking-tight">
            {t.dashboard.heading}
          </h1>
          <p className="text-sm text-[#526057] mt-1">{t.dashboard.subheading}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActivePage('sorting')}
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#1E6B3A] text-white text-sm font-semibold hover:bg-[#16532C] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.dashboard.logWasteBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePage('batches')}
            className="min-h-[42px] px-4 py-2 rounded-lg bg-white border border-[#E2DDD0] text-[#18241D] text-sm font-semibold hover:bg-[#F2EFE6] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Layers className="w-4 h-4 text-[#1E6B3A]" />
            <span>{t.dashboard.newBatchBtn}</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Metric Grid */}
      <section aria-label="Key Station Metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white border border-[#E2DDD0] rounded-xl p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#526057] truncate">{kpi.label}</p>
                <p className="text-2xl font-bold text-[#18241D] font-mono-tabular mt-1.5">
                  {kpi.value}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${kpi.tone}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </section>

      {/* 4 Proposed Station Modules Shortcut Bar */}
      <section aria-label={t.dashboard.stationComponents}>
        <h2 className="text-sm font-semibold text-[#526057] mb-3">{t.dashboard.stationComponents}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              page: 'sorting' as const,
              title: lang === 'kn' ? '1. ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಸ್ಥಳ' : '1. Sorting Point',
              desc: lang === 'kn' ? 'ಸಾವಯವ ಮತ್ತು ಪ್ಲಾಸ್ಟಿಕ್ ಬೇರ್ಪಡಿಸಿ' : 'Biodegradable vs reject bins',
              icon: Recycle,
            },
            {
              page: 'batches' as const,
              title: lang === 'kn' ? '2. ಕಾಂಪೋಸ್ಟ್ ಗುಂಡಿ' : '2. Compost Bay',
              desc: lang === 'kn' ? 'ಪದರ, ನೀರು ಮತ್ತು ತಿರುವು ನಿರ್ವಹಣೆ' : 'Layering, watering & turning',
              icon: Layers,
            },
            {
              page: 'guide' as const,
              title: lang === 'kn' ? '3. ಕನ್ನಡ ಚಿತ್ರ ಮಾರ್ಗದರ್ಶಿ' : '3. Kannada Process Card',
              desc: lang === 'kn' ? '5 ಹಂತಗಳ ಚಿತ್ರ ಸಹಿತ ಮಾರ್ಗದರ್ಶಿ' : '5-step illustrated farmer guide',
              icon: BookOpen,
            },
            {
              page: 'records' as const,
              title: lang === 'kn' ? '4. ಕಾಂಪೋಸ್ಟ್ ದಾಖಲೆ ಹಾಳೆ' : '4. Compost Record Sheet',
              desc: lang === 'kn' ? 'ದೈನಂದಿನ ದಾಖಲೆ ಮತ್ತು CSV ರಫ್ತು' : 'Daily logbook & CSV export',
              icon: ClipboardList,
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.page}
                type="button"
                onClick={() => setActivePage(mod.page)}
                className="text-left bg-[#F2EFE6] hover:bg-[#EAE5D7] border border-[#E2DDD0] rounded-xl p-4 transition-colors flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#18241D]">
                    <Icon className="w-4 h-4 text-[#1E6B3A] shrink-0" />
                    <span className="truncate">{mod.title}</span>
                  </div>
                  <p className="text-xs text-[#526057] mt-1">{mod.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#526057] shrink-0 mt-0.5" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compost Management Progress Chart */}
        <div className="bg-white border border-[#E2DDD0] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#18241D]">{t.dashboard.progressChartTitle}</h2>
            <button
              type="button"
              onClick={() => setActivePage('batches')}
              className="text-xs font-semibold text-[#1E6B3A] hover:underline whitespace-nowrap"
            >
              {t.nav.batches}
            </button>
          </div>
          <div className="h-64 w-full">
            {batches.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-[#526057]">
                {t.common.noRecords}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageChartData} margin={{ top: 8, right: 12, left: -16, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
                  <XAxis dataKey="stageShort" tick={{ fontSize: 12, fill: '#526057' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#526057' }} />
                  <Tooltip
                    formatter={(value) => [value ?? 0, lang === 'kn' ? 'ಬ್ಯಾಚ್‌ಗಳು' : 'Batches']}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.stageLabel ?? ''}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2DDD0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="batches" fill="#1E6B3A" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Waste Collection History Chart */}
        <div className="bg-white border border-[#E2DDD0] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#18241D]">{t.dashboard.collectionChartTitle}</h2>
            <button
              type="button"
              onClick={() => setActivePage('analytics')}
              className="text-xs font-semibold text-[#1E6B3A] hover:underline whitespace-nowrap"
            >
              {t.nav.analytics}
            </button>
          </div>
          <div className="h-64 w-full">
            {collectionHistoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-[#526057]">
                {t.common.noRecords}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={collectionHistoryData}
                  margin={{ top: 8, right: 12, left: -10, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#526057' }} />
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
                  <Area
                    type="monotone"
                    dataKey="biodegradable"
                    name={lang === 'kn' ? 'ಸಾವಯವ (ಕೆ.ಜಿ)' : 'Biodegradable (kg)'}
                    stroke="#1E6B3A"
                    fill="#1E6B3A"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="nonCompostable"
                    name={lang === 'kn' ? 'ಕೊಳೆಯದ ತ್ಯಾಜ್ಯ (ಕೆ.ಜಿ)' : 'Non-Compostable (kg)'}
                    stroke="#DC2626"
                    fill="#DC2626"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <section className="bg-white border border-[#E2DDD0] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2DDD0] flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#18241D]">{t.dashboard.recentActivities}</h2>
          <button
            type="button"
            onClick={() => setActivePage('records')}
            className="text-xs font-semibold text-[#1E6B3A] hover:underline whitespace-nowrap"
          >
            {t.dashboard.recordSheetBtn}
          </button>
        </div>

        {recentActivities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#526057]">{t.common.noRecords}</p>
            <button
              type="button"
              onClick={() => setActivePage('sorting')}
              className="mt-3 px-4 py-2 rounded-lg bg-[#1E6B3A] text-white text-sm font-medium"
            >
              {t.dashboard.logWasteBtn}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E2DDD0]">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF9F5] transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#526057]">
                    <span className="font-mono-tabular font-medium text-[#18241D]">{act.date}</span>
                    {act.isDemo && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#1E6B3A]">{t.common.demoTag}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#18241D] mt-0.5 truncate">{act.title}</p>
                </div>
                <p className="text-xs text-[#526057] sm:text-right max-w-md truncate">{act.detail}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
