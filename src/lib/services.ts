// ============================================================================
// KWinHub Service Layer — Mock Repository Pattern
// UI → Service → Mock Repository (later: API Client → KWinHub Backend)
// Simulates async API semantics: 202 Accepted, statusUrl, Idempotency-Key
// ============================================================================

import {
  DEMO_ATHLETES, DEMO_PROTOCOLS, DEMO_SESSIONS, DEMO_DEVICES, DEMO_DATA_SOURCES,
  DEMO_DATASETS, DEMO_RAW_MEASUREMENTS, DEMO_PROCESSED_MEASUREMENTS,
  DEMO_SYNC_JOBS, DEMO_SYNC_LOGS, DEMO_HEARTBEATS, DEMO_RESULTS,
  DEMO_REPORTS, DEMO_DASHBOARD_WIDGETS, DEMO_TEAMS, DEMO_SPORTS,
  DEMO_IMPORTS, DEMO_INTEGRATIONS, DEMO_USERS, DEMO_GROUPS, DEMO_ORG,
  getSessionsForAthlete, getTimelineForAthlete, getSport, getProtocol, getAthlete, getTeam,
  getResultForSession, getDataSource,
} from './demo-data';
import { getMetric } from './metrics';
import type {
  Athlete, TestProtocol, TestSession, Device, DataSource, Dataset,
  RawMeasurement, ProcessedMeasurement, SyncJob, SyncLog, Heartbeat,
  Result, ReportDefinition, DashboardWidget, Team, Sport, ImportJob,
  Integration, User, Group, Organization, TimelineEvent, SessionStatus,
} from './types';

// --- Async helper (simulates network latency) -----------------------------
function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// --- Ingestion response (202 Accepted semantics) --------------------------
export interface IngestionResponse {
  sessionId: string;
  status: 'RECEIVED';
  statusUrl: string;
  retryAfter: number;
  idempotencyKey: string;
}

// ============================================================================
// Athlete / Subject Service
// ============================================================================
export const athleteService = {
  getAll(): Promise<Athlete[]> {
    return delay([...DEMO_ATHLETES]);
  },
  getById(id: string): Promise<Athlete | undefined> {
    return delay(getAthlete(id));
  },
  getByTeam(teamId: string): Promise<Athlete[]> {
    return delay(DEMO_ATHLETES.filter((a) => a.teamId === teamId));
  },
  getTimeline(athleteId: string): Promise<TimelineEvent[]> {
    return delay(getTimelineForAthlete(athleteId));
  },
  getSessions(athleteId: string): Promise<TestSession[]> {
    return delay(getSessionsForAthlete(athleteId));
  },
};

// ============================================================================
// Protocol Service
// ============================================================================
export const protocolService = {
  getAll(): Promise<TestProtocol[]> {
    return delay([...DEMO_PROTOCOLS]);
  },
  getById(id: string): Promise<TestProtocol | undefined> {
    return delay(getProtocol(id));
  },
  getBySport(sportId: string): Promise<TestProtocol[]> {
    return delay(DEMO_PROTOCOLS.filter((p) => p.sportId === sportId));
  },
};

// ============================================================================
// Test Session Service (with async ingestion semantics)
// ============================================================================
export const sessionService = {
  getAll(): Promise<TestSession[]> {
    return delay([...DEMO_SESSIONS]);
  },
  getById(id: string): Promise<TestSession | undefined> {
    return delay(DEMO_SESSIONS.find((s) => s.id === id));
  },
  getByAthlete(athleteId: string): Promise<TestSession[]> {
    return delay(getSessionsForAthlete(athleteId));
  },
  getByProtocol(protocolId: string): Promise<TestSession[]> {
    return delay(DEMO_SESSIONS.filter((s) => s.protocolId === protocolId));
  },
  getByTeam(teamId: string): Promise<TestSession[]> {
    const athleteIds = new Set(DEMO_ATHLETES.filter((a) => a.teamId === teamId).map((a) => a.id));
    return delay(DEMO_SESSIONS.filter((s) => athleteIds.has(s.athleteId)));
  },

  // Simulates POST /api/v1/test-sessions → 202 Accepted
  ingest(params: {
    subjectId: string;
    protocolId: string;
    sourceId: string;
    deviceId: string;
    idempotencyKey: string;
    startedAt: string;
    trials: number;
  }): Promise<IngestionResponse> {
    const sessionId = `ses-${Date.now()}`;
    const response: IngestionResponse = {
      sessionId,
      status: 'RECEIVED',
      statusUrl: `/api/v1/test-sessions/${sessionId}/status`,
      retryAfter: 2,
      idempotencyKey: params.idempotencyKey,
    };
    return delay(response, 300);
  },

  // Simulates GET /api/v1/test-sessions/{id}/status
  getStatus(sessionId: string): Promise<{ sessionId: string; sessionStatus: SessionStatus; retryAfter: number }> {
    const session = DEMO_SESSIONS.find((s) => s.id === sessionId);
    const job = DEMO_SYNC_JOBS.find((j) => j.statusUrl.includes(sessionId));
    const status = session?.sessionStatus ?? job?.sessionStatus ?? 'RECEIVED';
    return delay({ sessionId, sessionStatus: status, retryAfter: 2 }, 100);
  },
};

