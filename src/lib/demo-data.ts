import type { Athlete, Device, Group, Organization, TestProtocol, TestSession, Team, TimelineEvent, User } from './types';

export const DEMO_ORG: Organization = {
  id: 'org-1',
  name: 'Kunwei Performance Center',
  country: 'China',
  timezone: 'Asia/Shanghai',
};

export const DEMO_TEAMS: Team[] = [
  { id: 'team-1', name: 'Senior Men\'s Team', sport: 'Football', season: '2026-2027', athleteCount: 32 },
  { id: 'team-2', name: 'U21 Team', sport: 'Football', season: '2026-2027', athleteCount: 24 },
  { id: 'team-3', name: 'Women\'s First Team', sport: 'Football', season: '2026-2027', athleteCount: 28 },
];

export const DEMO_GROUPS: Group[] = [
  { id: 'g-1', name: 'Goalkeepers', type: 'Position', description: 'Goalkeeper squad', athleteCount: 4 },
  { id: 'g-2', name: 'Attackers', type: 'Position', description: 'Forward players', athleteCount: 8 },
  { id: 'g-3', name: 'Return to Play', type: 'Medical', description: 'Athletes in return-to-play protocol', athleteCount: 3 },
  { id: 'g-4', name: 'Pre-season', type: 'Conditioning', description: 'Pre-season conditioning group', athleteCount: 12 },
];

export const DEMO_ATHLETES: Athlete[] = [
  {
    id: 'a-1', firstName: 'Zhang', lastName: 'Wei', dateOfBirth: '2001-03-15', sex: 'M',
    sport: 'Football', position: 'Forward', teamId: 'team-1', groupIds: ['g-2'],
    status: 'attention', lastTestDate: '2026-09-29', lastTestType: 'CMJ',
    photoUrl: null, height: 182, weight: 78,
    baseline: { jump_height: 49.8, peak_force: 2030, rsi_mod: 0.38, asymmetry: 5.1 },
    personalBest: { jump_height: 53.0, peak_force: 2180, rsi_mod: 0.44, asymmetry: 3.2 },
  },
  {
    id: 'a-2', firstName: 'Li', lastName: 'Ming', dateOfBirth: '2002-07-22', sex: 'M',
    sport: 'Football', position: 'Midfielder', teamId: 'team-1', groupIds: ['g-2'],
    status: 'warning', lastTestDate: '2026-09-29', lastTestType: 'IMTP',
    photoUrl: null, height: 178, weight: 72,
    baseline: { peak_force_imtp: 2850, rfd: 5600, relative_peak_force: 39.6 },
    personalBest: { peak_force_imtp: 3100, rfd: 6200, relative_peak_force: 43.1 },
  },
  {
    id: 'a-3', firstName: 'Wang', lastName: 'Hao', dateOfBirth: '2000-11-08', sex: 'M',
    sport: 'Football', position: 'Defender', teamId: 'team-1', groupIds: [],
    status: 'normal', lastTestDate: '2026-09-29', lastTestType: 'CMJ',
    photoUrl: null, height: 186, weight: 82,
    baseline: { jump_height: 45.2, peak_force: 1950, rsi_mod: 0.35, asymmetry: 6.8 },
    personalBest: { jump_height: 48.1, peak_force: 2100, rsi_mod: 0.39, asymmetry: 4.5 },
  },
  {
    id: 'a-4', firstName: 'Chen', lastName: 'Jie', dateOfBirth: '2003-01-30', sex: 'M',
    sport: 'Football', position: 'Forward', teamId: 'team-1', groupIds: ['g-2', 'g-3'],
    status: 'attention', lastTestDate: '2026-09-15', lastTestType: 'CMJ',
    photoUrl: null, height: 175, weight: 70,
    baseline: { jump_height: 47.0, peak_force: 1880, rsi_mod: 0.37, asymmetry: 8.2 },
    personalBest: { jump_height: 50.5, peak_force: 2020, rsi_mod: 0.41, asymmetry: 5.0 },
  },
  {
    id: 'a-5', firstName: 'Liu', lastName: 'Yang', dateOfBirth: '1999-05-14', sex: 'M',
    sport: 'Football', position: 'Goalkeeper', teamId: 'team-1', groupIds: ['g-1'],
    status: 'normal', lastTestDate: '2026-09-28', lastTestType: 'CMJ',
    photoUrl: null, height: 190, weight: 85,
    baseline: { jump_height: 44.5, peak_force: 2100, rsi_mod: 0.33, asymmetry: 7.0 },
    personalBest: { jump_height: 47.2, peak_force: 2250, rsi_mod: 0.36, asymmetry: 5.5 },
  },
  {
    id: 'a-6', firstName: 'Zhao', lastName: 'Rui', dateOfBirth: '2001-09-03', sex: 'M',
    sport: 'Football', position: 'Midfielder', teamId: 'team-1', groupIds: ['g-4'],
    status: 'normal', lastTestDate: '2026-09-28', lastTestType: 'CMJ',
    photoUrl: null, height: 180, weight: 75,
    baseline: { jump_height: 46.8, peak_force: 1980, rsi_mod: 0.36, asymmetry: 5.5 },
    personalBest: { jump_height: 49.5, peak_force: 2120, rsi_mod: 0.40, asymmetry: 4.0 },
  },
  {
    id: 'a-7', firstName: 'Sun', lastName: 'Jun', dateOfBirth: '2002-12-20', sex: 'M',
    sport: 'Football', position: 'Defender', teamId: 'team-1', groupIds: [],
    status: 'normal', lastTestDate: '2026-09-27', lastTestType: 'CMJ',
    photoUrl: null, height: 188, weight: 80,
    baseline: { jump_height: 43.0, peak_force: 2050, rsi_mod: 0.32, asymmetry: 6.0 },
    personalBest: { jump_height: 45.8, peak_force: 2200, rsi_mod: 0.35, asymmetry: 4.8 },
  },
  {
    id: 'a-8', firstName: 'Wu', lastName: 'Lei', dateOfBirth: '2000-06-18', sex: 'M',
    sport: 'Football', position: 'Forward', teamId: 'team-1', groupIds: ['g-2'],
    status: 'warning', lastTestDate: '2026-09-27', lastTestType: 'IMTP',
    photoUrl: null, height: 177, weight: 73,
    baseline: { peak_force_imtp: 2900, rfd: 5400, relative_peak_force: 39.7 },
    personalBest: { peak_force_imtp: 3050, rfd: 5900, relative_peak_force: 41.8 },
  },
];

