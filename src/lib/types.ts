export type Status = 'normal' | 'warning' | 'attention' | 'invalid' | 'offline' | 'processing' | 'syncing' | 'pending';

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

export interface Athlete {
  id: string;
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
}

export interface TestProtocol {
  id: string;
  name: string;
  nameCn: string;
  sportId: string;
  deviceType: string;
  trials: number;
  metrics: ProtocolMetric[];
  validityRules: string[];
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
  threshold?: { warning: number; attention: number };
}

export interface Trial {
  number: number;
  status: 'valid' | 'invalid';
  reason?: string;
  values: Record<string, number>;
  forceTimeData?: number[];
}

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
  trials: Trial[];
  summary: Record<string, number>;
  qualityFlag: 'valid' | 'questionable' | 'invalid';
  processingVersion: string;
  source: 'device' | 'import' | 'api';
}

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

export interface MetricDefinition {
  key: string;
  name: string;
  nameCn: string;
  unit: string;
  primary: boolean;
  description: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'testing' | 'training' | 'note';
  title: string;
  sportId?: string;
  metrics?: { name: string; value: number; unit: string }[];
  sessionId?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'metric-card' | 'trend-chart' | 'athlete-table' | 'distribution' | 'threshold' | 'asymmetry' | 'ranking' | 'sync-status';
  title: string;
  titleCn: string;
  metric?: string;
  config: Record<string, string>;
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

export interface SyncLog {
  id: string;
  timestamp: string;
  source: string;
  direction: 'inbound' | 'outbound';
  records: number;
  status: 'success' | 'failed' | 'partial';
  message: string;
}

export type Lang = 'en' | 'cn';
