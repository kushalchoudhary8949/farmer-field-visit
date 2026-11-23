export const STORAGE_KEYS = {
  WASTE_ENTRIES: 'bannikuppe_compost_waste_v1',
  BATCHES: 'bannikuppe_compost_batches_v1',
  RECORDS: 'bannikuppe_compost_records_v1',
  ASSESSMENTS: 'bannikuppe_compost_assessments_v1',
  SETTINGS: 'bannikuppe_compost_settings_v1',
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors gracefully
  }
}

export function escapeCsvCell(val: string | number | boolean | undefined | null): string {
  const str = val === undefined || val === null ? '' : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCsvFile(filename: string, headers: string[], rows: (string | number | boolean | undefined | null)[][]): void {
  const csvLines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ];
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
