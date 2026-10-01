import type {
  Athlete, Device, Group, Organization, TestProtocol, TestSession, Team,
  TimelineEvent, User, Sport, ImportJob, Integration, SyncLog,
  DataSource, Dataset, RawMeasurement, ProcessedMeasurement, SyncJob,
  Heartbeat, Result, ResultMetric, SessionStatus, DataQuality, ReportDefinition, DashboardWidget,
} from './types';
import { getMetric } from './metrics';

// --- Organization ---------------------------------------------------------
export const DEMO_ORG: Organization = {
  id: 'org-1',
  name: 'Kunwei Performance Center',
  nameCn: '坤维运动中心',
  country: 'China',
  timezone: 'Asia/Shanghai',
};

// --- Sports ---------------------------------------------------------------
export const DEMO_SPORTS: Sport[] = [
  { id: 'sport-cmj', name: 'Countermovement Jump', nameCn: '反向纵跳', icon: 'ArrowUp', category: 'Jumping', metrics: ['Jump Height', 'Peak Force', 'RSI-mod', 'Asymmetry'] },
  { id: 'sport-sprint', name: 'Sprint', nameCn: '短跑', icon: 'Zap', category: 'Sprinting', metrics: ['Peak Velocity', 'Split Time', 'Ground Contact', 'Flight Time'] },
  { id: 'sport-swim', name: 'Swimming', nameCn: '游泳', icon: 'Waves', category: 'Aquatic', metrics: ['Stroke Rate', 'Stroke Count', 'Lap Time', 'DPS'] },
  { id: 'sport-hj', name: 'High Jump', nameCn: '跳高', icon: 'TrendingUp', category: 'Jumping', metrics: ['Takeoff Force', 'Bar Clearance', 'Approach Velocity'] },
  { id: 'sport-imtp', name: 'Isometric Strength', nameCn: '等长力量', icon: 'Dumbbell', category: 'Strength', metrics: ['Peak Force', 'RFD', 'Relative Peak Force'] },
  { id: 'sport-cod', name: 'Change of Direction', nameCn: '变向能力', icon: 'Shuffle', category: 'Agility', metrics: ['COD Time', 'Deceleration', 'Reacceleration'] },
];

export const DEMO_TEAMS: Team[] = [
  { id: 'team-1', name: "Senior Men's Team", nameCn: '男子一队', sportId: 'sport-cmj', season: '2026-2027', athleteCount: 32 },
  { id: 'team-2', name: 'U21 Squad', nameCn: 'U21梯队', sportId: 'sport-sprint', season: '2026-2027', athleteCount: 24 },
  { id: 'team-3', name: 'Swim Team', nameCn: '游泳队', sportId: 'sport-swim', season: '2026-2027', athleteCount: 18 },
];

export const DEMO_GROUPS: Group[] = [
  { id: 'g-1', name: 'Jumpers', nameCn: '跳跃组', type: 'Position', description: 'Jump specialists', athleteCount: 8 },
  { id: 'g-2', name: 'Sprinters', nameCn: '冲刺组', type: 'Position', description: 'Sprint specialists', athleteCount: 6 },
  { id: 'g-3', name: 'Return to Play', nameCn: '康复回归', type: 'Medical', description: 'Athletes in RTP protocol', athleteCount: 3 },
  { id: 'g-4', name: 'Pre-season', nameCn: '赛季前', type: 'Conditioning', description: 'Pre-season conditioning', athleteCount: 12 },
];

// --- Athletes (Subject model, UI still says "Athlete") --------------------
export const DEMO_ATHLETES: Athlete[] = [
  {
    id: 'a-1', subjectType: 'ATHLETE', firstName: '张', lastName: '伟', dateOfBirth: '2001-03-15', sex: 'M',
    sportId: 'sport-cmj', position: 'Forward', teamId: 'team-1', groupIds: ['g-1'],
    status: 'attention', lastTestDate: '2026-09-29', lastTestProtocol: 'CMJ Bilateral',
    photoUrl: null, height: 182, weight: 78,
    baseline: { jump_height: 49.8, peak_force: 2030, rsi_mod: 0.38, asymmetry: 5.1 },
    personalBest: { jump_height: 53.0, peak_force: 2180, rsi_mod: 0.44, asymmetry: 3.2 },
    tags: ['Flagged', 'RTP'],
  },
  {
    id: 'a-2', subjectType: 'ATHLETE', firstName: '李', lastName: '明', dateOfBirth: '2002-07-22', sex: 'M',
    sportId: 'sport-sprint', position: 'Sprinter', teamId: 'team-2', groupIds: ['g-2'],
    status: 'warning', lastTestDate: '2026-09-29', lastTestProtocol: '30m Sprint',
    photoUrl: null, height: 178, weight: 72,
    baseline: { peak_velocity: 9.8, split_time_30m: 4.2, ground_contact: 95 },
    personalBest: { peak_velocity: 10.5, split_time_30m: 3.95, ground_contact: 82 },
    tags: ['Promising'],
  },
  {
    id: 'a-3', subjectType: 'ATHLETE', firstName: '王', lastName: '浩', dateOfBirth: '2000-11-08', sex: 'M',
    sportId: 'sport-cmj', position: 'Defender', teamId: 'team-1', groupIds: [],
    status: 'normal', lastTestDate: '2026-09-29', lastTestProtocol: 'CMJ Bilateral',
    photoUrl: null, height: 186, weight: 82,
    baseline: { jump_height: 45.2, peak_force: 1950, rsi_mod: 0.35, asymmetry: 6.8 },
    personalBest: { jump_height: 48.1, peak_force: 2100, rsi_mod: 0.39, asymmetry: 4.5 },
    tags: [],
  },
  {
    id: 'a-4', subjectType: 'ATHLETE', firstName: '陈', lastName: '杰', dateOfBirth: '2003-01-30', sex: 'M',
    sportId: 'sport-hj', position: 'High Jumper', teamId: 'team-1', groupIds: ['g-1', 'g-3'],
    status: 'attention', lastTestDate: '2026-09-15', lastTestProtocol: 'High Jump Takeoff',
    photoUrl: null, height: 188, weight: 75,
    baseline: { takeoff_force: 2400, approach_velocity: 7.2, bar_clearance: 2.15 },
    personalBest: { takeoff_force: 2650, approach_velocity: 7.8, bar_clearance: 2.28 },
    tags: ['RTP', 'Flagged'],
  },
  {
    id: 'a-5', subjectType: 'ATHLETE', firstName: '刘', lastName: '洋', dateOfBirth: '1999-05-14', sex: 'M',
    sportId: 'sport-imtp', position: 'Strength Athlete', teamId: 'team-1', groupIds: ['g-4'],
    status: 'normal', lastTestDate: '2026-09-28', lastTestProtocol: 'IMTP Standard',
    photoUrl: null, height: 190, weight: 85,
    baseline: { peak_force_imtp: 2850, rfd: 5600, relative_peak_force: 33.5 },
    personalBest: { peak_force_imtp: 3100, rfd: 6200, relative_peak_force: 36.5 },
    tags: ['Pre-season'],
  },
  {
    id: 'a-6', subjectType: 'ATHLETE', firstName: '赵', lastName: '蕊', dateOfBirth: '2001-09-03', sex: 'F',
    sportId: 'sport-swim', position: 'Freestyle', teamId: 'team-3', groupIds: ['g-4'],
    status: 'normal', lastTestDate: '2026-09-28', lastTestProtocol: '50m Freestyle Analysis',
    photoUrl: null, height: 172, weight: 62,
    baseline: { stroke_rate: 48, stroke_count: 38, lap_time: 25.8, dps: 2.1 },
    personalBest: { stroke_rate: 52, stroke_count: 35, lap_time: 24.9, dps: 2.25 },
    tags: ['Pre-season'],
  },
  {
    id: 'a-7', subjectType: 'ATHLETE', firstName: '孙', lastName: '俊', dateOfBirth: '2002-12-20', sex: 'M',
    sportId: 'sport-cod', position: 'Agility', teamId: 'team-2', groupIds: ['g-2'],
    status: 'normal', lastTestDate: '2026-09-27', lastTestProtocol: '505 Agility Test',
    photoUrl: null, height: 178, weight: 70,
    baseline: { cod_time: 2.35, deceleration: 4.8, reacceleration: 5.2 },
    personalBest: { cod_time: 2.18, deceleration: 5.5, reacceleration: 5.8 },
    tags: [],
  },
  {
    id: 'a-8', subjectType: 'ATHLETE', firstName: '吴', lastName: '磊', dateOfBirth: '2000-06-18', sex: 'M',
    sportId: 'sport-sprint', position: 'Sprinter', teamId: 'team-2', groupIds: ['g-2'],
    status: 'warning', lastTestDate: '2026-09-27', lastTestProtocol: '30m Sprint',
    photoUrl: null, height: 177, weight: 73,
    baseline: { peak_velocity: 9.5, split_time_30m: 4.35, ground_contact: 98 },
    personalBest: { peak_velocity: 10.2, split_time_30m: 4.05, ground_contact: 85 },
    tags: [],
  },
];