export const DEMO_DEVICES: Device[] = [
  { id: 'd-1', serialNumber: 'KW-FP-00124', type: 'Force Plate', status: 'processing', firmware: '2.4.1', battery: 87, lastSync: '2026-09-29T09:42:00Z', location: 'Lab 1' },
  { id: 'd-2', serialNumber: 'KW-FP-00125', type: 'Force Plate', status: 'offline', firmware: '2.3.8', battery: 0, lastSync: '2026-09-28T14:20:00Z', location: 'Lab 2' },
  { id: 'd-3', serialNumber: 'KW-FP-00126', type: 'Force Plate', status: 'syncing', firmware: '2.4.1', battery: 62, lastSync: '2026-09-29T08:15:00Z', location: 'Field Station' },
  { id: 'd-4', serialNumber: 'KW-FP-00127', type: 'Force Plate', status: 'normal', firmware: '2.4.0', battery: 95, lastSync: '2026-09-29T07:30:00Z', location: 'Lab 1' },
];

export const DEMO_PROTOCOLS: TestProtocol[] = [
  {
    id: 'p-1', name: 'Countermovement Jump', testType: 'CMJ', deviceType: 'Force Plate', trials: 3,
    metrics: ['Jump Height', 'Peak Force', 'Peak Power', 'RSI-mod', 'Asymmetry', 'Time to Takeoff'],
    validityRules: ['Minimum jump height: 20 cm', 'No excessive forward lean', 'Full foot contact on landing'],
    description: 'Standard bilateral countermovement jump with hands on hips.',
  },
  {
    id: 'p-2', name: 'Squat Jump', testType: 'SJ', deviceType: 'Force Plate', trials: 3,
    metrics: ['Jump Height', 'Peak Force', 'Peak Power'],
    validityRules: ['No countermovement before jump', 'Knee angle 90° at start', 'Hands on hips'],
    description: 'Static squat jump from 90° knee flexion.',
  },
  {
    id: 'p-3', name: 'Isometric Mid-Thigh Pull', testType: 'IMTP', deviceType: 'Force Plate', trials: 2,
    metrics: ['Peak Force', 'RFD', 'Relative Peak Force'],
    validityRules: ['Body position stable', 'No pre-tension', 'Pull for 5 seconds'],
    description: 'Isometric mid-thigh pull on force plate with fixed bar.',
  },
  {
    id: 'p-4', name: 'Drop Jump', testType: 'Drop Jump', deviceType: 'Force Plate', trials: 3,
    metrics: ['Jump Height', 'RSI-mod', 'Contact Time'],
    validityRules: ['Drop height: 30 cm', 'Minimal ground contact time', 'Hands on hips'],
    description: 'Drop jump from 30 cm box with immediate rebound.',
  },
];

