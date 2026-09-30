import type { Athlete, Device, Group, Organization, TestProtocol, TestSession, Team, TimelineEvent, User, Sport, ImportJob, Integration, SyncLog } from './types';

export const DEMO_ORG: Organization = {
  id: 'org-1',
  name: 'Kunwei Performance Center',
  nameCn: '坤维运动中心',
  country: 'China',
  timezone: 'Asia/Shanghai',
};

export const DEMO_SPORTS: Sport[] = [
  { id: 'sport-cmj', name: 'Countermovement Jump', nameCn: '反向纵跳', icon: 'ArrowUp', category: 'Jumping', metrics: ['Jump Height', 'Peak Force', 'RSI-mod', 'Asymmetry'] },
  { id: 'sport-sprint', name: 'Sprint', nameCn: '短跑', icon: 'Zap', category: 'Sprinting', metrics: ['Peak Velocity', 'Split Time', 'Ground Contact', 'Flight Time'] },
  { id: 'sport-swim', name: 'Swimming', nameCn: '游泳', icon: 'Waves', category: 'Aquatic', metrics: ['Stroke Rate', 'Stroke Count', 'Lap Time', 'DPS'] },
  { id: 'sport-hj', name: 'High Jump', nameCn: '跳高', icon: 'TrendingUp', category: 'Jumping', metrics: ['Takeoff Force', 'Bar Clearance', 'Approach Velocity'] },
  { id: 'sport-imtp', name: 'Isometric Strength', nameCn: '等长力量', icon: 'Dumbbell', category: 'Strength', metrics: ['Peak Force', 'RFD', 'Relative Peak Force'] },
  { id: 'sport-cod', name: 'Change of Direction', nameCn: '变向能力', icon: 'Shuffle', category: 'Agility', metrics: ['COD Time', 'Deceleration', 'Reacceleration'] },
];

export const DEMO_TEAMS: Team[] = [
  { id: 'team-1', name: 'Senior Men\'s Team', nameCn: '男子一队', sportId: 'sport-cmj', season: '2026-2027', athleteCount: 32 },
  { id: 'team-2', name: 'U21 Squad', nameCn: 'U21梯队', sportId: 'sport-sprint', season: '2026-2027', athleteCount: 24 },
  { id: 'team-3', name: 'Swim Team', nameCn: '游泳队', sportId: 'sport-swim', season: '2026-2027', athleteCount: 18 },
];

export const DEMO_GROUPS: Group[] = [
  { id: 'g-1', name: 'Jumpers', nameCn: '跳跃组', type: 'Position', description: 'Jump specialists', athleteCount: 8 },
  { id: 'g-2', name: 'Sprinters', nameCn: '冲刺组', type: 'Position', description: 'Sprint specialists', athleteCount: 6 },
  { id: 'g-3', name: 'Return to Play', nameCn: '康复回归', type: 'Medical', description: 'Athletes in RTP protocol', athleteCount: 3 },
  { id: 'g-4', name: 'Pre-season', nameCn: '赛季前', type: 'Conditioning', description: 'Pre-season conditioning', athleteCount: 12 },
];

