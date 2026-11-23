import { CompostStage, Language, MaturityStatus, MoistureObservation, PageId } from '../types';

export const UI_TEXT: Record<
  Language,
  {
    appTitle: string;
    appSubtitle: string;
    demoBanner: string;
    resetDemo: string;
    nav: Record<PageId, string>;
    quickAddWaste: string;
    languageLabel: string;
    common: {
      save: string;
      cancel: string;
      edit: string;
      delete: string;
      add: string;
      search: string;
      filter: string;
      all: string;
      downloadCsv: string;
      yes: string;
      no: string;
      kg: string;
      date: string;
      notes: string;
      actions: string;
      demoTag: string;
      close: string;
      confirm: string;
      noRecords: string;
      batchId: string;
      status: string;
      viewHistory: string;
    };
    dashboard: {
      heading: string;
      subheading: string;
      totalOrganicWaste: string;
      totalBatches: string;
      activeBatches: string;
      completedBatches: string;
      wasteSortedRate: string;
      totalCompostProduced: string;
      progressChartTitle: string;
      collectionChartTitle: string;
      recentActivities: string;
      stationComponents: string;
      logWasteBtn: string;
      newBatchBtn: string;
      openGuideBtn: string;
      recordSheetBtn: string;
    };
    sorting: {
      heading: string;
      subheading: string;
      biodegradableBin: string;
      nonCompostableBin: string;
      reviewTray: string;
      reviewNotice: string;
      addEntryTitle: string;
      categoryLabel: string;
      materialLabel: string;
      weightLabel: string;
      assignBatchLabel: string;
      totalBio: string;
      totalRejected: string;
      totalReview: string;
      markBio: string;
      markRejected: string;
      entriesTitle: string;
    };
    batches: {
      heading: string;
      subheading: string;
      createBatch: string;
      batchName: string;
      totalInput: string;
      currentStage: string;
      moistureStatus: string;
      lastWatered: string;
      lastTurned: string;
      addMaterial: string;
      logWatering: string;
      logTurning: string;
      advanceStage: string;
      assessMaturity: string;
      maturityRequiredNotice: string;
      readyConfirmed: string;
    };
    guide: {
      heading: string;
      subheading: string;
      previous: string;
      next: string;
      stepLabel: string;
      advisoryDisclaimer: string;
    };
    records: {
      heading: string;
      subheading: string;
      addRecord: string;
      materialAdded: string;
      quantityKg: string;
      watering: string;
      turning: string;
      moistureObs: string;
      otherObs: string;
      fromDate: string;
      toDate: string;
      clearFilters: string;
    };
    maturity: {
      heading: string;
      subheading: string;
      newAssessment: string;
      appearance: string;
      smell: string;
      texture: string;
      undecomposed: string;
      moistureCond: string;
      growerComments: string;
      assessmentStatus: string;
      confirmCheckbox: string;
      outputWeightLabel: string;
      markBatchReady: string;
      guidanceNote: string;
      reviewListTitle: string;
    };
    analytics: {
      heading: string;
      subheading: string;
      exportSummary: string;
      monthlyCollectionTitle: string;
      materialBreakdownTitle: string;
      batchOutputTitle: string;
    };
    settings: {
      heading: string;
      subheading: string;
      profileSection: string;
      stationName: string;
      farmerName: string;
      village: string;
      languageSection: string;
      dataSection: string;
      resetDemoBtn: string;
      clearAllBtn: string;
      exportBackupBtn: string;
    };
  }
