import type { MetricDefinition } from './types';

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  { key: 'jump_height', name: 'Jump Height', nameCn: '跳跃高度', unit: 'cm', primary: true, description: 'Vertical displacement of center of mass', higherIsBetter: true },
  { key: 'peak_force', name: 'Peak Force', nameCn: '峰值力', unit: 'N', primary: true, description: 'Maximum vertical ground reaction force', higherIsBetter: true },
  { key: 'peak_power', name: 'Peak Power', nameCn: '峰值功率', unit: 'W', primary: false, description: 'Maximum instantaneous power output', higherIsBetter: true },
  { key: 'rsi_mod', name: 'RSI-mod', nameCn: '反应力量指数', unit: '', primary: true, description: 'Reactive Strength Index modified', higherIsBetter: true },
  { key: 'asymmetry', name: 'Asymmetry', nameCn: '不对称性', unit: '%', primary: true, description: 'Left-right force asymmetry', higherIsBetter: false },
  { key: 'time_to_takeoff', name: 'Time to Takeoff', nameCn: '起跳时间', unit: 'ms', primary: false, description: 'Eccentric + concentric phase duration', higherIsBetter: false },
  { key: 'peak_force_imtp', name: 'Peak Force', nameCn: '峰值力', unit: 'N', primary: true, description: 'Maximum isometric force', higherIsBetter: true },
  { key: 'rfd', name: 'RFD', nameCn: '发力率', unit: 'N/s', primary: true, description: 'Rate of force development at 200ms', higherIsBetter: true },
  { key: 'relative_peak_force', name: 'Relative Peak Force', nameCn: '相对峰值力', unit: 'N/kg', primary: false, description: 'Peak force normalized to body mass', higherIsBetter: true },
  { key: 'peak_velocity', name: 'Peak Velocity', nameCn: '峰值速度', unit: 'm/s', primary: true, description: 'Maximum sprint velocity', higherIsBetter: true },
  { key: 'split_time_30m', name: '30m Split Time', nameCn: '30米分段', unit: 's', primary: true, description: 'Time to cover 30 meters', higherIsBetter: false },
  { key: 'ground_contact', name: 'Ground Contact', nameCn: '触地时间', unit: 'ms', primary: false, description: 'Ground contact time during sprint', higherIsBetter: false },
  { key: 'flight_time', name: 'Flight Time', nameCn: '腾空时间', unit: 'ms', primary: false, description: 'Flight time during sprint', higherIsBetter: true },
  { key: 'stroke_rate', name: 'Stroke Rate', nameCn: '划水频率', unit: '/min', primary: true, description: 'Swimming stroke rate', higherIsBetter: true },
  { key: 'stroke_count', name: 'Stroke Count', nameCn: '划水次数', unit: '', primary: true, description: 'Total strokes per lap', higherIsBetter: false },
  { key: 'lap_time', name: 'Lap Time', nameCn: '单圈用时', unit: 's', primary: true, description: 'Time to complete one lap', higherIsBetter: false },
  { key: 'dps', name: 'Distance per Stroke', nameCn: '每划距离', unit: 'm', primary: false, description: 'Distance covered per stroke', higherIsBetter: true },
  { key: 'takeoff_force', name: 'Takeoff Force', nameCn: '起跳力', unit: 'N', primary: true, description: 'Force during high jump takeoff', higherIsBetter: true },
  { key: 'approach_velocity', name: 'Approach Velocity', nameCn: '助跑速度', unit: 'm/s', primary: true, description: 'Velocity during approach run', higherIsBetter: true },
  { key: 'bar_clearance', name: 'Bar Clearance', nameCn: '过杆高度', unit: 'm', primary: true, description: 'Height of bar cleared', higherIsBetter: true },
  { key: 'cod_time', name: 'COD Time', nameCn: '变向时间', unit: 's', primary: true, description: 'Change of direction time', higherIsBetter: false },
  { key: 'deceleration', name: 'Deceleration', nameCn: '减速能力', unit: 'm/s²', primary: false, description: 'Deceleration during COD', higherIsBetter: true },
  { key: 'reacceleration', name: 'Reacceleration', nameCn: '再加速能力', unit: 'm/s²', primary: false, description: 'Reacceleration after COD', higherIsBetter: true },
];

export function getMetric(key: string): MetricDefinition | undefined {
  return METRIC_DEFINITIONS.find((m) => m.key === key);
}

export function getMetricLabel(key: string, lang: 'en' | 'cn'): string {
  const m = getMetric(key);
  return m ? (lang === 'cn' ? m.nameCn : m.name) : key;
}

export function getMetricUnit(key: string): string {
  return getMetric(key)?.unit ?? '';
}
