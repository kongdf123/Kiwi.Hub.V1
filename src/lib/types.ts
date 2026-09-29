export type Status = 'normal' | 'warning' | 'attention' | 'invalid' | 'offline' | 'processing' | 'syncing';

export type Laterality = 'bilateral' | 'left' | 'right';

export type TestType = 'CMJ' | 'SJ' | 'IMTP' | 'Drop Jump' | 'Balance' | 'Sprint';

export interface Organization {
  id: string;
  name: string;
  country: string;
  timezone: string;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  season: string;
  athleteCount: number;
}

export interface Group {
  id: string;
  name: string;
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
  sport: string;
  position: string;
  teamId: string;
  groupIds: string[];
  status: Status;
  lastTestDate: string | null;
  lastTestType: TestType | null;
  photoUrl: string | null;
  height: number;
  weight: number;
  baseline: Record<string, number>;
  personalBest: Record<string, number>;
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
}

export interface TestProtocol {
  id: string;
  name: string;
  testType: TestType;
  deviceType: string;
  trials: number;
  metrics: string[];
  validityRules: string[];
  description: string;
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
  protocolName: string;
  testType: TestType;
  date: string;
  deviceSerial: string;
  operatorName: string;
  status: Status;
  trials: Trial[];
  summary: Record<string, number>;
  qualityFlag: 'valid' | 'questionable' | 'invalid';
  processingVersion: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  teamAccess: string[];
  lastActive: string;
}

export interface MetricDefinition {
  key: string;
  name: string;
  unit: string;
  testType: TestType;
  primary: boolean;
  description: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'testing' | 'training' | 'note';
  title: string;
  testType?: TestType;
  metrics?: { name: string; value: number; unit: string }[];
  sessionId?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'metric-card' | 'trend-chart' | 'athlete-table' | 'distribution' | 'threshold' | 'asymmetry' | 'ranking';
  title: string;
  metric?: string;
  config: Record<string, string>;
}