export const DEMO_USERS: User[] = [
  { id: 'u-1', name: 'John Smith', email: 'john@kunwei.com', role: 'Organization Admin', status: 'active', teamAccess: ['team-1', 'team-2', 'team-3'], lastActive: '2026-09-29T09:45:00Z' },
  { id: 'u-2', name: 'Sarah Chen', email: 'sarah@kunwei.com', role: 'Sports Scientist', status: 'active', teamAccess: ['team-1'], lastActive: '2026-09-29T08:30:00Z' },
  { id: 'u-3', name: 'Mike Wang', email: 'mike@kunwei.com', role: 'Coach', status: 'active', teamAccess: ['team-1', 'team-2'], lastActive: '2026-09-28T17:00:00Z' },
  { id: 'u-4', name: 'Lisa Zhang', email: 'lisa@kunwei.com', role: 'Physiotherapist', status: 'active', teamAccess: ['team-1'], lastActive: '2026-09-29T07:15:00Z' },
  { id: 'u-5', name: 'Tom Liu', email: 'tom@kunwei.com', role: 'Viewer', status: 'inactive', teamAccess: ['team-3'], lastActive: '2026-09-20T10:00:00Z' },
];

function generateForceTimeData(seed: number): number[] {
  const data: number[] = [];
  const samples = 200;
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    let v = 0;
    if (t < 0.2) v = 780 + Math.sin(t * 30) * 20;
    else if (t < 0.45) v = 780 - 200 * Math.sin((t - 0.2) / 0.25 * Math.PI);
    else if (t < 0.55) v = 580 + 1600 * Math.pow((t - 0.45) / 0.1, 0.5);
    else if (t < 0.7) v = 2180 - 1400 * Math.pow((t - 0.55) / 0.15, 1.5);
    else v = 780 + Math.sin(t * 20) * 15;
    data.push(Math.max(0, v + (Math.random() - 0.5) * 30 + seed));
  }
  return data;
}