export const DEMO_ATHLETES: Athlete[] = [
  {
    id: 'a-1', firstName: '张', lastName: '伟', dateOfBirth: '2001-03-15', sex: 'M',
    sportId: 'sport-cmj', position: 'Forward', teamId: 'team-1', groupIds: ['g-1'],
    status: 'attention', lastTestDate: '2026-09-29', lastTestProtocol: 'CMJ Bilateral',
    photoUrl: null, height: 182, weight: 78,
    baseline: { jump_height: 49.8, peak_force: 2030, rsi_mod: 0.38, asymmetry: 5.1 },
    personalBest: { jump_height: 53.0, peak_force: 2180, rsi_mod: 0.44, asymmetry: 3.2 },
    tags: ['Flagged', 'RTP'],
  },
  {
    id: 'a-2', firstName: '李', lastName: '明', dateOfBirth: '2002-07-22', sex: 'M',
    sportId: 'sport-sprint', position: 'Sprinter', teamId: 'team-2', groupIds: ['g-2'],
    status: 'warning', lastTestDate: '2026-09-29', lastTestProtocol: '30m Sprint',
    photoUrl: null, height: 178, weight: 72,
    baseline: { peak_velocity: 9.8, split_time_30m: 4.2, ground_contact: 95 },
    personalBest: { peak_velocity: 10.5, split_time_30m: 3.95, ground_contact: 82 },
    tags: ['Promising'],
  },
  {
    id: 'a-3', firstName: '王', lastName: '浩', dateOfBirth: '2000-11-08', sex: 'M',
    sportId: 'sport-cmj', position: 'Defender', teamId: 'team-1', groupIds: [],
    status: 'normal', lastTestDate: '2026-09-29', lastTestProtocol: 'CMJ Bilateral',
    photoUrl: null, height: 186, weight: 82,
    baseline: { jump_height: 45.2, peak_force: 1950, rsi_mod: 0.35, asymmetry: 6.8 },
    personalBest: { jump_height: 48.1, peak_force: 2100, rsi_mod: 0.39, asymmetry: 4.5 },
    tags: [],
  },
  {
    id: 'a-4', firstName: '陈', lastName: '杰', dateOfBirth: '2003-01-30', sex: 'M',
    sportId: 'sport-hj', position: 'High Jumper', teamId: 'team-1', groupIds: ['g-1', 'g-3'],
    status: 'attention', lastTestDate: '2026-09-15', lastTestProtocol: 'Takeoff Analysis',
    photoUrl: null, height: 188, weight: 75,
    baseline: { takeoff_force: 2400, approach_velocity: 7.2, bar_clearance: 2.15 },
    personalBest: { takeoff_force: 2650, approach_velocity: 7.8, bar_clearance: 2.28 },
    tags: ['RTP', 'Flagged'],
  },
  {
    id: 'a-5', firstName: '刘', lastName: '洋', dateOfBirth: '1999-05-14', sex: 'M',
    sportId: 'sport-imtp', position: 'Strength Athlete', teamId: 'team-1', groupIds: ['g-4'],
    status: 'normal', lastTestDate: '2026-09-28', lastTestProtocol: 'IMTP Standard',
    photoUrl: null, height: 190, weight: 85,
    baseline: { peak_force_imtp: 2850, rfd: 5600, relative_peak_force: 33.5 },
    personalBest: { peak_force_imtp: 3100, rfd: 6200, relative_peak_force: 36.5 },
    tags: ['Pre-season'],
  },
  {
    id: 'a-6', firstName: '赵', lastName: '蕊', dateOfBirth: '2001-09-03', sex: 'F',
    sportId: 'sport-swim', position: 'Freestyle', teamId: 'team-3', groupIds: ['g-4'],
    status: 'normal', lastTestDate: '2026-09-28', lastTestProtocol: '50m Free Analysis',
    photoUrl: null, height: 172, weight: 62,
    baseline: { stroke_rate: 48, stroke_count: 38, lap_time: 25.8, dps: 2.1 },
    personalBest: { stroke_rate: 52, stroke_count: 35, lap_time: 24.9, dps: 2.25 },
    tags: ['Pre-season'],
  },
  {
    id: 'a-7', firstName: '孙', lastName: '俊', dateOfBirth: '2002-12-20', sex: 'M',
    sportId: 'sport-cod', position: 'Agility', teamId: 'team-2', groupIds: ['g-2'],
    status: 'normal', lastTestDate: '2026-09-27', lastTestProtocol: '505 Agility Test',
    photoUrl: null, height: 178, weight: 70,
    baseline: { cod_time: 2.35, deceleration: 4.8, reacceleration: 5.2 },
    personalBest: { cod_time: 2.18, deceleration: 5.5, reacceleration: 5.8 },
    tags: [],
  },
  {
    id: 'a-8', firstName: '吴', lastName: '磊', dateOfBirth: '2000-06-18', sex: 'M',
    sportId: 'sport-sprint', position: 'Sprinter', teamId: 'team-2', groupIds: ['g-2'],
    status: 'warning', lastTestDate: '2026-09-27', lastTestProtocol: '30m Sprint',
    photoUrl: null, height: 177, weight: 73,
    baseline: { peak_velocity: 9.5, split_time_30m: 4.35, ground_contact: 98 },
    personalBest: { peak_velocity: 10.2, split_time_30m: 4.05, ground_contact: 85 },
    tags: [],
  },
];