// --- Data Sources (APPLICATION / DEVICE / INTEGRATION / IMPORT) -----------
export const DEMO_DATA_SOURCES: DataSource[] = [
  { id: 'ds-kunwei-sprint', name: 'Kunwei Sprint App', nameCn: '坤维冲刺App', category: 'APPLICATION', vendor: 'Kunwei', status: 'connected', lastSync: '2026-09-29T09:37:00Z', description: 'Kunwei iPad sprint testing application', descriptionCn: '坤维iPad冲刺测试应用', protocolsSupported: ['p-sprint-30m', 'p-cod-505'], dataTypes: ['timing', 'events'] },
  { id: 'ds-kunwei-perf', name: 'Kunwei Performance App', nameCn: '坤维表现App', category: 'APPLICATION', vendor: 'Kunwei', status: 'connected', lastSync: '2026-09-29T09:42:00Z', description: 'Kunwei desktop performance testing application', descriptionCn: '坤维桌面表现测试应用', protocolsSupported: ['p-cmj-bilateral', 'p-imtp-standard'], dataTypes: ['force'] },
  { id: 'ds-kunwei-health', name: 'Kunwei Health App', nameCn: '坤维健康App', category: 'APPLICATION', vendor: 'Kunwei', status: 'disconnected', lastSync: null, description: 'Kunwei health assessment application', descriptionCn: '坤维健康评估应用', protocolsSupported: [], dataTypes: ['manual'] },
  { id: 'ds-fp-00124', name: 'Force Plate KW-FP-00124', nameCn: '测力台 KW-FP-00124', category: 'DEVICE', vendor: 'Kunwei', status: 'connected', lastSync: '2026-09-29T09:42:00Z', description: 'Kunwei force plate in Lab 1', descriptionCn: 'Lab 1测力台', protocolsSupported: ['p-cmj-bilateral', 'p-imtp-standard', 'p-hj-takeoff'], dataTypes: ['force'] },
  { id: 'ds-fp-00125', name: 'Force Plate KW-FP-00125', nameCn: '测力台 KW-FP-00125', category: 'DEVICE', vendor: 'Kunwei', status: 'disconnected', lastSync: '2026-09-28T14:20:00Z', description: 'Kunwei force plate in Lab 2', descriptionCn: 'Lab 2测力台', protocolsSupported: ['p-cmj-bilateral'], dataTypes: ['force'] },
  { id: 'ds-radar-0042', name: 'Radar Gun KW-RADAR-0042', nameCn: '雷达枪 KW-RADAR-0042', category: 'DEVICE', vendor: 'Kunwei', status: 'connected', lastSync: '2026-09-29T08:15:00Z', description: 'Radar gun at Field Station', descriptionCn: '场地站雷达枪', protocolsSupported: ['p-sprint-30m', 'p-cod-505'], dataTypes: ['timing'] },
  { id: 'ds-vid-0008', name: 'Video System KW-VID-0008', nameCn: '视频系统 KW-VID-0008', category: 'DEVICE', vendor: 'Kunwei', status: 'connected', lastSync: '2026-09-29T07:30:00Z', description: 'Video analysis system at Pool Deck', descriptionCn: '泳池视频分析系统', protocolsSupported: ['p-swim-50m', 'p-hj-takeoff'], dataTypes: ['video', 'position'] },
  { id: 'ds-hawkin', name: 'Hawkin Dynamics', nameCn: 'Hawkin动力学', category: 'INTEGRATION', vendor: 'Hawkin Dynamics', status: 'connected', lastSync: '2026-09-29T06:00:00Z', description: 'Import force plate data from Hawkin Dynamics cloud', descriptionCn: '从Hawkin动力学云导入测力数据', protocolsSupported: ['p-cmj-bilateral', 'p-imtp-standard'], dataTypes: ['force'] },
  { id: 'ds-garmin', name: 'Garmin Connect', nameCn: 'Garmin Connect', category: 'INTEGRATION', vendor: 'Garmin', status: 'connected', lastSync: '2026-09-29T08:00:00Z', description: 'Sync athlete training data from Garmin devices', descriptionCn: '从Garmin设备同步训练数据', protocolsSupported: [], dataTypes: ['events', 'manual'] },
  { id: 'ds-whoop', name: 'WHOOP', nameCn: 'WHOOP', category: 'INTEGRATION', vendor: 'WHOOP', status: 'error', lastSync: '2026-09-28T22:00:00Z', description: 'Recovery and strain metrics from WHOOP straps', descriptionCn: 'WHOOP恢复和负荷指标', protocolsSupported: [], dataTypes: ['manual'] },
  { id: 'ds-smartabase', name: 'Smartabase', nameCn: 'Smartabase', category: 'INTEGRATION', vendor: 'Smartabase', status: 'disconnected', lastSync: null, description: 'Athlete management system integration', descriptionCn: '运动员管理系统集成', protocolsSupported: [], dataTypes: ['manual'] },
  { id: 'ds-teambuildr', name: 'TeamBuildr', nameCn: 'TeamBuildr', category: 'INTEGRATION', vendor: 'TeamBuildr', status: 'disconnected', lastSync: null, description: 'Strength training log integration', descriptionCn: '力量训练记录集成', protocolsSupported: [], dataTypes: ['manual'] },
  { id: 'ds-csv-import', name: 'CSV Import', nameCn: 'CSV导入', category: 'IMPORT', vendor: '—', status: 'connected', lastSync: '2026-09-28T14:30:00Z', description: 'Generic CSV file import pipeline', descriptionCn: '通用CSV文件导入', protocolsSupported: [], dataTypes: ['manual'] },
  { id: 'ds-excel-import', name: 'Excel Import', nameCn: 'Excel导入', category: 'IMPORT', vendor: '—', status: 'connected', lastSync: '2026-09-29T09:15:00Z', description: 'Generic Excel file import pipeline', descriptionCn: '通用Excel文件导入', protocolsSupported: [], dataTypes: ['manual'] },
];

// --- Devices (linked to data sources) -------------------------------------
export const DEMO_DEVICES: Device[] = [
  { id: 'd-1', serialNumber: 'KW-FP-00124', type: 'Force Plate', status: 'processing', firmware: '2.4.1', battery: 87, lastSync: '2026-09-29T09:42:00Z', location: 'Lab 1', protocolSupport: ['CMJ', 'IMTP', 'SJ', 'Drop Jump'], dataSourceId: 'ds-fp-00124' },
  { id: 'd-2', serialNumber: 'KW-FP-00125', type: 'Force Plate', status: 'offline', firmware: '2.3.8', battery: 0, lastSync: '2026-09-28T14:20:00Z', location: 'Lab 2', protocolSupport: ['CMJ', 'SJ'], dataSourceId: 'ds-fp-00125' },
  { id: 'd-3', serialNumber: 'KW-RADAR-0042', type: 'Radar Gun', status: 'syncing', firmware: '1.8.2', battery: 62, lastSync: '2026-09-29T08:15:00Z', location: 'Field Station', protocolSupport: ['Sprint', 'COD'], dataSourceId: 'ds-radar-0042' },
  { id: 'd-4', serialNumber: 'KW-VID-0008', type: 'Video Analysis', status: 'normal', firmware: '3.1.0', battery: 95, lastSync: '2026-09-29T07:30:00Z', location: 'Pool Deck', protocolSupport: ['Swimming', 'High Jump'], dataSourceId: 'ds-vid-0008' },
];

