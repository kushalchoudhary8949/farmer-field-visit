export type Language = 'en' | 'kn';

export type PageId =
  | 'dashboard'
  | 'sorting'
  | 'batches'
  | 'guide'
  | 'records'
  | 'maturity'
  | 'analytics'
  | 'settings';

export type WasteCategory = 'biodegradable' | 'non-compostable' | 'review';

export type BiodegradableMaterial =
  | 'Dry leaves'
  | 'Vegetable waste'
  | 'Fruit peels'
  | 'Crop residues'
  | 'Other grower-approved organic materials';

export type NonCompostableMaterial =
  | 'Plastic'
  | 'Glass'
  | 'Metal'
  | 'Other unwanted materials';

export interface WasteEntry {
  id: string;
  date: string;
  category: WasteCategory;
  material: string;
  weightKg: number;
  notes: string;
  batchId?: string;
  isDemo?: boolean;
}

export type CompostStage =
  | 'Collection'
  | 'Sorting'
  | 'Layering'
  | 'Moisture and aeration maintenance'
  | 'Maturity assessment'
  | 'Ready for use';

export const COMPOST_STAGES: CompostStage[] = [
  'Collection',
  'Sorting',
  'Layering',
  'Moisture and aeration maintenance',
  'Maturity assessment',
  'Ready for use',
];

export type MoistureObservation =
  | 'Dry'
  | 'Optimal (Damp Sponge)'
  | 'Too Wet'
  | 'Not Checked';

export interface BatchMaterialAddition {
  id: string;
  material: string;
  weightKg: number;
  date: string;
}

export interface CompostBatch {
  id: string;
  name: string;
  createdDate: string;
  materials: BatchMaterialAddition[];
  totalInputWeightKg: number;
  stage: CompostStage;
  moistureObservation: MoistureObservation;
  lastWateringDate: string;
  lastTurningDate: string;
  farmerNotes: string;
  outputWeightKg?: number;
  readyConfirmedAt?: string;
  isDemo?: boolean;
}

export interface CompostRecord {
  id: string;
  date: string;
  batchId: string;
  materialAdded: string;
  quantityKg: number;
  wateringActivity: boolean;
  turningActivity: boolean;
  moistureObservation: string;
  otherObservations: string;
  isDemo?: boolean;
}

export type MaturityStatus =
  | 'Under observation'
  | 'Needs further processing'
  | 'Ready for grower review';

export interface MaturityAssessment {
  id: string;
  batchId: string;
  assessmentDate: string;
  appearance: string;
  smell: string;
  texture: string;
  visibleUndecomposed: string;
  moistureCondition: string;
  growerComments: string;
  status: MaturityStatus;
  confirmedReady: boolean;
  outputWeightKg?: number;
  isDemo?: boolean;
}

export interface AppSettings {
  language: Language;
  stationName: string;
  farmerName: string;
  village: string;
  demoMode: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