export const DEMO_DEVICES: Device[] = [
  { id: 'd-1', serialNumber: 'KW-FP-00124', type: 'Force Plate', status: 'processing', firmware: '2.4.1', battery: 87, lastSync: '2026-09-29T09:42:00Z', location: 'Lab 1', protocolSupport: ['CMJ', 'IMTP', 'SJ', 'Drop Jump'] },
  { id: 'd-2', serialNumber: 'KW-FP-00125', type: 'Force Plate', status: 'offline', firmware: '2.3.8', battery: 0, lastSync: '2026-09-28T14:20:00Z', location: 'Lab 2', protocolSupport: ['CMJ', 'SJ'] },
  { id: 'd-3', serialNumber: 'KW-RADAR-0042', type: 'Radar Gun', status: 'syncing', firmware: '1.8.2', battery: 62, lastSync: '2026-09-29T08:15:00Z', location: 'Field Station', protocolSupport: ['Sprint', 'COD'] },
  { id: 'd-4', serialNumber: 'KW-VID-0008', type: 'Video Analysis', status: 'normal', firmware: '3.1.0', battery: 95, lastSync: '2026-09-29T07:30:00Z', location: 'Pool Deck', protocolSupport: ['Swimming', 'High Jump'] },
];

export const DEMO_PROTOCOLS: TestProtocol[] = [
  {
    id: 'p-cmj-bilateral', name: 'CMJ Bilateral', nameCn: '双腿反向纵跳', sportId: 'sport-cmj', deviceType: 'Force Plate', trials: 3, durationMin: 5, difficulty: 'basic',
    metrics: [
      { key: 'jump_height', name: 'Jump Height', nameCn: '跳跃高度', unit: 'cm', primary: true, threshold: { warning: 40, attention: 35 } },
      { key: 'peak_force', name: 'Peak Force', nameCn: '峰值力', unit: 'N', primary: true },
      { key: 'rsi_mod', name: 'RSI-mod', nameCn: '反应力量指数', unit: '', primary: true },
      { key: 'asymmetry', name: 'Asymmetry', nameCn: '不对称性', unit: '%', primary: true, threshold: { warning: 7, attention: 10 } },
      { key: 'time_to_takeoff', name: 'Time to Takeoff', nameCn: '起跳时间', unit: 'ms', primary: false },
    ],
    validityRules: ['Minimum jump height: 20 cm', 'No excessive forward lean', 'Full foot contact on landing', 'Hands on hips throughout'],
    description: 'Standard bilateral countermovement jump with hands on hips.',
    descriptionCn: '标准双腿反向纵跳，双手叉腰。',
  },
  {
    id: 'p-sprint-30m', name: '30m Sprint', nameCn: '30米冲刺', sportId: 'sport-sprint', deviceType: 'Radar Gun', trials: 2, durationMin: 8, difficulty: 'basic',
    metrics: [
      { key: 'peak_velocity', name: 'Peak Velocity', nameCn: '峰值速度', unit: 'm/s', primary: true, threshold: { warning: 9, attention: 8 } },
      { key: 'split_time_30m', name: '30m Split Time', nameCn: '30米分段用时', unit: 's', primary: true },
      { key: 'ground_contact', name: 'Ground Contact', nameCn: '触地时间', unit: 'ms', primary: false },
      { key: 'flight_time', name: 'Flight Time', nameCn: '腾空时间', unit: 'ms', primary: false },
    ],
    validityRules: ['Stationary start', 'No false start', 'Complete 30m distance'],
    description: '30-meter sprint from stationary start with radar tracking.',
    descriptionCn: '从静止起跑的30米冲刺，雷达跟踪。',
  },
  {
    id: 'p-swim-50m', name: '50m Freestyle Analysis', nameCn: '50米自由泳分析', sportId: 'sport-swim', deviceType: 'Video Analysis', trials: 1, durationMin: 10, difficulty: 'advanced',
    metrics: [
      { key: 'stroke_rate', name: 'Stroke Rate', nameCn: '划水频率', unit: '/min', primary: true },
      { key: 'stroke_count', name: 'Stroke Count', nameCn: '划水次数', unit: '', primary: true },
      { key: 'lap_time', name: 'Lap Time', nameCn: '单圈用时', unit: 's', primary: true },
      { key: 'dps', name: 'Distance per Stroke', nameCn: '每划距离', unit: 'm', primary: false },
    ],
    validityRules: ['Complete 50m distance', 'Freestyle stroke only', 'No pool wall push-off assistance'],
    description: 'Video analysis of 50m freestyle swim.',
    descriptionCn: '50米自由泳视频分析。',
  },
  {
    id: 'p-imtp-standard', name: 'IMTP Standard', nameCn: '等长中位拉标准测试', sportId: 'sport-imtp', deviceType: 'Force Plate', trials: 2, durationMin: 6, difficulty: 'standard',
    metrics: [
      { key: 'peak_force_imtp', name: 'Peak Force', nameCn: '峰值力', unit: 'N', primary: true },
      { key: 'rfd', name: 'RFD', nameCn: '发力率', unit: 'N/s', primary: true },
      { key: 'relative_peak_force', name: 'Relative Peak Force', nameCn: '相对峰值力', unit: 'N/kg', primary: false },
    ],
    validityRules: ['Body position stable', 'No pre-tension', 'Pull for 5 seconds', 'Knee angle 140°'],
    description: 'Isometric mid-thigh pull on force plate with fixed bar.',
    descriptionCn: '在测力台上进行等长中位拉，固定杠铃。',
  },
  {
    id: 'p-hj-takeoff', name: 'High Jump Takeoff', nameCn: '跳高起跳分析', sportId: 'sport-hj', deviceType: 'Force Plate', trials: 3, durationMin: 12, difficulty: 'advanced',
    metrics: [
      { key: 'takeoff_force', name: 'Takeoff Force', nameCn: '起跳力', unit: 'N', primary: true },
      { key: 'approach_velocity', name: 'Approach Velocity', nameCn: '助跑速度', unit: 'm/s', primary: true },
      { key: 'bar_clearance', name: 'Bar Clearance', nameCn: '过杆高度', unit: 'm', primary: true },
    ],
    validityRules: ['Complete Fosbury Flop technique', 'Valid approach curve', 'Measured bar height'],
    description: 'High jump takeoff force analysis on force plate.',
    descriptionCn: '跳高起跳力分析，使用测力台。',
  },
  {
    id: 'p-cod-505', name: '505 Agility Test', nameCn: '505变向测试', sportId: 'sport-cod', deviceType: 'Timing Gate', trials: 3, durationMin: 7, difficulty: 'standard',
    metrics: [
      { key: 'cod_time', name: 'COD Time', nameCn: '变向时间', unit: 's', primary: true },
      { key: 'deceleration', name: 'Deceleration', nameCn: '减速能力', unit: 'm/s²', primary: false },
      { key: 'reacceleration', name: 'Reacceleration', nameCn: '再加速能力', unit: 'm/s²', primary: false },
    ],
    validityRules: ['Sprint 15m, turn, sprint 5m back', 'Touch line with foot', 'No sliding'],
    description: '505 change of direction agility test with timing gates.',
    descriptionCn: '505变向敏捷测试，使用计时门。',
  },
];