// --- Protocols (with input/processing/visualization/comparison defs) ------
export const DEMO_PROTOCOLS: TestProtocol[] = [
  {
    id: 'p-cmj-bilateral', key: 'cmj-v2', name: 'CMJ Bilateral', nameCn: '双腿反向纵跳', version: '2.0',
    sportId: 'sport-cmj', deviceType: 'Force Plate', category: 'Jumping',
    input: { dataTypes: ['force'], captureMode: 'force_plate', trials: 3, trialIntervalSec: 30 },
    processing: { steps: ['weight_phase', 'unweighting', 'eccentric', 'concentric', 'flight', 'landing'], eventDetection: ['onset', 'takeoff', 'landing'], formulaRefs: ['jump_height_from_flight_time', 'peak_force', 'rsi_mod', 'asymmetry_index'], processingVersion: '2.1' },
    metrics: [
      { key: 'jump_height', name: 'Jump Height', nameCn: '跳跃高度', unit: 'cm', primary: true, higherIsBetter: true, threshold: { warning: 40, attention: 35 }, description: 'Vertical displacement of center of mass', descriptionCn: '重心垂直位移' },
      { key: 'peak_force', name: 'Peak Force', nameCn: '峰值力', unit: 'N', primary: true, higherIsBetter: true, description: 'Maximum vertical ground reaction force', descriptionCn: '最大垂直地面反作用力' },
      { key: 'rsi_mod', name: 'RSI-mod', nameCn: '反应力量指数', unit: '', primary: true, higherIsBetter: true, description: 'Reactive Strength Index modified', descriptionCn: '改良反应力量指数' },
      { key: 'asymmetry', name: 'Asymmetry', nameCn: '不对称性', unit: '%', primary: true, higherIsBetter: false, threshold: { warning: 7, attention: 10 }, description: 'Left-right force asymmetry', descriptionCn: '左右力不对称性' },
      { key: 'time_to_takeoff', name: 'Time to Takeoff', nameCn: '起跳时间', unit: 'ms', primary: false, higherIsBetter: false, description: 'Eccentric + concentric phase duration', descriptionCn: '离心+向心阶段时长' },
    ],
    validityRules: ['Minimum jump height: 20 cm', 'No excessive forward lean', 'Full foot contact on landing', 'Hands on hips throughout'],
    validityRulesCn: ['最小跳跃高度: 20cm', '无明显前倾', '落地全脚掌接触', '双手叉腰'],
    visualization: [
      { type: 'force_time_curve', title: 'Force-Time Curve', titleCn: '力-时间曲线', config: { xAxis: 'Time (ms)', yAxis: 'Force (N)', showPhases: 'true' } },
      { type: 'metric_cards', title: 'Key Metrics', titleCn: '关键指标', config: {} },
      { type: 'trend', title: 'Performance Trend', titleCn: '表现趋势', config: {} },
      { type: 'trial_comparison', title: 'Trial Comparison', titleCn: '试次对比', config: {} },
    ],
    comparison: [
      { type: 'baseline', label: 'vs Baseline', labelCn: '对比基线' },
      { type: 'personal_best', label: 'vs Personal Best', labelCn: '对比最佳' },
      { type: 'team_average', label: 'vs Team Average', labelCn: '对比队伍平均' },
    ],
    description: 'Standard bilateral countermovement jump with hands on hips.',
    descriptionCn: '标准双腿反向纵跳，双手叉腰。',
    durationMin: 5, difficulty: 'basic',
  },
  {
    id: 'p-sprint-30m', key: 'sprint-30m-v1', name: '30m Sprint', nameCn: '30米冲刺', version: '1.0',
    sportId: 'sport-sprint', deviceType: 'Radar Gun', category: 'Sprinting',
    input: { dataTypes: ['timing'], captureMode: 'timing', trials: 2, trialIntervalSec: 120 },
    processing: { steps: ['split_detection', 'velocity_profile', 'acceleration_profile'], eventDetection: ['start', 'split_5m', 'split_10m', 'split_20m', 'split_30m', 'finish'], formulaRefs: ['split_time', 'peak_velocity', 'acceleration'], processingVersion: '1.1' },
    metrics: [
      { key: 'peak_velocity', name: 'Peak Velocity', nameCn: '峰值速度', unit: 'm/s', primary: true, higherIsBetter: true, threshold: { warning: 9, attention: 8 }, description: 'Maximum sprint velocity', descriptionCn: '最大冲刺速度' },
      { key: 'split_time_30m', name: '30m Split Time', nameCn: '30米分段用时', unit: 's', primary: true, higherIsBetter: false, description: 'Time to cover 30 meters', descriptionCn: '30米用时' },
      { key: 'ground_contact', name: 'Ground Contact', nameCn: '触地时间', unit: 'ms', primary: false, higherIsBetter: false, description: 'Ground contact time during sprint', descriptionCn: '冲刺触地时间' },
      { key: 'flight_time', name: 'Flight Time', nameCn: '腾空时间', unit: 'ms', primary: false, higherIsBetter: true, description: 'Flight time during sprint', descriptionCn: '冲刺腾空时间' },
    ],
    validityRules: ['Stationary start', 'No false start', 'Complete 30m distance'],
    validityRulesCn: ['静止起跑', '无抢跑', '完成30米距离'],
    visualization: [
      { type: 'split_chart', title: 'Split Times', titleCn: '分段用时', config: { splits: '5m,10m,20m,30m' } },
      { type: 'velocity_chart', title: 'Velocity Profile', titleCn: '速度曲线', config: {} },
      { type: 'metric_cards', title: 'Key Metrics', titleCn: '关键指标', config: {} },
      { type: 'trial_comparison', title: 'Trial Comparison', titleCn: '试次对比', config: {} },
    ],
    comparison: [
      { type: 'baseline', label: 'vs Baseline', labelCn: '对比基线' },
      { type: 'personal_best', label: 'vs Personal Best', labelCn: '对比最佳' },
    ],
    description: '30-meter sprint from stationary start with radar tracking.',
    descriptionCn: '从静止起跑的30米冲刺，雷达跟踪。',
    durationMin: 8, difficulty: 'basic',
  },
  {
    id: 'p-swim-50m', key: 'swim-50m-v1', name: '50m Freestyle Analysis', nameCn: '50米自由泳分析', version: '1.0',
    sportId: 'sport-swim', deviceType: 'Video Analysis', category: 'Aquatic',
    input: { dataTypes: ['video', 'position'], captureMode: 'video', trials: 1, trialIntervalSec: 300 },
    processing: { steps: ['video_frame_extract', 'stroke_detection', 'lap_timing'], eventDetection: ['start', 'turn', 'finish', 'stroke_cycle'], formulaRefs: ['stroke_rate', 'stroke_count', 'lap_time', 'dps'], processingVersion: '1.0' },
    metrics: [
      { key: 'stroke_rate', name: 'Stroke Rate', nameCn: '划水频率', unit: '/min', primary: true, higherIsBetter: true, description: 'Swimming stroke rate', descriptionCn: '划水频率' },
      { key: 'stroke_count', name: 'Stroke Count', nameCn: '划水次数', unit: '', primary: true, higherIsBetter: false, description: 'Total strokes per lap', descriptionCn: '每圈划水次数' },
      { key: 'lap_time', name: 'Lap Time', nameCn: '单圈用时', unit: 's', primary: true, higherIsBetter: false, description: 'Time to complete one lap', descriptionCn: '完成一圈用时' },
      { key: 'dps', name: 'Distance per Stroke', nameCn: '每划距离', unit: 'm', primary: false, higherIsBetter: true, description: 'Distance covered per stroke', descriptionCn: '每次划水距离' },
    ],
    validityRules: ['Complete 50m distance', 'Freestyle stroke only', 'No pool wall push-off assistance'],
    validityRulesCn: ['完成50米距离', '仅自由泳', '无池壁蹬借'],
    visualization: [
      { type: 'metric_cards', title: 'Key Metrics', titleCn: '关键指标', config: {} },
      { type: 'trend', title: 'Performance Trend', titleCn: '表现趋势', config: {} },
    ],
    comparison: [
      { type: 'baseline', label: 'vs Baseline', labelCn: '对比基线' },
      { type: 'personal_best', label: 'vs Personal Best', labelCn: '对比最佳' },
    ],
    description: 'Video analysis of 50m freestyle swim.',
    descriptionCn: '50米自由泳视频分析。',
    durationMin: 10, difficulty: 'advanced',
  },
  {
    id: 'p-imtp-standard', key: 'imtp-v1', name: 'IMTP Standard', nameCn: '等长中位拉标准测试', version: '1.0',
    sportId: 'sport-imtp', deviceType: 'Force Plate', category: 'Strength',
    input: { dataTypes: ['force'], captureMode: 'force_plate', trials: 2, trialIntervalSec: 60 },
    processing: { steps: ['baseline_force', 'ramp_phase', 'peak_force', 'rfd_window'], eventDetection: ['onset', 'peak'], formulaRefs: ['peak_force', 'rfd_200ms', 'relative_force'], processingVersion: '1.1' },
    metrics: [
      { key: 'peak_force_imtp', name: 'Peak Force', nameCn: '峰值力', unit: 'N', primary: true, higherIsBetter: true, description: 'Maximum isometric force', descriptionCn: '最大等长力' },
      { key: 'rfd', name: 'RFD', nameCn: '发力率', unit: 'N/s', primary: true, higherIsBetter: true, description: 'Rate of force development at 200ms', descriptionCn: '200ms发力率' },
      { key: 'relative_peak_force', name: 'Relative Peak Force', nameCn: '相对峰值力', unit: 'N/kg', primary: false, higherIsBetter: true, description: 'Peak force normalized to body mass', descriptionCn: '峰值力/体重' },
    ],
    validityRules: ['Body position stable', 'No pre-tension', 'Pull for 5 seconds', 'Knee angle 140°'],
    validityRulesCn: ['身体姿势稳定', '无预张力', '拉5秒', '膝角140°'],
    visualization: [
      { type: 'force_time_curve', title: 'Force-Time Curve', titleCn: '力-时间曲线', config: { xAxis: 'Time (ms)', yAxis: 'Force (N)', showPhases: 'false' } },
      { type: 'metric_cards', title: 'Key Metrics', titleCn: '关键指标', config: {} },
      { type: 'trend', title: 'Performance Trend', titleCn: '表现趋势', config: {} },
    ],
    comparison: [
      { type: 'baseline', label: 'vs Baseline', labelCn: '对比基线' },
      { type: 'personal_best', label: 'vs Personal Best', labelCn: '对比最佳' },
    ],
    description: 'Isometric mid-thigh pull on force plate with fixed bar.',
    descriptionCn: '在测力台上进行等长中位拉，固定杠铃。',
    durationMin: 6, difficulty: 'standard',
  },
  {
    id: 'p-hj-takeoff', key: 'hj-v1', name: 'High Jump Takeoff', nameCn: '跳高起跳分析', version: '1.0',
    sportId: 'sport-hj', deviceType: 'Force Plate', category: 'Jumping',
    input: { dataTypes: ['manual'], captureMode: 'manual', trials: 3, trialIntervalSec: 180 },
    processing: { steps: ['attempt_record', 'bar_height_check', 'approach_velocity_calc'], eventDetection: ['takeoff', 'bar_cross', 'landing'], formulaRefs: ['takeoff_force', 'approach_velocity', 'bar_clearance'], processingVersion: '1.0' },
    metrics: [
      { key: 'takeoff_force', name: 'Takeoff Force', nameCn: '起跳力', unit: 'N', primary: true, higherIsBetter: true, description: 'Force during high jump takeoff', descriptionCn: '跳高起跳力' },
      { key: 'approach_velocity', name: 'Approach Velocity', nameCn: '助跑速度', unit: 'm/s', primary: true, higherIsBetter: true, description: 'Velocity during approach run', descriptionCn: '助跑速度' },
      { key: 'bar_clearance', name: 'Bar Clearance', nameCn: '过杆高度', unit: 'm', primary: true, higherIsBetter: true, description: 'Height of bar cleared', descriptionCn: '过杆高度' },
    ],
    validityRules: ['Complete Fosbury Flop technique', 'Valid approach curve', 'Measured bar height'],
    validityRulesCn: ['完成背越式技术', '有效弧线助跑', '测量横杆高度'],
    visualization: [
      { type: 'attempt_sequence', title: 'Attempt Sequence', titleCn: '试跳序列', config: {} },
      { type: 'bar_progression', title: 'Height Progression', titleCn: '高度进展', config: {} },
      { type: 'metric_cards', title: 'Key Metrics', titleCn: '关键指标', config: {} },
    ],
    comparison: [
      { type: 'baseline', label: 'vs Baseline', labelCn: '对比基线' },
      { type: 'personal_best', label: 'vs Personal Best', labelCn: '对比最佳' },
    ],
    description: 'High jump takeoff force analysis on force plate.',
    descriptionCn: '跳高起跳力分析，使用测力台。',
    durationMin: 12, difficulty: 'advanced',
  },
  {
    id: 'p-cod-505', key: 'cod-505-v1', name: '505 Agility Test', nameCn: '505变向测试', version: '1.0',
    sportId: 'sport-cod', deviceType: 'Timing Gate', category: 'Agility',
    input: { dataTypes: ['timing'], captureMode: 'timing', trials: 3, trialIntervalSec: 60 },
    processing: { steps: ['gate_timing', 'turn_detection', 'deceleration_calc', 'reacceleration_calc'], eventDetection: ['start', '15m_split', 'turn', '5m_return', 'finish'], formulaRefs: ['cod_time', 'deceleration', 'reacceleration'], processingVersion: '1.0' },
    metrics: [
      { key: 'cod_time', name: 'COD Time', nameCn: '变向时间', unit: 's', primary: true, higherIsBetter: false, description: 'Change of direction time', descriptionCn: '变向时间' },
      { key: 'deceleration', name: 'Deceleration', nameCn: '减速能力', unit: 'm/s²', primary: false, higherIsBetter: true, description: 'Deceleration during COD', descriptionCn: '变向减速能力' },
      { key: 'reacceleration', name: 'Reacceleration', nameCn: '再加速能力', unit: 'm/s²', primary: false, higherIsBetter: true, description: 'Reacceleration after COD', descriptionCn: '变向后再加速能力' },
    ],
    validityRules: ['Sprint 15m, turn, sprint 5m back', 'Touch line with foot', 'No sliding'],
    validityRulesCn: ['冲刺15米，折返，冲刺5米', '脚触线', '无滑行'],
    visualization: [
      { type: 'split_chart', title: 'Split Times', titleCn: '分段用时', config: { splits: '15m,turn,5m' } },
      { type: 'metric_cards', title: 'Key Metrics', titleCn: '关键指标', config: {} },
      { type: 'trial_comparison', title: 'Trial Comparison', titleCn: '试次对比', config: {} },
    ],
    comparison: [
      { type: 'baseline', label: 'vs Baseline', labelCn: '对比基线' },
      { type: 'personal_best', label: 'vs Personal Best', labelCn: '对比最佳' },
    ],
    description: '505 change of direction agility test with timing gates.',
    descriptionCn: '505变向敏捷测试，使用计时门。',
    durationMin: 7, difficulty: 'standard',
  },
];

