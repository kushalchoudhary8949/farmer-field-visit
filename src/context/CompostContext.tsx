import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_SETTINGS,
  DEMO_ASSESSMENTS,
  DEMO_BATCHES,
  DEMO_RECORDS,
  DEMO_WASTE_ENTRIES,
} from '../data/demoData';
import {
  AppSettings,
  COMPOST_STAGES,
  CompostBatch,
  CompostRecord,
  CompostStage,
  Language,
  MaturityAssessment,
  MoistureObservation,
  PageId,
  ToastMessage,
  WasteCategory,
  WasteEntry,
} from '../types';
import { getTodayDateString, loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

interface CompostContextValue {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedBatchForMaturity: string | null;
  setSelectedBatchForMaturity: (batchId: string | null) => void;

  wasteEntries: WasteEntry[];
  batches: CompostBatch[];
  records: CompostRecord[];
  assessments: MaturityAssessment[];
  settings: AppSettings;
  toasts: ToastMessage[];

  notify: (type: ToastMessage['type'], message: string) => void;
  dismissToast: (id: string) => void;

  setLanguage: (lang: Language) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetDemoData: () => void;
  clearAllData: () => void;

  // Waste sorting CRUD
  addWasteEntry: (entry: Omit<WasteEntry, 'id'>) => void;
  updateWasteEntry: (id: string, updates: Partial<WasteEntry>) => void;
  deleteWasteEntry: (id: string) => void;

  // Compost batches CRUD
  createBatch: (payload: {
    name: string;
    createdDate: string;
    initialMaterial?: string;
    initialWeightKg?: number;
    farmerNotes: string;
  }) => void;
  updateBatch: (id: string, updates: Partial<CompostBatch>) => void;
  deleteBatch: (id: string) => void;
  addMaterialToBatch: (batchId: string, material: string, weightKg: number, date: string, alsoLogRecord?: boolean) => void;
  recordBatchWatering: (batchId: string, date: string, moisture: MoistureObservation, note?: string) => void;
  recordBatchTurning: (batchId: string, date: string, moisture: MoistureObservation, note?: string) => void;
  advanceBatchStage: (batchId: string, targetStage?: CompostStage) => boolean;

  // Record sheet CRUD
  addRecord: (rec: Omit<CompostRecord, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<CompostRecord>) => void;
  deleteRecord: (id: string) => void;

  // Maturity assessment CRUD
  addAssessment: (
    assessment: Omit<MaturityAssessment, 'id'>,
    markBatchReady?: boolean
  ) => void;
  deleteAssessment: (id: string) => void;
  confirmBatchReadyFromAssessment: (assessmentId: string, outputWeightKg: number) => void;
}

const CompostContext = createContext<CompostContextValue | null>(null);

export const CompostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [selectedBatchForMaturity, setSelectedBatchForMaturity] = useState<string | null>(null);

  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>(() =>
    loadFromStorage<WasteEntry[]>(STORAGE_KEYS.WASTE_ENTRIES, DEMO_WASTE_ENTRIES)
  );
  const [batches, setBatches] = useState<CompostBatch[]>(() =>
    loadFromStorage<CompostBatch[]>(STORAGE_KEYS.BATCHES, DEMO_BATCHES)
  );
  const [records, setRecords] = useState<CompostRecord[]>(() =>
    loadFromStorage<CompostRecord[]>(STORAGE_KEYS.RECORDS, DEMO_RECORDS)
  );
  const [assessments, setAssessments] = useState<MaturityAssessment[]>(() =>
    loadFromStorage<MaturityAssessment[]>(STORAGE_KEYS.ASSESSMENTS, DEMO_ASSESSMENTS)
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WASTE_ENTRIES, wasteEntries);
  }, [wasteEntries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BATCHES, batches);
  }, [batches]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECORDS, records);
  }, [records]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, assessments);
  }, [assessments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (type: ToastMessage['type'], message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        dismissToast(id);
      }, 4200);
    },
    [dismissToast]
  );

  const setLanguage = useCallback((language: Language) => {
    setSettings((prev) => ({ ...prev, language }));
  }, []);

  const updateSettings = useCallback(
    (partial: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...partial }));
      notify('success', settings.language === 'kn' ? 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ.' : 'Station settings saved.');
    },
    [notify, settings.language]
  );

  const resetDemoData = useCallback(() => {
    setWasteEntries(DEMO_WASTE_ENTRIES);
    setBatches(DEMO_BATCHES);
    setRecords(DEMO_RECORDS);
    setAssessments(DEMO_ASSESSMENTS);
    setSettings((prev) => ({ ...prev, demoMode: true }));
    notify(
      'success',
      settings.language === 'kn'
        ? 'ಬನ್ನಿಕುಪ್ಪೆ ಡೆಮೋ ಮಾಹಿತಿಯನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ.'
        : 'Bannikuppe demonstration data restored.'
    );
  }, [notify, settings.language]);

  const clearAllData = useCallback(() => {
    setWasteEntries([]);
    setBatches([]);
    setRecords([]);
    setAssessments([]);
    setSettings((prev) => ({ ...prev, demoMode: false }));
    notify(
      'info',
      settings.language === 'kn'
        ? 'ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ತೆರವುಗೊಳಿಸಲಾಗಿದೆ.'
        : 'All stored records cleared.'
    );
  }, [notify, settings.language]);

  const addMaterialToBatch = useCallback(
    (
      batchId: string,
      material: string,
      weightKg: number,
      date: string,
      alsoLogRecord = true
    ) => {
      if (weightKg <= 0 || Number.isNaN(weightKg)) {
        notify('error', 'Weight must be greater than 0 kg.');
        return;
      }
      setBatches((prev) =>
        prev.map((b) => {
          if (b.id !== batchId) return b;
          const addition = {
            id: `BM-${Date.now()}`,
            material,
            weightKg,
            date,
          };
          return {
            ...b,
            materials: [...b.materials, addition],
            totalInputWeightKg: Number((b.totalInputWeightKg + weightKg).toFixed(2)),
          };
        })
      );
      if (alsoLogRecord) {
        const recId = `REC-${String(Date.now()).slice(-5)}`;
        setRecords((prev) => [
          {
            id: recId,
            date,
            batchId,
            materialAdded: material,
            quantityKg: weightKg,
            wateringActivity: false,
            turningActivity: false,
            moistureObservation: 'Not Checked',
            otherObservations: 'Added via material intake',
          },
          ...prev,
        ]);
      }
      notify('success', `Added ${weightKg} kg of ${material} to ${batchId}.`);
    },
    [notify]
  );

  const addWasteEntry = useCallback(
    (entry: Omit<WasteEntry, 'id'>) => {
      if (entry.weightKg <= 0 || Number.isNaN(entry.weightKg)) {
        notify('error', 'Weight must be a positive number greater than 0.');
        return;
      }
      const id = `WST-${String(Date.now()).slice(-4)}`;
      const newEntry: WasteEntry = { ...entry, id };
      setWasteEntries((prev) => [newEntry, ...prev]);

      // Only biodegradable entries assigned to a batch can be added to a batch
      if (entry.category === 'biodegradable' && entry.batchId) {
        addMaterialToBatch(entry.batchId, entry.material, entry.weightKg, entry.date, true);
      } else {
        notify('success', `Waste entry (${entry.material}, ${entry.weightKg} kg) saved.`);
      }
    },
    [addMaterialToBatch, notify]
  );

  const updateWasteEntry = useCallback(
    (id: string, updates: Partial<WasteEntry>) => {
      if (updates.weightKg !== undefined && (updates.weightKg <= 0 || Number.isNaN(updates.weightKg))) {
        notify('error', 'Weight must be greater than 0 kg.');
        return;
      }
      setWasteEntries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      notify('success', 'Waste sorting entry updated.');
    },
    [notify]
  );

  const deleteWasteEntry = useCallback(
    (id: string) => {
      setWasteEntries((prev) => prev.filter((item) => item.id !== id));
      notify('info', 'Waste entry deleted.');
    },
    [notify]
  );

  const createBatch = useCallback(
    (payload: {
      name: string;
      createdDate: string;
      initialMaterial?: string;
      initialWeightKg?: number;
      farmerNotes: string;
    }) => {
      const weight = payload.initialWeightKg ?? 0;
      if (weight < 0 || Number.isNaN(weight)) {
        notify('error', 'Initial weight cannot be negative.');
        return;
      }
      const nextNum = batches.length + 1;
      const padded = String(nextNum).padStart(2, '0');
      const existingIds = new Set(batches.map((b) => b.id));
      let candidateId = `BATCH-BK-${padded}`;
      let suffix = nextNum;
      while (existingIds.has(candidateId)) {
        suffix += 1;
        candidateId = `BATCH-BK-${String(suffix).padStart(2, '0')}`;
      }

      const materials =
        payload.initialMaterial && weight > 0
          ? [{ id: `BM-${Date.now()}`, material: payload.initialMaterial, weightKg: weight, date: payload.createdDate }]
          : [];

      const newBatch: CompostBatch = {
        id: candidateId,
        name: payload.name.trim() || `Compost Bay ${padded}`,
        createdDate: payload.createdDate || getTodayDateString(),
        materials,
        totalInputWeightKg: weight,
        stage: weight > 0 ? 'Layering' : 'Collection',
        moistureObservation: 'Not Checked',
        lastWateringDate: '—',
        lastTurningDate: '—',
        farmerNotes: payload.farmerNotes,
      };

      setBatches((prev) => [newBatch, ...prev]);
      if (payload.initialMaterial && weight > 0) {
        setRecords((prev) => [
          {
            id: `REC-${String(Date.now()).slice(-5)}`,
            date: newBatch.createdDate,
            batchId: newBatch.id,
            materialAdded: payload.initialMaterial!,
            quantityKg: weight,
            wateringActivity: false,
            turningActivity: false,
            moistureObservation: 'Not Checked',
            otherObservations: 'Initial batch setup',
          },
          ...prev,
        ]);
      }
      notify('success', `Created ${newBatch.id}: ${newBatch.name}.`);
    },
    [batches, notify]
  );

  const updateBatch = useCallback(
    (id: string, updates: Partial<CompostBatch>) => {
      setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      notify('success', `Updated batch ${id}.`);
    },
    [notify]
  );

  const deleteBatch = useCallback(
    (id: string) => {
      setBatches((prev) => prev.filter((b) => b.id !== id));
      notify('info', `Batch ${id} removed.`);
    },
    [notify]
  );

  const recordBatchWatering = useCallback(
    (batchId: string, date: string, moisture: MoistureObservation, note?: string) => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? {
                ...b,
                lastWateringDate: date,
                moistureObservation: moisture,
                farmerNotes: note ? `${note}` : b.farmerNotes,
              }
            : b
        )
      );
      setRecords((prev) => [
        {
          id: `REC-${String(Date.now()).slice(-5)}`,
          date,
          batchId,
          materialAdded: 'None (Watering)',
          quantityKg: 0,
          wateringActivity: true,
          turningActivity: false,
          moistureObservation: moisture,
          otherObservations: note || 'Watering logged from Compost Bay',
        },
        ...prev,
      ]);
      notify('success', `Watering logged for ${batchId}.`);
    },
    [notify]
  );

  const recordBatchTurning = useCallback(
    (batchId: string, date: string, moisture: MoistureObservation, note?: string) => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? {
                ...b,
                lastTurningDate: date,
                moistureObservation: moisture,
                farmerNotes: note ? `${note}` : b.farmerNotes,
              }
            : b
        )
      );
      setRecords((prev) => [
        {
          id: `REC-${String(Date.now()).slice(-5)}`,
          date,
          batchId,
          materialAdded: 'None (Turning)',
          quantityKg: 0,
          wateringActivity: false,
          turningActivity: true,
          moistureObservation: moisture,
          otherObservations: note || 'Aeration turning logged from Compost Bay',
        },
        ...prev,
      ]);
      notify('success', `Aeration turning logged for ${batchId}.`);
    },
    [notify]
  );

  const advanceBatchStage = useCallback(
    (batchId: string, targetStage?: CompostStage): boolean => {
      const batch = batches.find((b) => b.id === batchId);
      if (!batch) return false;
      const currentIdx = COMPOST_STAGES.indexOf(batch.stage);
      const nextStage = targetStage ?? COMPOST_STAGES[Math.min(currentIdx + 1, COMPOST_STAGES.length - 1)];

      if (nextStage === 'Ready for use') {
        const hasConfirmedAssessment = assessments.some(
          (a) => a.batchId === batchId && a.confirmedReady
        );
        if (!hasConfirmedAssessment) {
          notify(
            'error',
            'Maturity observation & grower confirmation required before marking a batch Ready for use.'
          );
          return false;
        }
      }

      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, stage: nextStage } : b))
      );
      notify('success', `${batchId} moved to "${nextStage}".`);
      return true;
    },
    [assessments, batches, notify]
  );

  const addRecord = useCallback(
    (rec: Omit<CompostRecord, 'id'>) => {
      if (rec.quantityKg < 0 || Number.isNaN(rec.quantityKg)) {
        notify('error', 'Quantity cannot be negative.');
        return;
      }
      const id = `REC-${String(Date.now()).slice(-5)}`;
      const newRecord: CompostRecord = { ...rec, id };
      setRecords((prev) => [newRecord, ...prev]);

      // Sync batch metadata if watering/turning/material added
      setBatches((prev) =>
        prev.map((b) => {
          if (b.id !== rec.batchId) return b;
          const updatedMaterials =
            rec.quantityKg > 0 && rec.materialAdded && !rec.materialAdded.startsWith('None')
              ? [
                  ...b.materials,
                  {
                    id: `BM-${Date.now()}`,
                    material: rec.materialAdded,
                    weightKg: rec.quantityKg,
                    date: rec.date,
                  },
                ]
              : b.materials;
          return {
            ...b,
            materials: updatedMaterials,
            totalInputWeightKg:
              rec.quantityKg > 0 && rec.materialAdded && !rec.materialAdded.startsWith('None')
                ? Number((b.totalInputWeightKg + rec.quantityKg).toFixed(2))
                : b.totalInputWeightKg,
            lastWateringDate: rec.wateringActivity ? rec.date : b.lastWateringDate,
            lastTurningDate: rec.turningActivity ? rec.date : b.lastTurningDate,
          };
        })
      );
      notify('success', `Record ${id} added to Compost Record Sheet.`);
    },
    [notify]
  );

  const updateRecord = useCallback(
    (id: string, updates: Partial<CompostRecord>) => {
      if (updates.quantityKg !== undefined && (updates.quantityKg < 0 || Number.isNaN(updates.quantityKg))) {
        notify('error', 'Quantity cannot be negative.');
        return;
      }
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      notify('success', `Record ${id} updated.`);
    },
    [notify]
  );

  const deleteRecord = useCallback(
    (id: string) => {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      notify('info', `Record ${id} deleted.`);
    },
    [notify]
  );

  const addAssessment = useCallback(
    (assessment: Omit<MaturityAssessment, 'id'>, markBatchReady = false) => {
      if (
        assessment.outputWeightKg !== undefined &&
        (assessment.outputWeightKg < 0 || Number.isNaN(assessment.outputWeightKg))
      ) {
        notify('error', 'Harvested compost weight cannot be negative.');
        return;
      }
      if (markBatchReady && !assessment.confirmedReady) {
        notify('error', 'Please check grower confirmation before marking the batch ready.');
        return;
      }

      const id = `MAT-${String(Date.now()).slice(-4)}`;
      const newAssessment: MaturityAssessment = {
        ...assessment,
        id,
        status: markBatchReady ? 'Ready for grower review' : assessment.status,
      };
      setAssessments((prev) => [newAssessment, ...prev]);

      if (markBatchReady && assessment.confirmedReady) {
        setBatches((prev) =>
          prev.map((b) =>
            b.id === assessment.batchId
              ? {
                  ...b,
                  stage: 'Ready for use',
                  readyConfirmedAt: assessment.assessmentDate,
                  outputWeightKg:
                    assessment.outputWeightKg && assessment.outputWeightKg > 0
                      ? assessment.outputWeightKg
                      : Math.round(b.totalInputWeightKg * 0.58),
                }
              : b
          )
        );
        notify('success', `Maturity confirmed & ${assessment.batchId} marked Ready for use.`);
      } else {
        setBatches((prev) =>
          prev.map((b) =>
            b.id === assessment.batchId && b.stage !== 'Ready for use'
              ? { ...b, stage: 'Maturity assessment' }
              : b
          )
        );
        notify('success', `Maturity observation logged for ${assessment.batchId}.`);
      }
    },
    [notify]
  );

  const confirmBatchReadyFromAssessment = useCallback(
    (assessmentId: string, outputWeightKg: number) => {
      if (outputWeightKg <= 0 || Number.isNaN(outputWeightKg)) {
        notify('error', 'Please enter harvested compost output weight (kg > 0).');
        return;
      }
      const target = assessments.find((a) => a.id === assessmentId);
      if (!target) return;

      setAssessments((prev) =>
        prev.map((a) =>
          a.id === assessmentId
            ? {
                ...a,
                status: 'Ready for grower review',
                confirmedReady: true,
                outputWeightKg,
              }
            : a
        )
      );
      setBatches((prev) =>
        prev.map((b) =>
          b.id === target.batchId
            ? {
                ...b,
                stage: 'Ready for use',
                readyConfirmedAt: getTodayDateString(),
                outputWeightKg,
              }
            : b
        )
      );
      notify('success', `${target.batchId} confirmed ready with ${outputWeightKg} kg output.`);
    },
    [assessments, notify]
  );

  const deleteAssessment = useCallback(
    (id: string) => {
      setAssessments((prev) => prev.filter((a) => a.id !== id));
      notify('info', 'Maturity assessment removed.');
    },
    [notify]
  );

  return (
    <CompostContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedBatchForMaturity,
        setSelectedBatchForMaturity,
        wasteEntries,
        batches,
        records,
        assessments,
        settings,
        toasts,
        notify,
        dismissToast,
        setLanguage,
        updateSettings,
        resetDemoData,
        clearAllData,
        addWasteEntry,
        updateWasteEntry,
        deleteWasteEntry,
        createBatch,
        updateBatch,
        deleteBatch,
        addMaterialToBatch,
        recordBatchWatering,
        recordBatchTurning,
        advanceBatchStage,
        addRecord,
        updateRecord,
        deleteRecord,
        addAssessment,
        deleteAssessment,
        confirmBatchReadyFromAssessment,
      }}
    >
      {children}
    </CompostContext.Provider>
  );
};

export function useCompost(): CompostContextValue {
  const ctx = useContext(CompostContext);
  if (!ctx) throw new Error('useCompost must be used within CompostProvider');
  return ctx;
}

export function isBatchReadyEligible(
  batchId: string,
  assessments: MaturityAssessment[]
): boolean {
  return assessments.some((a) => a.batchId === batchId && a.confirmedReady);
}

export function getCategoryLabel(category: WasteCategory, lang: Language): string {
  if (category === 'biodegradable') {
    return lang === 'kn' ? 'ಸಾವಯವ (ಕೊಳೆಯುವ)' : 'Biodegradable';
  }
  if (category === 'non-compostable') {
    return lang === 'kn' ? 'ಕೊಳೆಯದ ತ್ಯಾಜ್ಯ' : 'Non-Compostable';
  }
  return lang === 'kn' ? 'ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ' : 'Needs Review';
}