export const DEMO_USERS: User[] = [
  { id: 'u-1', name: 'John Smith', email: 'john@kunwei.com', role: 'Organization Admin', roleCn: '组织管理员', status: 'active', teamAccess: ['team-1', 'team-2', 'team-3'], lastActive: '2026-09-29T09:45:00Z' },
  { id: 'u-2', name: '陈莎拉', email: 'sarah@kunwei.com', role: 'Sports Scientist', roleCn: '体育科学家', status: 'active', teamAccess: ['team-1'], lastActive: '2026-09-29T08:30:00Z' },
  { id: 'u-3', name: '王迈克', email: 'mike@kunwei.com', role: 'Coach', roleCn: '教练', status: 'active', teamAccess: ['team-1', 'team-2'], lastActive: '2026-09-28T17:00:00Z' },
  { id: 'u-4', name: '张丽莎', email: 'lisa@kunwei.com', role: 'Physiotherapist', roleCn: '物理治疗师', status: 'active', teamAccess: ['team-1'], lastActive: '2026-09-29T07:15:00Z' },
  { id: 'u-5', name: '刘汤姆', email: 'tom@kunwei.com', role: 'Viewer', roleCn: '查看者', status: 'inactive', teamAccess: ['team-3'], lastActive: '2026-09-20T10:00:00Z' },
];