// --- Users ----------------------------------------------------------------
export const DEMO_USERS: User[] = [
  { id: 'u-1', name: 'Li Wei', email: 'admin@kunwei.com', role: 'Organization Admin', roleCn: '组织管理员', status: 'active', teamAccess: ['team-1', 'team-2', 'team-3'], lastActive: '2026-09-29T09:45:00Z' },
  { id: 'u-2', name: '陈莎拉', email: 'sarah@kunwei.com', role: 'Sports Scientist', roleCn: '体育科学家', status: 'active', teamAccess: ['team-1'], lastActive: '2026-09-29T08:30:00Z' },
  { id: 'u-3', name: '王迈克', email: 'mike@kunwei.com', role: 'Coach', roleCn: '教练', status: 'active', teamAccess: ['team-1', 'team-2'], lastActive: '2026-09-28T17:00:00Z' },
  { id: 'u-4', name: '张丽莎', email: 'lisa@kunwei.com', role: 'Physiotherapist', roleCn: '物理治疗师', status: 'active', teamAccess: ['team-1'], lastActive: '2026-09-29T07:15:00Z' },
  { id: 'u-5', name: '刘汤姆', email: 'tom@kunwei.com', role: 'Viewer', roleCn: '查看者', status: 'inactive', teamAccess: ['team-3'], lastActive: '2026-09-20T10:00:00Z' },
];