> = {
  en: {
    appTitle: 'Smart Compost Management System',
    appSubtitle: 'Sustainable Organic Waste Management for Farmers – Bannikuppe',
    demoBanner: 'DEMO MODE · Showing Bannikuppe field visit demonstration data',
    resetDemo: 'Reset Demo Data',
    nav: {
      dashboard: 'Dashboard',
      sorting: 'Waste Sorting',
      batches: 'Compost Batches',
      guide: 'Process Guide',
      records: 'Record Sheet',
      maturity: 'Maturity Assessment',
      analytics: 'Analytics & Reports',
      settings: 'Settings',
    },
    quickAddWaste: 'Log Waste',
    languageLabel: 'Language',
    common: {
      save: 'Save Record',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      search: 'Search records...',
      filter: 'Filter',
      all: 'All',
      downloadCsv: 'Download CSV',
      yes: 'Yes',
      no: 'No',
      kg: 'kg',
      date: 'Date',
      notes: 'Notes',
      actions: 'Actions',
      demoTag: 'Demo',
      close: 'Close',
      confirm: 'Confirm',
      noRecords: 'No records found yet.',
      batchId: 'Batch ID',
      status: 'Status',
      viewHistory: 'Batch History',
    },
    dashboard: {
      heading: 'Station Overview',
      subheading: 'Bannikuppe Simple Compost Management Station — live records & batch progress',
      totalOrganicWaste: 'Organic Waste Collected',
      totalBatches: 'Total Compost Batches',
      activeBatches: 'Active Batches',
      completedBatches: 'Completed Batches',
      wasteSortedRate: 'Waste Successfully Sorted',
      totalCompostProduced: 'Compost Produced',
      progressChartTitle: 'Compost Batches by Stage',
      collectionChartTitle: 'Waste Collection History (kg)',
      recentActivities: 'Recent Station Activities',
      stationComponents: 'Simple Compost Station Modules',
      logWasteBtn: 'Log Waste Entry',
      newBatchBtn: 'Create Batch',
      openGuideBtn: 'Kannada Process Card',
      recordSheetBtn: 'Open Record Sheet',
    },
    sorting: {
      heading: 'Organic Waste Sorting Point',
      subheading: 'Separate farm biodegradable waste from plastics, glass, and metals before composting',
      biodegradableBin: 'Biodegradable Bin',
      nonCompostableBin: 'Non-Compostable Bin',
      reviewTray: 'Needs Review / Uncertain',
      reviewNotice:
        'Uncertain or potentially contaminated materials are held for manual review and never auto-classified as compostable.',
      addEntryTitle: 'Record Sorted Waste',
      categoryLabel: 'Sorting Category',
      materialLabel: 'Material Type',
      weightLabel: 'Weight (kg)',
      assignBatchLabel: 'Assign to Compost Batch (Optional)',
      totalBio: 'Total Biodegradable',
      totalRejected: 'Total Non-Compostable',
      totalReview: 'Held for Review',
      markBio: 'Approve Organic',
      markRejected: 'Reject Item',
      entriesTitle: 'Sorting Log',
    },
    batches: {
      heading: 'Compost Bay Management',
      subheading: 'Track layering, moisture, aeration turning, and maturity assessment per batch',
      createBatch: 'New Compost Batch',
      batchName: 'Batch Name',
      totalInput: 'Total Input Weight',
      currentStage: 'Current Stage',
      moistureStatus: 'Moisture Observation',
      lastWatered: 'Last Watering',
      lastTurned: 'Last Turning',
      addMaterial: 'Add Material',
      logWatering: 'Log Watering',
      logTurning: 'Log Turning',
      advanceStage: 'Advance Stage',
      assessMaturity: 'Assess Maturity',
      maturityRequiredNotice:
        'A batch can only be marked Ready for use after completing a Maturity Assessment observation and confirmation.',
      readyConfirmed: 'Maturity Confirmed',
    },
    guide: {
      heading: 'Picture-Based Compost Process Card',
      subheading: 'Five-step visual field guide for Bannikuppe farmers (English & ಕನ್ನಡ)',
      previous: 'Previous Step',
      next: 'Next Step',
      stepLabel: 'Step',
      advisoryDisclaimer:
        'Advisory Note: This visual process card supports daily compost station operations and does not replace locally approved agricultural extension advice.',
    },
    records: {
      heading: 'Compost Record Sheet',
      subheading: 'Digital logbook of batch inputs, watering, turning, and moisture observations',
      addRecord: 'Add Sheet Entry',
      materialAdded: 'Material Added',
      quantityKg: 'Quantity (kg)',
      watering: 'Watering',
      turning: 'Turning',
      moistureObs: 'Moisture Observation',
      otherObs: 'Other Observations',
      fromDate: 'From Date',
      toDate: 'To Date',
      clearFilters: 'Clear Filters',
    },
    maturity: {
      heading: 'Compost Maturity Assessment',
      subheading: 'Record physical observations before approving compost for farmland application',
      newAssessment: 'Record Maturity Observation',
      appearance: 'Appearance & Color',
      smell: 'Smell / Odor',
      texture: 'Texture (Hand Feel)',
      undecomposed: 'Visible Undecomposed Material',
      moistureCond: 'Moisture Condition',
      growerComments: 'Grower Comments',
      assessmentStatus: 'Observation Status',
      confirmCheckbox:
        'I have personally inspected this batch and confirm it meets physical observations for agricultural use.',
      outputWeightLabel: 'Harvested Compost Output (kg)',
      markBatchReady: 'Confirm & Mark Batch Ready',
      guidanceNote:
        'Maturity is evaluated strictly from farmer physical observations (appearance, smell, texture, and absence of raw waste)—never from elapsed days alone.',
      reviewListTitle: 'Recorded Assessments',
    },
    analytics: {
      heading: 'Analytics & Summary Reports',
      subheading: 'Collection totals, sorting efficiency, batch progress, and CSV export',
      exportSummary: 'Export Summary Report (CSV)',
      monthlyCollectionTitle: 'Monthly Waste Collection (Biodegradable vs Rejected)',
      materialBreakdownTitle: 'Sorted Material Breakdown (kg)',
      batchOutputTitle: 'Batch Input vs Harvested Output (kg)',
    },
    settings: {
      heading: 'Station Settings & Data',
      subheading: 'Configure station details, Kannada/English language, and LocalStorage demo data',
      profileSection: 'Station Profile',
      stationName: 'Station Name',
      farmerName: 'Lead Farmer / Operator',
      village: 'Village & District',
      languageSection: 'Interface Language',
      dataSection: 'Demonstration & Local Data Controls',
      resetDemoBtn: 'Reset Demo Data',
      clearAllBtn: 'Clear All Stored Records',
      exportBackupBtn: 'Export JSON Backup',
    },
  },
  kn: {
    appTitle: 'ಸ್ಮಾರ್ಟ್ ಕಾಂಪೋಸ್ಟ್ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ',
    appSubtitle: 'ರೈತರಿಗಾಗಿ ಸುಸ್ಥಿರ ಸಾವಯವ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ – ಬನ್ನಿಕುಪ್ಪೆ',
    demoBanner: 'ಡೆಮೋ ಮೋಡ್ · ಬನ್ನಿಕುಪ್ಪೆ ಕ್ಷೇತ್ರ ಭೇಟಿಯ ಮಾದರಿ ಮಾಹಿತಿ ತೋರಿಸಲಾಗುತ್ತಿದೆ',
    resetDemo: 'ಡೆಮೋ ಮಾಹಿತಿ ಮರುಹೊಂದಿಸಿ',
    nav: {
      dashboard: 'ಮುಖಪುಟ',
      sorting: 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ',
      batches: 'ಗೊಬ್ಬರ ಗುಂಡಿಗಳು',
      guide: 'ಪ್ರಕ್ರಿಯೆ ಮಾರ್ಗದರ್ಶಿ',
      records: 'ದಾಖಲೆ ಪುಸ್ತಕ',
      maturity: 'ಪಕ್ವತೆ ಪರಿಶೀಲನೆ',
      analytics: 'ವರದಿ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ',
      settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    },
    quickAddWaste: 'ತ್ಯಾಜ್ಯ ಸೇರಿಸಿ',
    languageLabel: 'ಭಾಷೆ',
    common: {
      save: 'ದಾಖಲೆ ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      edit: 'ತಿದ್ದುಪಡಿ',
      delete: 'ಅಳಿಸಿ',
      add: 'ಸೇರಿಸಿ',
      search: 'ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ...',
      filter: 'ಫಿಲ್ಟರ್',
      all: 'ಎಲ್ಲಾ',
      downloadCsv: 'CSV ಡೌನ್‌ಲೋಡ್',
      yes: 'ಹೌದು',
      no: 'ಇಲ್ಲ',
      kg: 'ಕೆ.ಜಿ',
      date: 'ದಿನಾಂಕ',
      notes: 'ಟಿಪ್ಪಣಿ',
      actions: 'ಕ್ರಿಯೆಗಳು',
      demoTag: 'ಮಾದರಿ',
      close: 'ಮುಚ್ಚಿ',
      confirm: 'ದೃಢೀಕರಿಸಿ',
      noRecords: 'ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
      batchId: 'ಬ್ಯಾಚ್ ಸಂಖ್ಯೆ',
      status: 'ಸ್ಥಿತಿ',
      viewHistory: 'ಬ್ಯಾಚ್ ಇತಿಹಾಸ',
    },
    dashboard: {
      heading: 'ಕೇಂದ್ರದ ಅವಲೋಕನ',
      subheading: 'ಬನ್ನಿಕುಪ್ಪೆ ಸರಳ ಕಾಂಪೋಸ್ಟ್ ನಿರ್ವಹಣಾ ಕೇಂದ್ರ — ದೈನಂದಿನ ದಾಖಲೆಗಳು ಮತ್ತು ಪ್ರಗತಿ',
      totalOrganicWaste: 'ಸಂಗ್ರಹಿಸಿದ ಸಾವಯವ ತ್ಯಾಜ್ಯ',
      totalBatches: 'ಒಟ್ಟು ಬ್ಯಾಚ್‌ಗಳು',
      activeBatches: 'ಸಕ್ರಿಯ ಬ್ಯಾಚ್‌ಗಳು',
      completedBatches: 'ಪೂರ್ಣಗೊಂಡ ಬ್ಯಾಚ್‌ಗಳು',
      wasteSortedRate: 'ಯಶಸ್ವಿಯಾಗಿ ವಿಂಗಡಿಸಿದ ತ್ಯಾಜ್ಯ',
      totalCompostProduced: 'ಉತ್ಪಾದಿಸಿದ ಗೊಬ್ಬರ',
      progressChartTitle: 'ಹಂತಗಳ ಪ್ರಕಾರ ಕಾಂಪೋಸ್ಟ್ ಬ್ಯಾಚ್‌ಗಳು',
      collectionChartTitle: 'ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ ಇತಿಹಾಸ (ಕೆ.ಜಿ)',
      recentActivities: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು',
      stationComponents: 'ಕೇಂದ್ರದ ಪ್ರಮುಖ ವಿಭಾಗಗಳು',
      logWasteBtn: 'ತ್ಯಾಜ್ಯ ದಾಖಲಿಸಿ',
      newBatchBtn: 'ಹೊಸ ಬ್ಯಾಚ್ ರಚಿಸಿ',
      openGuideBtn: 'ಕನ್ನಡ ಪ್ರಕ್ರಿಯೆ ಕಾರ್ಡ್',
      recordSheetBtn: 'ದಾಖಲೆ ಪುಸ್ತಕ ತೆರೆಯಿರಿ',
    },
    sorting: {
      heading: 'ಸಾವಯವ ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ಕೇಂದ್ರ',
      subheading: 'ಗೊಬ್ಬರ ತಯಾರಿಕೆಗೆ ಮುನ್ನ ಪ್ಲಾಸ್ಟಿಕ್, ಗಾಜು ಮತ್ತು ಲೋಹಗಳನ್ನು ಸಾವಯವ ತ್ಯಾಜ್ಯದಿಂದ ಬೇರ್ಪಡಿಸಿ',
      biodegradableBin: 'ಕೊಳೆಯುವ ಸಾವಯವ ಬುಟ್ಟಿ',
      nonCompostableBin: 'ಕೊಳೆಯದ ತ್ಯಾಜ್ಯ ಬುಟ್ಟಿ',
      reviewTray: 'ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ / ಅನುಮಾನಾಸ್ಪದ',
      reviewNotice:
        'ಅನುಮಾನಾಸ್ಪದ ವಸ್ತುಗಳನ್ನು ಪರಿಶೀಲನೆಗಾಗಿ ಪ್ರತ್ಯೇಕವಾಗಿ ಇಡಲಾಗುತ್ತದೆ; ಅವುಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಾವಯವ ಎಂದು ವರ್ಗೀಕರಿಸಲಾಗುವುದಿಲ್ಲ.',
      addEntryTitle: 'ವಿಂಗಡಿಸಿದ ತ್ಯಾಜ್ಯ ದಾಖಲಿಸಿ',
      categoryLabel: 'ವಿಂಗಡಣೆ ವರ್ಗ',
      materialLabel: 'ತ್ಯಾಜ್ಯದ ವಿಧ',
      weightLabel: 'ತೂಕ (ಕೆ.ಜಿ)',
      assignBatchLabel: 'ಬ್ಯಾಚ್‌ಗೆ ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)',
      totalBio: 'ಒಟ್ಟು ಸಾವಯವ ತ್ಯಾಜ್ಯ',
      totalRejected: 'ಒಟ್ಟು ಕೊಳೆಯದ ತ್ಯಾಜ್ಯ',
      totalReview: 'ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ',
      markBio: 'ಸಾವಯವ ಎಂದು ದೃಢೀಕರಿಸಿ',
      markRejected: 'ತಿರಸ್ಕರಿಸಿ',
      entriesTitle: 'ವಿಂಗಡಣೆ ಪಟ್ಟಿ',
    },
    batches: {
      heading: 'ಗೊಬ್ಬರ ಗುಂಡಿಗಳ ನಿರ್ವಹಣೆ',
      subheading: 'ಪ್ರತಿ ಬ್ಯಾಚ್‌ನ ಪದರ, ತೇವಾಂಶ, ತಿರುವು ಮತ್ತು ಪಕ್ವತೆ ಪರಿಶೀಲನೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
      createBatch: 'ಹೊಸ ಬ್ಯಾಚ್ ರಚಿಸಿ',
      batchName: 'ಬ್ಯಾಚ್ ಹೆಸರು',
      totalInput: 'ಒಟ್ಟು ಒಳಹರಿವು ತೂಕ',
      currentStage: 'ಪ್ರಸ್ತುತ ಹಂತ',
      moistureStatus: 'ತೇವಾಂಶದ ಸ್ಥಿತಿ',
      lastWatered: 'ಕೊನೆಯ ನೀರು ಹಾಕಿದ ದಿನ',
      lastTurned: 'ಕೊನೆಯ ತಿರುವು ನೀಡಿದ ದಿನ',
      addMaterial: 'ತ್ಯಾಜ್ಯ ಸೇರಿಸಿ',
      logWatering: 'ನೀರು ಹಾಕಿದ ದಾಖಲೆ',
      logTurning: 'ತಿರುವು ನೀಡಿದ ದಾಖಲೆ',
      advanceStage: 'ಮುಂದಿನ ಹಂತಕ್ಕೆ',
      assessMaturity: 'ಪಕ್ವತೆ ಪರಿಶೀಲಿಸಿ',
      maturityRequiredNotice:
        'ಪಕ್ವತೆ ಪರಿಶೀಲನೆ ಮತ್ತು ರೈತರ ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಂಡ ನಂತರವೇ ಬ್ಯಾಚ್ ಅನ್ನು ಬಳಕೆಗೆ ಸಿದ್ಧ ಎಂದು ಗುರುತಿಸಬಹುದು.',
      readyConfirmed: 'ಪಕ್ವತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    },
    guide: {
      heading: 'ಚಿತ್ರ ಆಧಾರಿತ ಕಾಂಪೋಸ್ಟ್ ಪ್ರಕ್ರಿಯೆ ಕಾರ್ಡ್',
      subheading: 'ಬನ್ನಿಕುಪ್ಪೆ ರೈತರಿಗಾಗಿ ಐದು ಹಂತಗಳ ಸರಳ ಮಾರ್ಗದರ್ಶಿ',
      previous: 'ಹಿಂದಿನ ಹಂತ',
      next: 'ಮುಂದಿನ ಹಂತ',
      stepLabel: 'ಹಂತ',
      advisoryDisclaimer:
        'ಸೂಚನೆ: ಈ ಮಾರ್ಗದರ್ಶಿಯು ದೈನಂದಿನ ಕೇಂದ್ರದ ಕೆಲಸಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ; ಇದು ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    },
    records: {
      heading: 'ಕಾಂಪೋಸ್ಟ್ ದಾಖಲೆ ಪುಸ್ತಕ',
      subheading: 'ಬ್ಯಾಚ್ ಸಾಮಗ್ರಿ, ನೀರು, ತಿರುವು ಮತ್ತು ತೇವಾಂಶದ ದೈನಂದಿನ ಡಿಜಿಟಲ್ ದಾಖಲೆ',
      addRecord: 'ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ',
      materialAdded: 'ಸೇರಿಸಿದ ಸಾಮಗ್ರಿ',
      quantityKg: 'ಪ್ರಮಾಣ (ಕೆ.ಜಿ)',
      watering: 'ನೀರು ಹಾಕಲಾಗಿದೆ',
      turning: 'ತಿರುವು ನೀಡಲಾಗಿದೆ',
      moistureObs: 'ತೇವಾಂಶ ಪರಿಶೀಲನೆ',
      otherObs: 'ಇತರ ಟಿಪ್ಪಣಿಗಳು',
      fromDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
      toDate: 'ಅಂತಿಮ ದಿನಾಂಕ',
      clearFilters: 'ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ',
    },
    maturity: {
      heading: 'ಗೊಬ್ಬರ ಪಕ್ವತೆ ಪರಿಶೀಲನೆ',
      subheading: 'ಜಮೀನಿಗೆ ಬಳಸುವ ಮೊದಲು ಗೊಬ್ಬರದ ಬಣ್ಣ, ವಾಸನೆ ಮತ್ತು ರಚನೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
      newAssessment: 'ಪಕ್ವತೆ ವೀಕ್ಷಣೆ ದಾಖಲಿಸಿ',
      appearance: 'ಬಣ್ಣ ಮತ್ತು ನೋಟ',
      smell: 'ವಾಸನೆ',
      texture: 'ರಚನೆ (ಸ್ಪರ್ಶ)',
      undecomposed: 'ಕೊಳೆಯದ ಕಣಗಳು ಕಾಣಿಸುತ್ತಿವೆಯೇ',
      moistureCond: 'ತೇವಾಂಶದ ಸ್ಥಿತಿ',
      growerComments: 'ರೈತರ ಟಿಪ್ಪಣಿ',
      assessmentStatus: 'ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ',
      confirmCheckbox:
        'ನಾನು ಈ ಬ್ಯಾಚ್ ಅನ್ನು ಸ್ವತಃ ಪರಿಶೀಲಿಸಿದ್ದೇನೆ ಮತ್ತು ಕೃಷಿ ಬಳಕೆಗೆ ಯೋಗ್ಯವಾಗಿದೆ ಎಂದು ದೃಢೀಕರಿಸುತ್ತೇನೆ.',
      outputWeightLabel: 'ಸಿದ್ಧವಾದ ಗೊಬ್ಬರದ ಪ್ರಮಾಣ (ಕೆ.ಜಿ)',
      markBatchReady: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಸಿದ್ಧ ಎಂದು ಗುರುತಿಸಿ',
      guidanceNote:
        'ಗೊಬ್ಬರದ ಪಕ್ವತೆಯನ್ನು ಕೇವಲ ದಿನಗಳ ಆಧಾರದ ಮೇಲೆ ನಿರ್ಧರಿಸಬಾರದು; ರೈತರ ನೇರ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯ.',
      reviewListTitle: 'ದಾಖಲಾದ ಪಕ್ವತೆ ಪರಿಶೀಲನೆಗಳು',
    },
    analytics: {
      heading: 'ವರದಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣೆ',
      subheading: 'ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ, ವಿಂಗಡಣೆ, ಬ್ಯಾಚ್ ಪ್ರಗತಿ ಮತ್ತು CSV ವರದಿ',
      exportSummary: 'ಸಾರಾಂಶ ವರದಿ ಡೌನ್‌ಲೋಡ್ (CSV)',
      monthlyCollectionTitle: 'ತಿಂಗಳ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ (ಸಾವಯವ ಮತ್ತು ಕೊಳೆಯದ)',
      materialBreakdownTitle: 'ವಿಂಗಡಿಸಿದ ಸಾಮಗ್ರಿಗಳ ವಿವರ (ಕೆ.ಜಿ)',
      batchOutputTitle: 'ಬ್ಯಾಚ್ ಒಳಹರಿವು ಮತ್ತು ಗೊಬ್ಬರ ಉತ್ಪಾದನೆ (ಕೆ.ಜಿ)',
    },
    settings: {
      heading: 'ಕೇಂದ್ರದ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಮಾಹಿತಿ',
      subheading: 'ಕೇಂದ್ರದ ವಿವರಗಳು, ಭಾಷೆ ಮತ್ತು ಡೆಮೋ ಮಾಹಿತಿಯನ್ನು ನಿರ್ವಹಿಸಿ',
      profileSection: 'ಕೇಂದ್ರದ ವಿವರ',
      stationName: 'ಕೇಂದ್ರದ ಹೆಸರು',
      farmerName: 'ಪ್ರಮುಖ ರೈತರು / ನಿರ್ವಾಹಕರು',
      village: 'ಗ್ರಾಮ ಮತ್ತು ಜಿಲ್ಲೆ',
      languageSection: 'ಭಾಷೆಯ ಆಯ್ಕೆ',
      dataSection: 'ಡೆಮೋ ಮತ್ತು ಸ್ಥಳೀಯ ಮಾಹಿತಿ ನಿಯಂತ್ರಣ',
      resetDemoBtn: 'ಡೆಮೋ ಮಾಹಿತಿ ಮರುಹೊಂದಿಸಿ',
      clearAllBtn: 'ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಅಳಿಸಿ',
      exportBackupBtn: 'JSON ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್',
    },
  },
};

export const STAGE_LABELS: Record<CompostStage, { en: string; kn: string }> = {
  Collection: { en: '1. Collection', kn: '1. ಸಂಗ್ರಹಣೆ' },
  Sorting: { en: '2. Sorting', kn: '2. ವಿಂಗಡಣೆ' },
  Layering: { en: '3. Layering', kn: '3. ಪದರ ಜೋಡಣೆ' },
  'Moisture and aeration maintenance': {
    en: '4. Moisture & Aeration',
    kn: '4. ತೇವಾಂಶ ಮತ್ತು ಗಾಳಿ ನಿರ್ವಹಣೆ',
  },
  'Maturity assessment': { en: '5. Maturity Assessment', kn: '5. ಪಕ್ವತೆ ಪರಿಶೀಲನೆ' },
  'Ready for use': { en: '6. Ready for Use', kn: '6. ಬಳಕೆಗೆ ಸಿದ್ಧ' },
};

export const MOISTURE_LABELS: Record<MoistureObservation, { en: string; kn: string }> = {
  Dry: { en: 'Dry', kn: 'ಒಣಗಿದೆ' },
  'Optimal (Damp Sponge)': { en: 'Optimal (Damp Sponge)', kn: 'ಸರಿಯಾದ ತೇವಾಂಶ' },
  'Too Wet': { en: 'Too Wet', kn: 'ಅತಿ ತೇವ' },
  'Not Checked': { en: 'Not Checked', kn: 'ಪರಿಶೀಲಿಸಿಲ್ಲ' },
};

export const MATURITY_STATUS_LABELS: Record<MaturityStatus, { en: string; kn: string }> = {
  'Under observation': { en: 'Under observation', kn: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ' },
  'Needs further processing': { en: 'Needs further processing', kn: 'ಹೆಚ್ಚಿನ ಪ್ರಕ್ರಿಯೆ ಅಗತ್ಯವಿದೆ' },
  'Ready for grower review': { en: 'Ready for grower review', kn: 'ರೈತರ ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧ' },
};

export const MATERIAL_LABELS: Record<string, { en: string; kn: string }> = {
  'Dry leaves': { en: 'Dry leaves', kn: 'ಒಣ ಎಲೆಗಳು' },
  'Vegetable waste': { en: 'Vegetable waste', kn: 'ತರಕಾರಿ ತ್ಯಾಜ್ಯ' },
  'Fruit peels': { en: 'Fruit peels', kn: 'ಹಣ್ಣಿನ ಸಿಪ್ಪೆಗಳು' },
  'Crop residues': { en: 'Crop residues', kn: 'ಬೆಳೆ ಅವಶೇಷಗಳು' },
  'Other grower-approved organic materials': {
    en: 'Other grower-approved organic materials',
    kn: 'ಇತರ ಅನುಮೋದಿತ ಸಾವಯವ ವಸ್ತುಗಳು',
  },
  Plastic: { en: 'Plastic', kn: 'ಪ್ಲಾಸ್ಟಿಕ್' },
  Glass: { en: 'Glass', kn: 'ಗಾಜು' },
  Metal: { en: 'Metal', kn: 'ಲೋಹ' },
  'Other unwanted materials': {
    en: 'Other unwanted materials',
    kn: 'ಇತರ ಅನಗತ್ಯ ವಸ್ತುಗಳು',
  },
};

export const PROCESS_GUIDE_STEPS = [
  {
    step: 1,
    image: '/src/assets/images/step_one_collect_1795447478699.jpg',
    titleEn: 'Collect Organic Material',
    titleKn: 'ಸಾವಯವ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಿಸಿ',
    summaryEn: 'Gather clean, farm-generated plant residues and kitchen greens in woven baskets.',
    summaryKn: 'ಹೊಲದ ಬೆಳೆ ಅವಶೇಷಗಳು, ಒಣ ಎಲೆಗಳು ಮತ್ತು ತರಕಾರಿ ತ್ಯಾಜ್ಯವನ್ನು ಬುಟ್ಟಿಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.',
    bulletsEn: [
      'Collect dry leaves, crop stalks, vegetable trimmings, and fruit peels.',
      'Keep farm waste off damp mud paths so soil and stones stay minimal.',
      'Weigh or estimate basket loads before bringing them to the sorting point.',
    ],
    bulletsKn: [
      'ಒಣ ಎಲೆಗಳು, ಬೆಳೆ ಕಡ್ಡಿಗಳು, ತರಕಾರಿ ತುಂಡುಗಳು ಮತ್ತು ಹಣ್ಣಿನ ಸಿಪ್ಪೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ.',
      'ಮಣ್ಣು ಮತ್ತು ಕಲ್ಲು ಸೇರದಂತೆ ಸ್ವಚ್ಛ ಸ್ಥಳದಲ್ಲಿ ತ್ಯಾಜ್ಯವನ್ನು ಇರಿಸಿ.',
      'ವಿಂಗಡಣೆ ಕೇಂದ್ರಕ್ಕೆ ತರುವ ಮೊದಲು ತೂಕವನ್ನು ದಾಖಲಿಸಿ.',
    ],
  },
  {
    step: 2,
    image: '/src/assets/images/step_two_separate_1795447477869.jpg',
    titleEn: 'Separate Unwanted Items',
    titleKn: 'ಅನಗತ್ಯ ವಸ್ತುಗಳನ್ನು ಬೇರ್ಪಡಿಸಿ',
    summaryEn: 'Sort biodegradable farm waste from plastics, glass, and metal before bay loading.',
    summaryKn: 'ಪ್ಲಾಸ್ಟಿಕ್, ಗಾಜು ಮತ್ತು ಲೋಹದ ವಸ್ತುಗಳನ್ನು ಸಾವಯವ ತ್ಯಾಜ್ಯದಿಂದ ಸಂಪೂರ್ಣವಾಗಿ ಬೇರ್ಪಡಿಸಿ.',
    bulletsEn: [
      'Place biodegradable greens and dry browns into the Green Compostable bin.',
      'Remove plastic twine, carry bags, glass shards, and metal wires into the Reject bin.',
      'Set aside any coated packaging or uncertain items for farmer review.',
    ],
    bulletsKn: [
      'ಕೊಳೆಯುವ ಹಸಿರು ಮತ್ತು ಒಣ ತ್ಯಾಜ್ಯವನ್ನು ಹಸಿರು ಬುಟ್ಟಿಗೆ ಹಾಕಿ.',
      'ಪ್ಲಾಸ್ಟಿಕ್ ದಾರ, ಚೀಲ, ಗಾಜು ಮತ್ತು ಲೋಹವನ್ನು ಕೊಳೆಯದ ಬುಟ್ಟಿಗೆ ಬೇರ್ಪಡಿಸಿ.',
      'ಅನುಮಾನಾಸ್ಪದ ವಸ್ತುಗಳನ್ನು ಪರಿಶೀಲನೆಗಾಗಿ ಪ್ರತ್ಯೇಕವಾಗಿ ಇಡಿ.',
    ],
  },
  {
    step: 3,
    image: '/src/assets/images/step_three_layer_1795447479753.jpg',
    titleEn: 'Layer and Moisten',
    titleKn: 'ಪದರಗಳಾಗಿ ಜೋಡಿಸಿ ಮತ್ತು ನೀರು ಚಿಮುಕಿಸಿ',
    summaryEn: 'Alternate brown dry leaves and green organic waste inside the bay, sprinkling water.',
    summaryKn: 'ಕಾಂಪೋಸ್ಟ್ ಗುಂಡಿಯಲ್ಲಿ ಒಣ ಎಲೆಗಳು ಮತ್ತು ಹಸಿರು ತ್ಯಾಜ್ಯವನ್ನು ಪದರಗಳಾಗಿ ಜೋಡಿಸಿ ಸ್ವಲ್ಪ ನೀರು ಚಿಮುಕಿಸಿ.',
    bulletsEn: [
      'Start with a coarse base layer of dry twigs or stalks for bottom airflow.',
      'Alternate layers of dry brown leaves and fresh green vegetable or crop waste.',
      'Sprinkle water evenly between layers so materials feel like a damp wrung sponge.',
    ],
    bulletsKn: [
      'ಕೆಳಭಾಗದಲ್ಲಿ ಗಾಳಿಯಾಡಲು ಒಣ ಕಡ್ಡಿಗಳ ಪದರ ಹಾಕಿ.',
      'ಒಣ ಎಲೆಗಳು ಮತ್ತು ಹಸಿರು ತ್ಯಾಜ್ಯವನ್ನು ಒಂದರ ಮೇಲೊಂದು ಪದರವಾಗಿ ಹಾಕಿ.',
      'ಪ್ರತಿ ಪದರದ ಮೇಲೆ ಹದವಾಗಿ ನೀರು ಚಿಮುಕಿಸಿ (ಹಿಂಡಿದ ಸ್ಪಂಜಿನಂತೆ ತೇವವಿರಲಿ).',
    ],
  },
  {
    step: 4,
    image: '/src/assets/images/step_four_maintain_1795447478632.jpg',
    titleEn: 'Maintain Air and Moisture',
    titleKn: 'ಗಾಳಿ ಮತ್ತು ತೇವಾಂಶ ಕಾಪಾಡಿ',
    summaryEn: 'Turn the pile regularly to supply oxygen and check moisture by hand.',
    summaryKn: 'ಗಾಳಿ ಆಡಲು ನಿಯಮಿತವಾಗಿ ಗುಂಡಿಯನ್ನು ತಿರುವಿ ಹಾಕಿ ಮತ್ತು ಕೈಯಿಂದ ತೇವಾಂಶ ಪರೀಕ್ಷಿಸಿ.',
    bulletsEn: [
      'Turn the compost heap with a pitchfork or spade to prevent bad odors and compacting.',
      'Squeeze a handful: if dry and dusty, sprinkle water; if dripping, mix in dry leaves.',
      'Log every watering and turning action in the Compost Record Sheet.',
    ],
    bulletsKn: [
      'ದುರ್ವಾಸನೆ ತಪ್ಪಿಸಲು ಮತ್ತು ಗಾಳಿ ಆಡಲು ಗುದ್ದಲಿ ಅಥವಾ ಪಿಚ್‌ಫೋರ್ಕ್‌ನಿಂದ ತಿರುವಿ ಹಾಕಿ.',
      'ಕೈಯಲ್ಲಿ ಹಿಂಡಿ ನೋಡಿ: ಒಣಗಿದ್ದರೆ ನೀರು ಚಿಮುಕಿಸಿ; ನೀರು ಸೋರಿದರೆ ಒಣ ಎಲೆ ಸೇರಿಸಿ.',
      'ಪ್ರತಿ ನೀರು ಮತ್ತು ತಿರುವು ಕೆಲಸವನ್ನು ದಾಖಲೆ ಪುಸ್ತಕದಲ್ಲಿ ಬರೆಯಿರಿ.',
    ],
  },
  {
    step: 5,
    image: '/src/assets/images/step_five_maturity_1795447478881.jpg',
    titleEn: 'Check Maturity Before Use',
    titleKn: 'ಬಳಸುವ ಮೊದಲು ಪಕ್ವತೆ ಪರಿಶೀಲಿಸಿ',
    summaryEn: 'Inspect color, earthy smell, and crumbly texture before applying to farmland.',
    summaryKn: 'ಹೊಲಕ್ಕೆ ಹಾಕುವ ಮೊದಲು ಗೊಬ್ಬರದ ಕಪ್ಪು-ಕಂದು ಬಣ್ಣ, ಮಣ್ಣಿನ ವಾಸನೆ ಮತ್ತು ಪುಡಿ ರಚನೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ.',
    bulletsEn: [
      'Check that material looks dark brown/black, crumbly, and uniform with no recognizable scraps.',
      'Verify an earthy soil-like smell with no sour or ammonia odor.',
      'Record observations in Maturity Assessment and confirm readiness before field use.',
    ],
    bulletsKn: [
      'ಗೊಬ್ಬರವು ಗಾಢ ಕಂದು-ಕಪ್ಪು ಬಣ್ಣದಲ್ಲಿದ್ದು, ಒರಟು ತುಂಡುಗಳಿಲ್ಲದೆ ಪುಡಿಯಾಗಿರಬೇಕು.',
      'ದುರ್ವಾಸನೆಯಿಲ್ಲದೆ ಶುದ್ಧ ಮಣ್ಣಿನ ಸುವಾಸನೆ ಇರಬೇಕು.',
      'ಪಕ್ವತೆ ಪರಿಶೀಲನೆ ಪುಟದಲ್ಲಿ ವೀಕ್ಷಣೆ ದಾಖಲಿಸಿ ದೃಢೀಕರಿಸಿದ ನಂತರವೇ ಬಳಸಿ.',
    ],
  },
];