export const DEMO_IMPORTS: ImportJob[] = [
  { id: 'imp-1', fileName: 'sprint_trials_sept.csv', source: 'csv', status: 'completed', progress: 100, totalRows: 240, processedRows: 238, matchedColumns: 8, unmatchedColumns: 1, createdAt: '2026-09-28T14:30:00Z', sportId: 'sport-sprint' },
  { id: 'imp-2', fileName: 'garmin_team2_fit.json', source: 'garmin', status: 'processing', progress: 65, totalRows: 1200, processedRows: 780, matchedColumns: 12, unmatchedColumns: 0, createdAt: '2026-09-29T08:00:00Z', sportId: 'sport-sprint' },
  { id: 'imp-3', fileName: 'hawkin_cmj_export.xlsx', source: 'hawkin', status: 'mapping', progress: 20, totalRows: 180, processedRows: 0, matchedColumns: 5, unmatchedColumns: 3, createdAt: '2026-09-29T09:15:00Z', sportId: 'sport-cmj' },
  { id: 'imp-4', fileName: 'whoop_recovery.csv', source: 'whoop', status: 'failed', progress: 0, totalRows: 0, processedRows: 0, matchedColumns: 0, unmatchedColumns: 6, createdAt: '2026-09-29T07:00:00Z', sportId: 'sport-cmj' },
];

export const DEMO_INTEGRATIONS: Integration[] = [
  { id: 'int-1', name: 'Hawkin Dynamics', nameCn: 'Hawkin动力学', category: 'Force Plate', icon: 'Zap', status: 'connected', lastSync: '2026-09-29T06:00:00Z', description: 'Import force plate data from Hawkin Dynamics cloud' },
  { id: 'int-2', name: 'Garmin Connect', nameCn: 'Garmin Connect', category: 'Wearable', icon: 'Watch', status: 'connected', lastSync: '2026-09-29T08:00:00Z', description: 'Sync athlete training data from Garmin devices' },
  { id: 'int-3', name: 'WHOOP', nameCn: 'WHOOP', category: 'Recovery', icon: 'Heart', status: 'error', lastSync: '2026-09-28T22:00:00Z', description: 'Recovery and strain metrics from WHOOP straps' },
  { id: 'int-4', name: 'Smartabase', nameCn: 'Smartabase', category: 'AMS', icon: 'Database', status: 'disconnected', lastSync: null, description: 'Athlete management system integration' },
  { id: 'int-5', name: 'TeamBuildr', nameCn: 'TeamBuildr', category: 'Strength', icon: 'Dumbbell', status: 'disconnected', lastSync: null, description: 'Strength training log integration' },
];