// --- Import Jobs ----------------------------------------------------------
export const DEMO_IMPORTS: ImportJob[] = [
  { id: 'imp-1', fileName: 'sprint_trials_sept.csv', source: 'csv', status: 'completed', progress: 100, totalRows: 240, processedRows: 238, matchedColumns: 8, unmatchedColumns: 1, createdAt: '2026-09-28T14:30:00Z', sportId: 'sport-sprint', dataSourceId: 'ds-csv-import' },
  { id: 'imp-2', fileName: 'garmin_team2_fit.json', source: 'garmin', status: 'processing', progress: 65, totalRows: 1200, processedRows: 780, matchedColumns: 12, unmatchedColumns: 0, createdAt: '2026-09-29T08:00:00Z', sportId: 'sport-sprint', dataSourceId: 'ds-garmin' },
  { id: 'imp-3', fileName: 'hawkin_cmj_export.xlsx', source: 'hawkin', status: 'mapping', progress: 20, totalRows: 180, processedRows: 0, matchedColumns: 5, unmatchedColumns: 3, createdAt: '2026-09-29T09:15:00Z', sportId: 'sport-cmj', dataSourceId: 'ds-excel-import' },
  { id: 'imp-4', fileName: 'whoop_recovery.csv', source: 'whoop', status: 'failed', progress: 0, totalRows: 0, processedRows: 0, matchedColumns: 0, unmatchedColumns: 6, createdAt: '2026-09-29T07:00:00Z', sportId: 'sport-cmj', dataSourceId: 'ds-csv-import' },
];

// --- Integrations (kept for backward compat, now also as DataSources) ------
export const DEMO_INTEGRATIONS: Integration[] = [
  { id: 'int-1', name: 'Hawkin Dynamics', nameCn: 'Hawkin动力学', category: 'Force Plate', icon: 'Zap', status: 'connected', lastSync: '2026-09-29T06:00:00Z', description: 'Import force plate data from Hawkin Dynamics cloud' },
  { id: 'int-2', name: 'Garmin Connect', nameCn: 'Garmin Connect', category: 'Wearable', icon: 'Watch', status: 'connected', lastSync: '2026-09-29T08:00:00Z', description: 'Sync athlete training data from Garmin devices' },
  { id: 'int-3', name: 'WHOOP', nameCn: 'WHOOP', category: 'Recovery', icon: 'Heart', status: 'error', lastSync: '2026-09-28T22:00:00Z', description: 'Recovery and strain metrics from WHOOP straps' },
  { id: 'int-4', name: 'Smartabase', nameCn: 'Smartabase', category: 'AMS', icon: 'Database', status: 'disconnected', lastSync: null, description: 'Athlete management system integration' },
  { id: 'int-5', name: 'TeamBuildr', nameCn: 'TeamBuildr', category: 'Strength', icon: 'Dumbbell', status: 'disconnected', lastSync: null, description: 'Strength training log integration' },
];

// --- Sync Logs ------------------------------------------------------------
export const DEMO_SYNC_LOGS: SyncLog[] = [
  { id: 'sync-1', timestamp: '2026-09-29T09:42:00Z', source: 'KW-FP-00124', direction: 'inbound', records: 12, status: 'success', message: 'Device sync completed' },
  { id: 'sync-2', timestamp: '2026-09-29T08:00:00Z', source: 'Garmin Connect', direction: 'inbound', records: 340, status: 'success', message: 'Training sessions synced' },
  { id: 'sync-3', timestamp: '2026-09-29T07:15:00Z', source: 'KW-RADAR-0042', direction: 'inbound', records: 8, status: 'partial', message: '2 records failed validation' },
  { id: 'sync-4', timestamp: '2026-09-28T22:00:00Z', source: 'WHOOP', direction: 'inbound', records: 0, status: 'failed', message: 'Authentication token expired' },
  { id: 'sync-5', timestamp: '2026-09-28T18:30:00Z', source: 'Kunwei API', direction: 'outbound', records: 56, status: 'success', message: 'Exported to Smartabase' },
];

// --- Sync Jobs (async API lifecycle: 202 Accepted semantics) --------------
export const DEMO_SYNC_JOBS: SyncJob[] = [
  { id: 'sj-1', sessionStatus: 'PUBLISHED', sourceId: 'ds-fp-00124', sourceName: 'KW-FP-00124', subjectId: 'a-1', protocolId: 'p-cmj-bilateral', idempotencyKey: 'cmj-a1-20260929-001', startedAt: '2026-09-29T09:42:00Z', updatedAt: '2026-09-29T09:42:05Z', retryAfter: 2, statusUrl: '/api/v1/test-sessions/s-1/status', recordsProcessed: 3, recordsTotal: 3, errorMessage: null, webhookUrl: '/api/v1/webhooks' },
  { id: 'sj-2', sessionStatus: 'PUBLISHED', sourceId: 'ds-radar-0042', sourceName: 'KW-RADAR-0042', subjectId: 'a-2', protocolId: 'p-sprint-30m', idempotencyKey: 'sprint-a2-20260929-001', startedAt: '2026-09-29T09:37:00Z', updatedAt: '2026-09-29T09:37:08Z', retryAfter: 2, statusUrl: '/api/v1/test-sessions/s-4/status', recordsProcessed: 2, recordsTotal: 2, errorMessage: null, webhookUrl: '/api/v1/webhooks' },
  { id: 'sj-3', sessionStatus: 'PROCESSING', sourceId: 'ds-garmin', sourceName: 'Garmin Connect', subjectId: 'a-8', protocolId: 'p-sprint-30m', idempotencyKey: 'sprint-a8-20260929-001', startedAt: '2026-09-29T09:30:00Z', updatedAt: '2026-09-29T09:31:00Z', retryAfter: 3, statusUrl: '/api/v1/test-sessions/sj-3/status', recordsProcessed: 1, recordsTotal: 2, errorMessage: null, webhookUrl: '/api/v1/webhooks' },
  { id: 'sj-4', sessionStatus: 'VALIDATION_FAILED', sourceId: 'ds-whoop', sourceName: 'WHOOP', subjectId: 'a-5', protocolId: 'p-imtp-standard', idempotencyKey: 'whoop-a5-20260929-001', startedAt: '2026-09-28T22:00:00Z', updatedAt: '2026-09-28T22:01:00Z', retryAfter: 0, statusUrl: '/api/v1/test-sessions/sj-4/status', recordsProcessed: 0, recordsTotal: 12, errorMessage: 'Authentication token expired', webhookUrl: null },
  { id: 'sj-5', sessionStatus: 'QUEUED', sourceId: 'ds-kunwei-sprint', sourceName: 'Kunwei Sprint App', subjectId: 'a-7', protocolId: 'p-cod-505', idempotencyKey: 'cod-a7-20260930-001', startedAt: '2026-09-30T08:00:00Z', updatedAt: '2026-09-30T08:00:00Z', retryAfter: 5, statusUrl: '/api/v1/test-sessions/sj-5/status', recordsProcessed: 0, recordsTotal: 3, errorMessage: null, webhookUrl: '/api/v1/webhooks' },
  { id: 'sj-6', sessionStatus: 'RECEIVED', sourceId: 'ds-hawkin', sourceName: 'Hawkin Dynamics', subjectId: 'a-3', protocolId: 'p-cmj-bilateral', idempotencyKey: 'cmj-a3-20260930-001', startedAt: '2026-09-30T07:45:00Z', updatedAt: '2026-09-30T07:45:02Z', retryAfter: 2, statusUrl: '/api/v1/test-sessions/sj-6/status', recordsProcessed: 0, recordsTotal: 3, errorMessage: null, webhookUrl: '/api/v1/webhooks' },
];