// ============================================================================
// Result Service (generic, protocol-driven)
// ============================================================================
export const resultService = {
  getBySession(sessionId: string): Promise<Result | undefined> {
    return delay(getResultForSession(sessionId));
  },
  getByAthlete(athleteId: string): Promise<Result[]> {
    const sessionIds = new Set(getSessionsForAthlete(athleteId).map((s) => s.id));
    return delay(DEMO_RESULTS.filter((r) => sessionIds.has(r.sessionId)));
  },
  getByProtocol(protocolId: string): Promise<Result[]> {
    return delay(DEMO_RESULTS.filter((r) => r.protocolId === protocolId));
  },
};

// ============================================================================
// Data Source Service
// ============================================================================
export const dataSourceService = {
  getAll(): Promise<DataSource[]> {
    return delay([...DEMO_DATA_SOURCES]);
  },
  getByCategory(category: DataSource['category']): Promise<DataSource[]> {
    return delay(DEMO_DATA_SOURCES.filter((s) => s.category === category));
  },
  getById(id: string): Promise<DataSource | undefined> {
    return delay(getDataSource(id));
  },
};

// ============================================================================
// Device Service
// ============================================================================
export const deviceService = {
  getAll(): Promise<Device[]> {
    return delay([...DEMO_DEVICES]);
  },
  getById(id: string): Promise<Device | undefined> {
    return delay(DEMO_DEVICES.find((d) => d.id === id));
  },
};

// ============================================================================
// Dataset Service
// ============================================================================
export const datasetService = {
  getAll(): Promise<Dataset[]> {
    return delay([...DEMO_DATASETS]);
  },
  getBySubject(subjectId: string): Promise<Dataset[]> {
    return delay(DEMO_DATASETS.filter((d) => d.subjectIds.includes(subjectId)));
  },
};

// ============================================================================
// Measurement Service (raw + processed)
// ============================================================================
export const measurementService = {
  getRawBySession(sessionId: string): Promise<RawMeasurement[]> {
    return delay(DEMO_RAW_MEASUREMENTS.filter((m) => m.sessionId === sessionId));
  },
  getProcessedBySession(sessionId: string): Promise<ProcessedMeasurement[]> {
    return delay(DEMO_PROCESSED_MEASUREMENTS.filter((m) => m.sessionId === sessionId));
  },
};

// ============================================================================
// Sync Service (async lifecycle, heartbeat, idempotency)
// ============================================================================
export const syncService = {
  getJobs(): Promise<SyncJob[]> {
    return delay([...DEMO_SYNC_JOBS]);
  },
  getJobById(id: string): Promise<SyncJob | undefined> {
    return delay(DEMO_SYNC_JOBS.find((j) => j.id === id));
  },
  getLogs(): Promise<SyncLog[]> {
    return delay([...DEMO_SYNC_LOGS]);
  },
  getHeartbeats(): Promise<Heartbeat[]> {
    return delay([...DEMO_HEARTBEATS]);
  },
};

// ============================================================================
// Report Service
// ============================================================================
export const reportService = {
  getAll(): Promise<ReportDefinition[]> {
    return delay([...DEMO_REPORTS]);
  },
  getById(id: string): Promise<ReportDefinition | undefined> {
    return delay(DEMO_REPORTS.find((r) => r.id === id));
  },
};

// ============================================================================
// Dashboard Service (widget model)
// ============================================================================
export const dashboardService = {
  getWidgets(): Promise<DashboardWidget[]> {
    return delay([...DEMO_DASHBOARD_WIDGETS]);
  },
};

// ============================================================================
// Team, Sport, Misc Services
// ============================================================================
export const teamService = {
  getAll(): Promise<Team[]> {
    return delay([...DEMO_TEAMS]);
  },
  getById(id: string): Promise<Team | undefined> {
    return delay(getTeam(id));
  },
};

export const sportService = {
  getAll(): Promise<Sport[]> {
    return delay([...DEMO_SPORTS]);
  },
  getById(id: string): Promise<Sport | undefined> {
    return delay(getSport(id));
  },
};

export const importService = {
  getAll(): Promise<ImportJob[]> {
    return delay([...DEMO_IMPORTS]);
  },
};

export const integrationService = {
  getAll(): Promise<Integration[]> {
    return delay([...DEMO_INTEGRATIONS]);
  },
};

export const userService = {
  getAll(): Promise<User[]> {
    return delay([...DEMO_USERS]);
  },
};

export const groupService = {
  getAll(): Promise<Group[]> {
    return delay([...DEMO_GROUPS]);
  },
};

export const orgService = {
  get(): Promise<Organization> {
    return delay(DEMO_ORG);
  },
};

// --- Metric helper (re-exported for convenience) --------------------------
export { getMetric };