export const DEMO_SYNC_LOGS: SyncLog[] = [
  { id: 'sync-1', timestamp: '2026-09-29T09:42:00Z', source: 'KW-FP-00124', direction: 'inbound', records: 12, status: 'success', message: 'Device sync completed' },
  { id: 'sync-2', timestamp: '2026-09-29T08:00:00Z', source: 'Garmin Connect', direction: 'inbound', records: 340, status: 'success', message: 'Training sessions synced' },
  { id: 'sync-3', timestamp: '2026-09-29T07:15:00Z', source: 'KW-RADAR-0042', direction: 'inbound', records: 8, status: 'partial', message: '2 records failed validation' },
  { id: 'sync-4', timestamp: '2026-09-28T22:00:00Z', source: 'WHOOP', direction: 'inbound', records: 0, status: 'failed', message: 'Authentication token expired' },
  { id: 'sync-5', timestamp: '2026-09-28T18:30:00Z', source: 'Kunwei API', direction: 'outbound', records: 56, status: 'success', message: 'Exported to Smartabase' },
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
    id: 's-1', athleteId: 'a-1', protocolId: 'p-cmj-bilateral', protocolName: 'CMJ Bilateral', sportId: 'sport-cmj',
    date: '2026-09-29T09:42:00Z', deviceSerial: 'KW-FP-00124', operatorName: '王迈克',
    status: 'normal', source: 'device',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 51.8, peak_force: 2105, rsi_mod: 0.39, asymmetry: 5.8 }, forceTimeData: generateForceTimeData(0) },
      { number: 2, status: 'valid', values: { jump_height: 52.4, peak_force: 2134, rsi_mod: 0.41, asymmetry: 6.2 }, forceTimeData: generateForceTimeData(5) },
      { number: 3, status: 'invalid', reason: 'Insufficient countermovement depth', values: {}, forceTimeData: generateForceTimeData(-10) },
    ],
    summary: { jump_height: 52.4, peak_force: 2134, rsi_mod: 0.41, asymmetry: 6.2, time_to_takeoff: 920 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-2', athleteId: 'a-1', protocolId: 'p-imtp-standard', protocolName: 'IMTP Standard', sportId: 'sport-imtp',
    date: '2026-09-25T10:15:00Z', deviceSerial: 'KW-FP-00124', operatorName: '陈莎拉',
    status: 'normal', source: 'device',
    trials: [
      { number: 1, status: 'valid', values: { peak_force_imtp: 2950, rfd: 5700, relative_peak_force: 37.8 }, forceTimeData: generateForceTimeData(2) },
      { number: 2, status: 'valid', values: { peak_force_imtp: 2980, rfd: 5820, relative_peak_force: 38.2 }, forceTimeData: generateForceTimeData(8) },
    ],
    summary: { peak_force_imtp: 2980, rfd: 5820, relative_peak_force: 38.2 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-3', athleteId: 'a-1', protocolId: 'p-cmj-bilateral', protocolName: 'CMJ Bilateral', sportId: 'sport-cmj',
    date: '2026-09-20T09:30:00Z', deviceSerial: 'KW-FP-00124', operatorName: '王迈克',
    status: 'normal', source: 'device',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 50.8, peak_force: 2080, rsi_mod: 0.38, asymmetry: 7.0 }, forceTimeData: generateForceTimeData(-3) },
      { number: 2, status: 'valid', values: { jump_height: 50.2, peak_force: 2060, rsi_mod: 0.37, asymmetry: 6.5 }, forceTimeData: generateForceTimeData(1) },
      { number: 3, status: 'valid', values: { jump_height: 49.9, peak_force: 2045, rsi_mod: 0.36, asymmetry: 6.8 }, forceTimeData: generateForceTimeData(4) },
    ],
    summary: { jump_height: 50.8, peak_force: 2080, rsi_mod: 0.38, asymmetry: 6.8, time_to_takeoff: 950 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-4', athleteId: 'a-2', protocolId: 'p-sprint-30m', protocolName: '30m Sprint', sportId: 'sport-sprint',
    date: '2026-09-29T09:37:00Z', deviceSerial: 'KW-RADAR-0042', operatorName: '王迈克',
    status: 'warning', source: 'device',
    trials: [
      { number: 1, status: 'valid', values: { peak_velocity: 10.2, split_time_30m: 4.02, ground_contact: 88 } },
      { number: 2, status: 'valid', values: { peak_velocity: 10.3, split_time_30m: 3.98, ground_contact: 85 } },
    ],
    summary: { peak_velocity: 10.3, split_time_30m: 3.98, ground_contact: 85 },
    qualityFlag: 'questionable', processingVersion: '2.1',
  },
  {
    id: 's-5', athleteId: 'a-3', protocolId: 'p-cmj-bilateral', protocolName: 'CMJ Bilateral', sportId: 'sport-cmj',
    date: '2026-09-29T09:15:00Z', deviceSerial: 'KW-FP-00124', operatorName: '王迈克',
    status: 'normal', source: 'device',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 48.1, peak_force: 2100, rsi_mod: 0.39, asymmetry: 4.5 }, forceTimeData: generateForceTimeData(6) },
      { number: 2, status: 'valid', values: { jump_height: 47.6, peak_force: 2080, rsi_mod: 0.38, asymmetry: 5.0 }, forceTimeData: generateForceTimeData(3) },
      { number: 3, status: 'valid', values: { jump_height: 47.9, peak_force: 2090, rsi_mod: 0.38, asymmetry: 4.8 }, forceTimeData: generateForceTimeData(7) },
    ],
    summary: { jump_height: 48.1, peak_force: 2100, rsi_mod: 0.39, asymmetry: 4.8, time_to_takeoff: 880 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-6', athleteId: 'a-6', protocolId: 'p-swim-50m', protocolName: '50m Freestyle Analysis', sportId: 'sport-swim',
    date: '2026-09-28T14:00:00Z', deviceSerial: 'KW-VID-0008', operatorName: '陈莎拉',
    status: 'normal', source: 'device',
    trials: [
      { number: 1, status: 'valid', values: { stroke_rate: 50, stroke_count: 36, lap_time: 25.2, dps: 2.18 } },
    ],
    summary: { stroke_rate: 50, stroke_count: 36, lap_time: 25.2, dps: 2.18 },
    qualityFlag: 'valid', processingVersion: '2.1',
  },
  {
    id: 's-7', athleteId: 'a-7', protocolId: 'p-cod-505', protocolName: '505 Agility Test', sportId: 'sport-cod',
    date: '2026-09-27T15:30:00Z', deviceSerial: 'KW-RADAR-0042', operatorName: '王迈克',
    status: 'normal', source: 'device',
    trials: [
      { number: 1, status: 'valid', values: { cod_time: 2.22, deceleration: 5.3, reacceleration: 5.6 } },
      { number: 2, status: 'valid', values: { cod_time: 2.20, deceleration: 5.4, reacceleration: 5.7 } },
      { number: 3, status: 'valid', values: { cod_time: 2.25, deceleration: 5.2, reacceleration: 5.5 } },
    ],
    summary: { cod_time: 2.20, deceleration: 5.4, reacceleration: 5.7 },
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
    sportId: s.sportId,
    metrics: Object.entries(s.summary).slice(0, 4).map(([key, value]) => {
      const metric = METRIC_MAP[key];
      return metric ? { name: metric.name, value, unit: metric.unit } : { name: key, value, unit: '' };
    }),
    sessionId: s.id,
  }));
}