// --- Heartbeats -----------------------------------------------------------
export const DEMO_HEARTBEATS: Heartbeat[] = [
  { deviceId: 'd-1', appVersion: '2.4.1', online: true, lastSyncAt: '2026-09-29T09:42:00Z', queuedSessions: 0, storageAvailable: 124_000_000_000, battery: 87 },
  { deviceId: 'd-2', appVersion: '2.3.8', online: false, lastSyncAt: '2026-09-28T14:20:00Z', queuedSessions: 2, storageAvailable: 98_000_000_000, battery: 0 },
  { deviceId: 'd-3', appVersion: '1.8.2', online: true, lastSyncAt: '2026-09-29T08:15:00Z', queuedSessions: 1, storageAvailable: 64_000_000_000, battery: 62 },
  { deviceId: 'd-4', appVersion: '3.1.0', online: true, lastSyncAt: '2026-09-29T07:30:00Z', queuedSessions: 0, storageAvailable: 256_000_000_000, battery: 95 },
];

// --- Datasets -------------------------------------------------------------
export const DEMO_DATASETS: Dataset[] = [
  { id: 'ds-set-1', name: 'Zhang Wei — CMJ Longitudinal', nameCn: '张伟 — CMJ纵向数据', type: 'longitudinal', subjectIds: ['a-1'], protocolIds: ['p-cmj-bilateral'], sourceId: 'ds-fp-00124', measurementCount: 24, createdAt: '2026-01-15T10:00:00Z', status: 'active' },
  { id: 'ds-set-2', name: 'Sprint Team — September Block', nameCn: '冲刺队 — 九月数据集', type: 'session', subjectIds: ['a-2', 'a-8'], protocolIds: ['p-sprint-30m'], sourceId: 'ds-radar-0042', measurementCount: 48, createdAt: '2026-09-01T08:00:00Z', status: 'active' },
  { id: 'ds-set-3', name: 'Hawkin CMJ Import — Sept', nameCn: 'Hawkin CMJ导入 — 九月', type: 'import', subjectIds: ['a-3'], protocolIds: ['p-cmj-bilateral'], sourceId: 'ds-hawkin', measurementCount: 18, createdAt: '2026-09-29T09:15:00Z', status: 'processing' },
  { id: 'ds-set-4', name: 'Swim Team — Video Analysis', nameCn: '游泳队 — 视频分析', type: 'device_stream', subjectIds: ['a-6'], protocolIds: ['p-swim-50m'], sourceId: 'ds-vid-0008', measurementCount: 12, createdAt: '2026-09-01T07:30:00Z', status: 'active' },
];

// --- Raw & Processed Measurements -----------------------------------------
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

export const DEMO_RAW_MEASUREMENTS: RawMeasurement[] = [
  { id: 'rm-1', sessionId: 's-1', trialNumber: 1, dataType: 'force', sourceDeviceId: 'd-1', canonical: true, payload: { force: generateForceTimeData(0) }, sampleRateHz: 1000, durationMs: 200 },
  { id: 'rm-2', sessionId: 's-1', trialNumber: 2, dataType: 'force', sourceDeviceId: 'd-1', canonical: true, payload: { force: generateForceTimeData(5) }, sampleRateHz: 1000, durationMs: 200 },
  { id: 'rm-3', sessionId: 's-4', trialNumber: 1, dataType: 'timing', sourceDeviceId: 'd-3', canonical: true, payload: { velocity: [0, 2.1, 4.5, 7.2, 9.8, 10.2], split: [0, 1.2, 2.1, 3.2, 4.02] }, sampleRateHz: 100, durationMs: 4020 },
  { id: 'rm-4', sessionId: 's-7', trialNumber: 1, dataType: 'timing', sourceDeviceId: 'd-3', canonical: true, payload: { time: [0, 1.8, 2.0, 2.22] }, sampleRateHz: 1000, durationMs: 2220 },
];

export const DEMO_PROCESSED_MEASUREMENTS: ProcessedMeasurement[] = [
  { id: 'pm-1', sessionId: 's-1', trialNumber: 1, fromRawId: 'rm-1', processingVersion: '2.1', events: [{ name: 'onset', timeMs: 40 }, { name: 'takeoff', timeMs: 460 }, { name: 'landing', timeMs: 680 }], segments: [{ name: 'eccentric', startMs: 40, endMs: 280 }, { name: 'concentric', startMs: 280, endMs: 460 }, { name: 'flight', startMs: 460, endMs: 680 }] },
  { id: 'pm-2', sessionId: 's-1', trialNumber: 2, fromRawId: 'rm-2', processingVersion: '2.1', events: [{ name: 'onset', timeMs: 38 }, { name: 'takeoff', timeMs: 455 }, { name: 'landing', timeMs: 675 }], segments: [{ name: 'eccentric', startMs: 38, endMs: 275 }, { name: 'concentric', startMs: 275, endMs: 455 }, { name: 'flight', startMs: 455, endMs: 675 }] },
  { id: 'pm-3', sessionId: 's-4', trialNumber: 1, fromRawId: 'rm-3', processingVersion: '1.1', events: [{ name: 'start', timeMs: 0 }, { name: 'split_5m', timeMs: 1200 }, { name: 'split_10m', timeMs: 2100 }, { name: 'split_20m', timeMs: 3200 }, { name: 'finish', timeMs: 4020 }], segments: [{ name: 'acceleration', startMs: 0, endMs: 2100 }, { name: 'max_velocity', startMs: 2100, endMs: 4020 }] },
];

// --- Test Sessions (with full lifecycle + data quality + source) ----------
function goodQuality(): DataQuality {
  return { status: 'complete', issues: [], validationPassed: true };
}
function warningQuality(issue: string): DataQuality {
  return { status: 'warning', issues: [issue], validationPassed: true };
}

const PUBLISHED: SessionStatus = 'PUBLISHED';