export const DEMO_SESSIONS: TestSession[] = [
  {
    id: 's-1', athleteId: 'a-1', protocolName: 'Countermovement Jump', testType: 'CMJ',
    date: '2026-09-29T09:42:00Z', deviceSerial: 'KW-FP-00124', operatorName: 'Mike Wang',
    status: 'normal',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 51.8, peak_force: 2105, peak_power: 4850, rsi_mod: 0.39, asymmetry: 5.8 }, forceTimeData: generateForceTimeData(0) },
      { number: 2, status: 'valid', values: { jump_height: 52.4, peak_force: 2134, peak_power: 4920, rsi_mod: 0.41, asymmetry: 6.2 }, forceTimeData: generateForceTimeData(5) },
      { number: 3, status: 'invalid', reason: 'Insufficient countermovement depth', values: {}, forceTimeData: generateForceTimeData(-10) },
    ],
    summary: { jump_height: 52.4, peak_force: 2134, peak_power: 4920, rsi_mod: 0.41, asymmetry: 6.2, time_to_takeoff: 920 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-2', athleteId: 'a-1', protocolName: 'Isometric Mid-Thigh Pull', testType: 'IMTP',
    date: '2026-09-25T10:15:00Z', deviceSerial: 'KW-FP-00124', operatorName: 'Sarah Chen',
    status: 'normal',
    trials: [
      { number: 1, status: 'valid', values: { peak_force_imtp: 2950, rfd: 5700, relative_peak_force: 37.8 }, forceTimeData: generateForceTimeData(2) },
      { number: 2, status: 'valid', values: { peak_force_imtp: 2980, rfd: 5820, relative_peak_force: 38.2 }, forceTimeData: generateForceTimeData(8) },
    ],
    summary: { peak_force_imtp: 2980, rfd: 5820, relative_peak_force: 38.2 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-3', athleteId: 'a-1', protocolName: 'Countermovement Jump', testType: 'CMJ',
    date: '2026-09-20T09:30:00Z', deviceSerial: 'KW-FP-00124', operatorName: 'Mike Wang',
    status: 'normal',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 50.8, peak_force: 2080, peak_power: 4780, rsi_mod: 0.38, asymmetry: 7.0 }, forceTimeData: generateForceTimeData(-3) },
      { number: 2, status: 'valid', values: { jump_height: 50.2, peak_force: 2060, peak_power: 4720, rsi_mod: 0.37, asymmetry: 6.5 }, forceTimeData: generateForceTimeData(1) },
      { number: 3, status: 'valid', values: { jump_height: 49.9, peak_force: 2045, peak_power: 4690, rsi_mod: 0.36, asymmetry: 6.8 }, forceTimeData: generateForceTimeData(4) },
    ],
    summary: { jump_height: 50.8, peak_force: 2080, peak_power: 4780, rsi_mod: 0.38, asymmetry: 6.8, time_to_takeoff: 950 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-4', athleteId: 'a-3', protocolName: 'Countermovement Jump', testType: 'CMJ',
    date: '2026-09-29T09:15:00Z', deviceSerial: 'KW-FP-00124', operatorName: 'Mike Wang',
    status: 'normal',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 48.1, peak_force: 2100, peak_power: 4600, rsi_mod: 0.39, asymmetry: 4.5 }, forceTimeData: generateForceTimeData(6) },
      { number: 2, status: 'valid', values: { jump_height: 47.6, peak_force: 2080, peak_power: 4550, rsi_mod: 0.38, asymmetry: 5.0 }, forceTimeData: generateForceTimeData(3) },
      { number: 3, status: 'valid', values: { jump_height: 47.9, peak_force: 2090, peak_power: 4580, rsi_mod: 0.38, asymmetry: 4.8 }, forceTimeData: generateForceTimeData(7) },
    ],
    summary: { jump_height: 48.1, peak_force: 2100, peak_power: 4600, rsi_mod: 0.39, asymmetry: 4.8, time_to_takeoff: 880 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-5', athleteId: 'a-2', protocolName: 'Isometric Mid-Thigh Pull', testType: 'IMTP',
    date: '2026-09-29T09:37:00Z', deviceSerial: 'KW-FP-00124', operatorName: 'Mike Wang',
    status: 'warning',
    trials: [
      { number: 1, status: 'valid', values: { peak_force_imtp: 2920, rfd: 5650, relative_peak_force: 40.6 }, forceTimeData: generateForceTimeData(-2) },
      { number: 2, status: 'valid', values: { peak_force_imtp: 2980, rfd: 5750, relative_peak_force: 41.4 }, forceTimeData: generateForceTimeData(10) },
    ],
    summary: { peak_force_imtp: 2980, rfd: 5750, relative_peak_force: 41.4 },
    qualityFlag: 'questionable', processingVersion: '2.1',
  },
  {
    id: 's-6', athleteId: 'a-6', protocolName: 'Countermovement Jump', testType: 'CMJ',
    date: '2026-09-28T14:00:00Z', deviceSerial: 'KW-FP-00127', operatorName: 'Mike Wang',
    status: 'normal',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 48.5, peak_force: 2090, peak_power: 4700, rsi_mod: 0.39, asymmetry: 4.2 }, forceTimeData: generateForceTimeData(12) },
      { number: 2, status: 'valid', values: { jump_height: 49.2, peak_force: 2110, peak_power: 4750, rsi_mod: 0.40, asymmetry: 3.8 }, forceTimeData: generateForceTimeData(15) },
      { number: 3, status: 'valid', values: { jump_height: 48.8, peak_force: 2100, peak_power: 4720, rsi_mod: 0.40, asymmetry: 4.0 }, forceTimeData: generateForceTimeData(9) },
    ],
    summary: { jump_height: 49.2, peak_force: 2110, peak_power: 4750, rsi_mod: 0.40, asymmetry: 4.0, time_to_takeoff: 900 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
];

export function getSessionsForAthlete(athleteId: string): TestSession[] {
  return DEMO_SESSIONS.filter((s) => s.athleteId === athleteId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getTimelineForAthlete(athleteId: string): TimelineEvent[] {
  return getSessionsForAthlete(athleteId).map((s) => ({
    id: s.id,
    date: s.date,
    type: 'testing' as const,
    title: s.protocolName,
    testType: s.testType,
    metrics: Object.entries(s.summary).map(([key, value]) => {
      const metric = METRIC_MAP[key];
      return metric ? { name: metric.name, value, unit: metric.unit } : { name: key, value, unit: '' };
    }).slice(0, 4),
    sessionId: s.id,
  }));
}

const METRIC_MAP: Record<string, { name: string; unit: string }> = {
  jump_height: { name: 'Jump Height', unit: 'cm' },
  peak_force: { name: 'Peak Force', unit: 'N' },
  peak_power: { name: 'Peak Power', unit: 'W' },
  rsi_mod: { name: 'RSI-mod', unit: '' },
  asymmetry: { name: 'Asymmetry', unit: '%' },
  time_to_takeoff: { name: 'Time to Takeoff', unit: 'ms' },
  peak_force_imtp: { name: 'Peak Force', unit: 'N' },
  rfd: { name: 'RFD', unit: 'N/s' },
  relative_peak_force: { name: 'Relative Peak Force', unit: 'N/kg' },
};