export function getSport(sportId: string): Sport | undefined {
  return DEMO_SPORTS.find((s) => s.id === sportId);
}

export function getProtocol(protocolId: string): TestProtocol | undefined {
  return DEMO_PROTOCOLS.find((p) => p.id === protocolId);
}

export function getProtocolsForSport(sportId: string): TestProtocol[] {
  return DEMO_PROTOCOLS.filter((p) => p.sportId === sportId);
}

export function getAthlete(id: string): Athlete | undefined {
  return DEMO_ATHLETES.find((a) => a.id === id);
}

export function getTeam(id: string): Team | undefined {
  return DEMO_TEAMS.find((t) => t.id === id);
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
  peak_velocity: { name: 'Peak Velocity', unit: 'm/s' },
  split_time_30m: { name: '30m Split', unit: 's' },
  ground_contact: { name: 'Ground Contact', unit: 'ms' },
  flight_time: { name: 'Flight Time', unit: 'ms' },
  stroke_rate: { name: 'Stroke Rate', unit: '/min' },
  stroke_count: { name: 'Stroke Count', unit: '' },
  lap_time: { name: 'Lap Time', unit: 's' },
  dps: { name: 'DPS', unit: 'm' },
  takeoff_force: { name: 'Takeoff Force', unit: 'N' },
  approach_velocity: { name: 'Approach Velocity', unit: 'm/s' },
  bar_clearance: { name: 'Bar Clearance', unit: 'm' },
  cod_time: { name: 'COD Time', unit: 's' },
  deceleration: { name: 'Deceleration', unit: 'm/s²' },
  reacceleration: { name: 'Reacceleration', unit: 'm/s²' },
};