export const DEMO_SESSIONS: TestSession[] = [
  {
    id: 's-1', athleteId: 'a-1', protocolId: 'p-cmj-bilateral', protocolName: 'CMJ Bilateral', sportId: 'sport-cmj',
    date: '2026-09-29T09:42:00Z', deviceSerial: 'KW-FP-00124', operatorName: '王迈克',
    status: 'normal', sessionStatus: PUBLISHED, source: 'device', sourceId: 'ds-fp-00124', dataSourceId: 'ds-fp-00124',
    idempotencyKey: 'cmj-a1-20260929-001', startedAt: '2026-09-29T09:42:00Z', completedAt: '2026-09-29T09:45:00Z',
    statusUrl: '/api/v1/test-sessions/s-1/status',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 51.8, peak_force: 2105, rsi_mod: 0.39, asymmetry: 5.8 }, forceTimeData: generateForceTimeData(0), rawMeasurementId: 'rm-1', processedMeasurementId: 'pm-1' },
      { number: 2, status: 'valid', values: { jump_height: 52.4, peak_force: 2134, rsi_mod: 0.41, asymmetry: 6.2 }, forceTimeData: generateForceTimeData(5), rawMeasurementId: 'rm-2', processedMeasurementId: 'pm-2' },
      { number: 3, status: 'invalid', reason: 'Insufficient countermovement depth', values: {}, forceTimeData: generateForceTimeData(-10) },
    ],
    summary: { jump_height: 52.4, peak_force: 2134, rsi_mod: 0.41, asymmetry: 6.2, time_to_takeoff: 920 },
    qualityFlag: 'valid', dataQuality: goodQuality(), processingVersion: '2.1',
  },
  {
    id: 's-2', athleteId: 'a-1', protocolId: 'p-imtp-standard', protocolName: 'IMTP Standard', sportId: 'sport-imtp',
    date: '2026-09-25T10:15:00Z', deviceSerial: 'KW-FP-00124', operatorName: '陈莎拉',
    status: 'normal', sessionStatus: PUBLISHED, source: 'device', sourceId: 'ds-fp-00124', dataSourceId: 'ds-fp-00124',
    idempotencyKey: 'imtp-a1-20260925-001', startedAt: '2026-09-25T10:15:00Z', completedAt: '2026-09-25T10:18:00Z',
    statusUrl: '/api/v1/test-sessions/s-2/status',
    trials: [
      { number: 1, status: 'valid', values: { peak_force_imtp: 2950, rfd: 5700, relative_peak_force: 37.8 }, forceTimeData: generateForceTimeData(2) },
      { number: 2, status: 'valid', values: { peak_force_imtp: 2980, rfd: 5820, relative_peak_force: 38.2 }, forceTimeData: generateForceTimeData(8) },
    ],
    summary: { peak_force_imtp: 2980, rfd: 5820, relative_peak_force: 38.2 },
    qualityFlag: 'valid', dataQuality: goodQuality(), processingVersion: '2.1',
  },
  {
    id: 's-3', athleteId: 'a-1', protocolId: 'p-cmj-bilateral', protocolName: 'CMJ Bilateral', sportId: 'sport-cmj',
    date: '2026-09-20T09:30:00Z', deviceSerial: 'KW-FP-00124', operatorName: '王迈克',
    status: 'normal', sessionStatus: PUBLISHED, source: 'device', sourceId: 'ds-fp-00124', dataSourceId: 'ds-fp-00124',
    idempotencyKey: 'cmj-a1-20260920-001', startedAt: '2026-09-20T09:30:00Z', completedAt: '2026-09-20T09:33:00Z',
    statusUrl: '/api/v1/test-sessions/s-3/status',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 50.8, peak_force: 2080, rsi_mod: 0.38, asymmetry: 7.0 }, forceTimeData: generateForceTimeData(-3) },
      { number: 2, status: 'valid', values: { jump_height: 50.2, peak_force: 2060, rsi_mod: 0.37, asymmetry: 6.5 }, forceTimeData: generateForceTimeData(1) },
      { number: 3, status: 'valid', values: { jump_height: 49.9, peak_force: 2045, rsi_mod: 0.36, asymmetry: 6.8 }, forceTimeData: generateForceTimeData(4) },
    ],
    summary: { jump_height: 50.8, peak_force: 2080, rsi_mod: 0.38, asymmetry: 6.8, time_to_takeoff: 950 },
    qualityFlag: 'valid', dataQuality: goodQuality(), processingVersion: '2.1',
  },
  {
    id: 's-4', athleteId: 'a-2', protocolId: 'p-sprint-30m', protocolName: '30m Sprint', sportId: 'sport-sprint',
    date: '2026-09-29T09:37:00Z', deviceSerial: 'KW-RADAR-0042', operatorName: '王迈克',
    status: 'warning', sessionStatus: PUBLISHED, source: 'device', sourceId: 'ds-radar-0042', dataSourceId: 'ds-radar-0042',
    idempotencyKey: 'sprint-a2-20260929-001', startedAt: '2026-09-29T09:37:00Z', completedAt: '2026-09-29T09:42:00Z',
    statusUrl: '/api/v1/test-sessions/s-4/status',
    trials: [
      { number: 1, status: 'valid', values: { peak_velocity: 10.2, split_time_30m: 4.02, ground_contact: 88 }, rawMeasurementId: 'rm-3', processedMeasurementId: 'pm-3' },
      { number: 2, status: 'valid', values: { peak_velocity: 10.3, split_time_30m: 3.98, ground_contact: 85 } },
    ],
    summary: { peak_velocity: 10.3, split_time_30m: 3.98, ground_contact: 85 },
    qualityFlag: 'questionable', dataQuality: warningQuality('Ground contact time slightly elevated on trial 1'), processingVersion: '2.1',
  },
  {
    id: 's-5', athleteId: 'a-3', protocolId: 'p-cmj-bilateral', protocolName: 'CMJ Bilateral', sportId: 'sport-cmj',
    date: '2026-09-29T09:15:00Z', deviceSerial: 'KW-FP-00124', operatorName: '王迈克',
    status: 'normal', sessionStatus: PUBLISHED, source: 'device', sourceId: 'ds-fp-00124', dataSourceId: 'ds-fp-00124',
    idempotencyKey: 'cmj-a3-20260929-001', startedAt: '2026-09-29T09:15:00Z', completedAt: '2026-09-29T09:18:00Z',
    statusUrl: '/api/v1/test-sessions/s-5/status',
    trials: [
      { number: 1, status: 'valid', values: { jump_height: 48.1, peak_force: 2100, rsi_mod: 0.39, asymmetry: 4.5 }, forceTimeData: generateForceTimeData(6) },
      { number: 2, status: 'valid', values: { jump_height: 47.6, peak_force: 2080, rsi_mod: 0.38, asymmetry: 5.0 }, forceTimeData: generateForceTimeData(3) },
      { number: 3, status: 'valid', values: { jump_height: 47.9, peak_force: 2090, rsi_mod: 0.38, asymmetry: 4.8 }, forceTimeData: generateForceTimeData(7) },
    ],
    summary: { jump_height: 48.1, peak_force: 2100, rsi_mod: 0.39, asymmetry: 4.8, time_to_takeoff: 880 },
    qualityFlag: 'valid', dataQuality: goodQuality(), processingVersion: '2.1',
  },
  {
    id: 's-6', athleteId: 'a-6', protocolId: 'p-swim-50m', protocolName: '50m Freestyle Analysis', sportId: 'sport-swim',
    date: '2026-09-28T14:00:00Z', deviceSerial: 'KW-VID-0008', operatorName: '陈莎拉',
    status: 'normal', sessionStatus: PUBLISHED, source: 'device', sourceId: 'ds-vid-0008', dataSourceId: 'ds-vid-0008',
    idempotencyKey: 'swim-a6-20260928-001', startedAt: '2026-09-28T14:00:00Z', completedAt: '2026-09-28T14:10:00Z',
    statusUrl: '/api/v1/test-sessions/s-6/status',
    trials: [
      { number: 1, status: 'valid', values: { stroke_rate: 50, stroke_count: 36, lap_time: 25.2, dps: 2.18 } },
    ],
    summary: { stroke_rate: 50, stroke_count: 36, lap_time: 25.2, dps: 2.18 },
    qualityFlag: 'valid', dataQuality: goodQuality(), processingVersion: '1.0',
  },
  {
    id: 's-7', athleteId: 'a-7', protocolId: 'p-cod-505', protocolName: '505 Agility Test', sportId: 'sport-cod',
    date: '2026-09-27T15:30:00Z', deviceSerial: 'KW-RADAR-0042', operatorName: '王迈克',
    status: 'normal', sessionStatus: PUBLISHED, source: 'device', sourceId: 'ds-radar-0042', dataSourceId: 'ds-radar-0042',
    idempotencyKey: 'cod-a7-20260927-001', startedAt: '2026-09-27T15:30:00Z', completedAt: '2026-09-27T15:37:00Z',
    statusUrl: '/api/v1/test-sessions/s-7/status',
    trials: [
      { number: 1, status: 'valid', values: { cod_time: 2.22, deceleration: 5.3, reacceleration: 5.6 }, rawMeasurementId: 'rm-4' },
      { number: 2, status: 'valid', values: { cod_time: 2.20, deceleration: 5.4, reacceleration: 5.7 } },
      { number: 3, status: 'valid', values: { cod_time: 2.25, deceleration: 5.2, reacceleration: 5.5 } },
    ],
    summary: { cod_time: 2.20, deceleration: 5.4, reacceleration: 5.7 },
    qualityFlag: 'valid', dataQuality: goodQuality(), processingVersion: '1.0',
  },
];

