// ============================================================================
// KWinHub V1 — Canonical Domain Models
// Protocol → Input → Data → Processing → Metrics → Visualization → Report
// ============================================================================

export type Lang = 'en' | 'cn';

// --- Status ---------------------------------------------------------------
export type Status = 'normal' | 'warning' | 'attention' | 'invalid' | 'offline' | 'processing' | 'syncing' | 'pending';

// --- Subject --------------------------------------------------------------
export type SubjectType = 'ATHLETE' | 'PATIENT' | 'PARTICIPANT' | 'RESEARCH_SUBJECT' | 'OTHER';

export type SportCategory = 'Jumping' | 'Sprinting' | 'Strength' | 'Aquatic' | 'Endurance' | 'Agility';

export interface Sport {
  id: string;
  name: string;
  nameCn: string;
  icon: string;
  category: SportCategory;
  metrics: string[];
}

export interface Organization {
  id: string;
  name: string;
  nameCn: string;
  country: string;
  timezone: string;
}

export interface Team {
  id: string;
  name: string;
  nameCn: string;
  sportId: string;
  season: string;
  athleteCount: number;
}

export interface Group {
  id: string;
  name: string;
  nameCn: string;
  type: string;
  description: string;
  athleteCount: number;
}

// Athlete remains the UI-facing term; the domain model supports Subject.
export interface Athlete {
  id: string;
  subjectType: SubjectType;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  sportId: string;
  position: string;
  teamId: string;
  groupIds: string[];
  status: Status;
  lastTestDate: string | null;
  lastTestProtocol: string | null;
  photoUrl: string | null;
  height: number;
  weight: number;
  baseline: Record<string, number>;
  personalBest: Record<string, number>;
  tags: string[];
}

// --- Data Source ----------------------------------------------------------
export type DataSourceCategory = 'APPLICATION' | 'DEVICE' | 'INTEGRATION' | 'IMPORT';

export interface DataSource {
  id: string;
  name: string;
  nameCn: string;
  category: DataSourceCategory;
  vendor: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  description: string;
  descriptionCn: string;
  protocolsSupported: string[];
  dataTypes: string[];
}

// --- Device (specific data source subtype) --------------------------------
export interface Device {
  id: string;
  serialNumber: string;
  type: string;
  status: Status;
  firmware: string;
  battery: number;
  lastSync: string;
  location: string;
  protocolSupport: string[];
  dataSourceId: string;
}

// --- Protocol -------------------------------------------------------------
export type CaptureMode = 'force_plate' | 'timing' | 'video' | 'manual' | 'sensor';

export type InputDataType = 'force' | 'timing' | 'position' | 'video' | 'pose' | 'events' | 'manual' | 'emg' | 'imu';

export interface ProtocolInputSchema {
  dataTypes: InputDataType[];
  captureMode: CaptureMode;
  trials: number;
  trialIntervalSec: number;
}

export interface ProtocolProcessingDef {
  steps: string[];
  eventDetection: string[];
  formulaRefs: string[];
  processingVersion: string;
}

export interface ProtocolVisualizationDef {
  type: 'force_time_curve' | 'split_chart' | 'velocity_chart' | 'attempt_sequence' | 'bar_progression' | 'metric_cards' | 'trend' | 'trial_comparison';
  title: string;
  titleCn: string;
  config: Record<string, string>;
}

export interface ProtocolComparisonDef {
  type: 'baseline' | 'personal_best' | 'team_average' | 'normative';
  label: string;
  labelCn: string;
}

export interface TestProtocol {
  id: string;
  key: string;
  name: string;
  nameCn: string;
  version: string;
  sportId: string;
  deviceType: string;
  category: string;
  input: ProtocolInputSchema;
  processing: ProtocolProcessingDef;
  metrics: ProtocolMetric[];
  validityRules: string[];
  validityRulesCn: string[];
  visualization: ProtocolVisualizationDef[];
  comparison: ProtocolComparisonDef[];
  description: string;
  descriptionCn: string;
  durationMin: number;
  difficulty: 'basic' | 'standard' | 'advanced';
}

export interface ProtocolMetric {
  key: string;
  name: string;
  nameCn: string;
  unit: string;
  primary: boolean;
  description?: string;
  descriptionCn?: string;
  threshold?: { warning: number; attention: number };
  higherIsBetter: boolean;
}

// --- Measurement & Data ---------------------------------------------------
export type DataQualityStatus = 'complete' | 'warning' | 'invalid' | 'processing_error';

export interface DataQuality {
  status: DataQualityStatus;
  issues: string[];
  validationPassed: boolean;
}

export interface RawMeasurement {
  id: string;
  sessionId: string;
  trialNumber: number;
  dataType: InputDataType;
  sourceDeviceId: string;
  canonical: boolean;
  payload: Record<string, number[]>;
  sampleRateHz: number;
  durationMs: number;
}

export interface ProcessedMeasurement {
  id: string;
  sessionId: string;
  trialNumber: number;
  fromRawId: string;
  processingVersion: string;
  events: { name: string; timeMs: number; value?: number }[];
  segments: { name: string; startMs: number; endMs: number }[];
}

export interface Dataset {
  id: string;
  name: string;
  nameCn: string;
  type: 'session' | 'longitudinal' | 'research' | 'import' | 'device_stream';
  subjectIds: string[];
  protocolIds: string[];
  sourceId: string;
  measurementCount: number;
  createdAt: string;
  status: 'active' | 'archived' | 'processing';
}

