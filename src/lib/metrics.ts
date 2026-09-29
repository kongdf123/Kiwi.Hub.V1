import type { MetricDefinition } from './types';

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  { key: 'jump_height', name: 'Jump Height', unit: 'cm', testType: 'CMJ', primary: true, description: 'Vertical displacement of center of mass' },
  { key: 'peak_force', name: 'Peak Force', unit: 'N', testType: 'CMJ', primary: true, description: 'Maximum vertical ground reaction force' },
  { key: 'peak_power', name: 'Peak Power', unit: 'W', testType: 'CMJ', primary: false, description: 'Maximum instantaneous power output' },
  { key: 'rsi_mod', name: 'RSI-mod', unit: '', testType: 'CMJ', primary: true, description: 'Reactive Strength Index modified (jump height / time to takeoff)' },
  { key: 'asymmetry', name: 'Asymmetry', unit: '%', testType: 'CMJ', primary: true, description: 'Left-right force asymmetry' },
  { key: 'time_to_takeoff', name: 'Time to Takeoff', unit: 'ms', testType: 'CMJ', primary: false, description: 'Eccentric + concentric phase duration' },
  { key: 'modified_rsi', name: 'RSI-mod', unit: '', testType: 'Drop Jump', primary: true, description: 'Reactive Strength Index modified' },
  { key: 'peak_force_imtp', name: 'Peak Force', unit: 'N', testType: 'IMTP', primary: true, description: 'Maximum isometric force' },
  { key: 'rfd', name: 'RFD', unit: 'N/s', testType: 'IMTP', primary: true, description: 'Rate of force development at 200ms' },
  { key: 'relative_peak_force', name: 'Relative Peak Force', unit: 'N/kg', testType: 'IMTP', primary: false, description: 'Peak force normalized to body mass' },
];

export function getMetric(key: string): MetricDefinition | undefined {
  return METRIC_DEFINITIONS.find((m) => m.key === key);
}

export function getMetricsForTestType(testType: string): MetricDefinition[] {
  return METRIC_DEFINITIONS.filter((m) => m.testType === testType);
}