// --- Results (generic, protocol-driven) -----------------------------------
function buildResultMetrics(session: TestSession, protocol: TestProtocol | undefined, athlete: Athlete | undefined): ResultMetric[] {
  if (!protocol) return [];
  return protocol.metrics.map((pm) => {
    const value = session.summary[pm.key] ?? 0;
    const baseline = athlete?.baseline[pm.key];
    const pb = athlete?.personalBest[pm.key];
    return {
      key: pm.key,
      name: pm.name,
      nameCn: pm.nameCn,
      unit: pm.unit,
      value,
      primary: pm.primary,
      threshold: pm.threshold,
      higherIsBetter: pm.higherIsBetter,
      comparison: {
        baseline,
        personalBest: pb,
        deltaFromBaseline: baseline !== undefined ? value - baseline : undefined,
        deltaFromBest: pb !== undefined ? value - pb : undefined,
      },
    } as ResultMetric;
  });
}

function buildVisualizations(session: TestSession, protocol: TestProtocol | undefined): Result['visualizations'] {
  if (!protocol) return [];
  return protocol.visualization.map((v) => {
    const data: Record<string, unknown> = {};
    if (v.type === 'force_time_curve') {
      const trial = session.trials.find((t) => t.forceTimeData && t.status === 'valid');
      if (trial?.forceTimeData) data.forceTimeData = trial.forceTimeData;
      data.bodyWeight = 780;
    } else if (v.type === 'split_chart' || v.type === 'velocity_chart') {
      data.trials = session.trials.filter((t) => t.status === 'valid').map((t) => t.values);
    } else if (v.type === 'attempt_sequence' || v.type === 'bar_progression') {
      data.attempts = session.trials.map((t) => ({ number: t.number, status: t.status, values: t.values }));
    } else {
      data.summary = session.summary;
    }
    return { type: v.type, title: v.title, titleCn: v.titleCn, data };
  });
}

function buildResults(): Result[] {
  return DEMO_SESSIONS.map((session) => {
    const protocol = DEMO_PROTOCOLS.find((p) => p.id === session.protocolId);
    const athlete = DEMO_ATHLETES.find((a) => a.id === session.athleteId);
    const metrics = buildResultMetrics(session, protocol, athlete);
    const primaryMetric = metrics.find((m) => m.primary) ?? metrics[0];
    const rawIds = session.trials.map((t) => t.rawMeasurementId).filter(Boolean) as string[];
    return {
      sessionId: session.id,
      protocolId: session.protocolId,
      subjectId: session.athleteId,
      primaryMetric,
      metrics,
      visualizations: buildVisualizations(session, protocol),
      trialResults: session.trials.map((t) => ({ number: t.number, status: t.status, values: t.values })),
      analysisNotes: session.dataQuality.issues.length > 0 ? session.dataQuality.issues : [],
      rawDataRef: { measurementIds: rawIds, datasetId: null },
    } as Result;
  });
}

export const DEMO_RESULTS: Result[] = buildResults();

// --- Dashboard Widgets (configurable, not hardcoded CMJ) ------------------
export const DEMO_DASHBOARD_WIDGETS: DashboardWidget[] = [
  { id: 'w-1', type: 'metric-card', title: 'Athletes', titleCn: '运动员', config: {} },
  { id: 'w-2', type: 'metric-card', title: 'Tested This Week', titleCn: '本周已测', config: {} },
  { id: 'w-3', type: 'metric-card', title: 'Attention Flags', titleCn: '关注标记', config: {} },
  { id: 'w-4', type: 'metric-card', title: 'Avg Performance', titleCn: '平均表现', config: {} },
  { id: 'w-5', type: 'trend-chart', title: 'Team Performance Trend', titleCn: '队伍表现趋势', config: {} },
  { id: 'w-6', type: 'distribution', title: 'Status Distribution', titleCn: '状态分布', config: {} },
  { id: 'w-7', type: 'ranking', title: 'Athlete Ranking', titleCn: '运动员排名', config: {} },
  { id: 'w-8', type: 'activity-feed', title: 'Recent Test Activity', titleCn: '最近测试活动', config: {} },
  { id: 'w-9', type: 'sync-status', title: 'Sync Status', titleCn: '同步状态', config: {} },
  { id: 'w-10', type: 'attention-list', title: 'Athletes Needing Attention', titleCn: '需关注运动员', config: {} },
];

// --- Report Definitions ---------------------------------------------------
export const DEMO_REPORTS: ReportDefinition[] = [
  { id: 'r-1', type: 'performance', name: 'Q3 Performance Summary', nameCn: 'Q3表现总结', scope: 'team', subjectIds: [], teamIds: ['team-1'], protocolIds: ['p-cmj-bilateral', 'p-sprint-30m'], metricKeys: ['jump_height', 'peak_velocity', 'rsi_mod'], timeRange: { from: '2026-07-01', to: '2026-09-30' }, visualizations: ['trend', 'distribution', 'comparison'], status: 'generated', createdAt: '2026-09-29T10:00:00Z', createdBy: 'u-1', observations: ['Jump height improved 4.2% across team', 'Sprint velocity stable'] },
  { id: 'r-2', type: 'biomechanics', name: 'Zhang Wei — CMJ Biomechanics', nameCn: '张伟 — CMJ生物力学', scope: 'subject', subjectIds: ['a-1'], teamIds: [], protocolIds: ['p-cmj-bilateral'], metricKeys: ['jump_height', 'peak_force', 'rsi_mod', 'asymmetry'], timeRange: { from: '2026-06-01', to: '2026-09-30' }, visualizations: ['force_time_curve', 'trend', 'trial_comparison'], status: 'generated', createdAt: '2026-09-29T11:00:00Z', createdBy: 'u-2', observations: ['Asymmetry trending upward — monitor', 'Peak force consistent with baseline'] },
  { id: 'r-3', type: 'functional', name: 'RTP Assessment — Chen Jie', nameCn: '康复回归评估 — 陈杰', scope: 'subject', subjectIds: ['a-4'], teamIds: [], protocolIds: ['p-hj-takeoff'], metricKeys: ['takeoff_force', 'approach_velocity', 'bar_clearance'], timeRange: { from: '2026-08-01', to: '2026-09-30' }, visualizations: ['trend', 'attempt_sequence'], status: 'draft', createdAt: '2026-09-30T08:00:00Z', createdBy: 'u-4', observations: [] },
  { id: 'r-4', type: 'test', name: 'Weekly Test Report — Sprint Squad', nameCn: '周测试报告 — 冲刺组', scope: 'team', subjectIds: [], teamIds: ['team-2'], protocolIds: ['p-sprint-30m', 'p-cod-505'], metricKeys: ['peak_velocity', 'split_time_30m', 'cod_time'], timeRange: { from: '2026-09-23', to: '2026-09-30' }, visualizations: ['split_chart', 'trend'], status: 'scheduled', createdAt: '2026-09-28T16:00:00Z', createdBy: 'u-3', observations: [] },
];

// --- Lookup Helpers -------------------------------------------------------
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
      const metric = getMetric(key);
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

export function getResultForSession(sessionId: string): Result | undefined {
  return DEMO_RESULTS.find((r) => r.sessionId === sessionId);
}

export function getDataSource(id: string): DataSource | undefined {
  return DEMO_DATA_SOURCES.find((s) => s.id === id);
}