// --- Trial & Session ------------------------------------------------------
export interface Trial {
  number: number;
  status: 'valid' | 'invalid';
  reason?: string;
  values: Record<string, number>;
  forceTimeData?: number[];
  rawMeasurementId?: string;
  processedMeasurementId?: string;
}

export type SessionStatus =
  | 'LOCAL' | 'QUEUED' | 'UPLOADING' | 'RECEIVED' | 'VALIDATING'
  | 'PROCESSING' | 'ANALYZED' | 'PUBLISHED'
  | 'UPLOAD_FAILED' | 'VALIDATION_FAILED' | 'PROCESSING_FAILED';

export interface TestSession {
  id: string;
  athleteId: string;
  protocolId: string;
  protocolName: string;
  sportId: string;
  date: string;
  deviceSerial: string;
  operatorName: string;
  status: Status;
  sessionStatus: SessionStatus;
  trials: Trial[];
  summary: Record<string, number>;
  qualityFlag: 'valid' | 'questionable' | 'invalid';
  dataQuality: DataQuality;
  processingVersion: string;
  source: 'device' | 'import' | 'api';
  sourceId: string;
  dataSourceId: string;
  idempotencyKey: string;
  startedAt: string;
  completedAt: string | null;
  statusUrl: string;
}

// --- Generic Result -------------------------------------------------------
export interface ResultMetric {
  key: string;
  name: string;
  nameCn: string;
  unit: string;
  value: number;
  primary: boolean;
  threshold?: { warning: number; attention: number };
  higherIsBetter: boolean;
  comparison?: {
    baseline?: number;
    personalBest?: number;
    teamAverage?: number;
    deltaFromBaseline?: number;
    deltaFromBest?: number;
  };
}

export interface ResultVisualization {
  type: ProtocolVisualizationDef['type'];
  title: string;
  titleCn: string;
  data: Record<string, unknown>;
}

export interface Result {
  sessionId: string;
  protocolId: string;
  subjectId: string;
  primaryMetric: ResultMetric;
  metrics: ResultMetric[];
  visualizations: ResultVisualization[];
  trialResults: { number: number; status: 'valid' | 'invalid'; values: Record<string, number> }[];
  analysisNotes: string[];
  rawDataRef: { measurementIds: string[]; datasetId: string | null };
}

// --- Sync & API -----------------------------------------------------------
export interface SyncJob {
  id: string;
  sessionStatus: SessionStatus;
  sourceId: string;
  sourceName: string;
  subjectId: string;
  protocolId: string;
  idempotencyKey: string;
  startedAt: string;
  updatedAt: string;
  retryAfter: number;
  statusUrl: string;
  recordsProcessed: number;
  recordsTotal: number;
  errorMessage: string | null;
  webhookUrl: string | null;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  source: string;
  direction: 'inbound' | 'outbound';
  records: number;
  status: 'success' | 'failed' | 'partial';
  message: string;
}

export interface Heartbeat {
  deviceId: string;
  appVersion: string;
  online: boolean;
  lastSyncAt: string;
  queuedSessions: number;
  storageAvailable: number;
  battery?: number;
}

// --- Dashboard ------------------------------------------------------------
export interface DashboardWidget {
  id: string;
  type: 'metric-card' | 'trend-chart' | 'athlete-table' | 'distribution' | 'threshold' | 'asymmetry' | 'ranking' | 'sync-status' | 'attention-list' | 'activity-feed';
  title: string;
  titleCn: string;
  metric?: string;
  protocolId?: string;
  dataSourceId?: string;
  config: Record<string, string>;
}

// --- Reports --------------------------------------------------------------
export type ReportType = 'performance' | 'biomechanics' | 'functional' | 'research' | 'rehabilitation' | 'test' | 'device';

export interface ReportDefinition {
  id: string;
  type: ReportType;
  name: string;
  nameCn: string;
  scope: 'subject' | 'team' | 'organization';
  subjectIds: string[];
  teamIds: string[];
  protocolIds: string[];
  metricKeys: string[];
  timeRange: { from: string; to: string };
  visualizations: string[];
  status: 'draft' | 'generated' | 'scheduled' | 'archived';
  createdAt: string;
  createdBy: string;
  observations: string[];
}

// --- User & Integration ---------------------------------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleCn: string;
  status: 'active' | 'inactive';
  teamAccess: string[];
  lastActive: string;
}

export interface Integration {
  id: string;
  name: string;
  nameCn: string;
  category: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  description: string;
}

export interface ImportJob {
  id: string;
  fileName: string;
  source: 'csv' | 'excel' | 'api' | 'garmin' | 'whoop' | 'hawkin';
  status: 'pending' | 'mapping' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  matchedColumns: number;
  unmatchedColumns: number;
  createdAt: string;
  sportId: string;
  dataSourceId: string;
}

// --- Timeline -------------------------------------------------------------
export interface TimelineEvent {
  id: string;
  date: string;
  type: 'testing' | 'training' | 'note';
  title: string;
  sportId?: string;
  metrics?: { name: string; value: number; unit: string }[];
  sessionId?: string;
}

// --- Metric Definition (catalog) ------------------------------------------
export interface MetricDefinition {
  key: string;
  name: string;
  nameCn: string;
  unit: string;
  primary: boolean;
  description: string;
  higherIsBetter: boolean;
}
