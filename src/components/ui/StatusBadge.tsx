import type { Status } from '@/lib/types';
import { AlertCircle, AlertTriangle, CheckCircle, MinusCircle, RefreshCw, XCircle, Zap } from 'lucide-react';

export const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle }> = {
  normal: { label: 'Normal', color: 'text-success-700', bg: 'bg-success-50', border: 'border-success-200', icon: CheckCircle },
  warning: { label: 'Warning', color: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-200', icon: AlertTriangle },
  attention: { label: 'Attention', color: 'text-attention-700', bg: 'bg-attention-50', border: 'border-attention-200', icon: AlertCircle },
  invalid: { label: 'Invalid', color: 'text-invalid-700', bg: 'bg-invalid-50', border: 'border-invalid-200', icon: XCircle },
  offline: { label: 'Offline', color: 'text-ink-500', bg: 'bg-ink-100', border: 'border-ink-200', icon: MinusCircle },
  processing: { label: 'Processing', color: 'text-accent-700', bg: 'bg-accent-50', border: 'border-accent-200', icon: Zap },
  syncing: { label: 'Syncing', color: 'text-accent-700', bg: 'bg-accent-50', border: 'border-accent-200', icon: RefreshCw },
};

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  showPulse?: boolean;
}

export function StatusBadge({ status, size = 'sm', showIcon = true, showPulse = false }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-2.5 py-1 gap-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${cfg.bg} ${cfg.color} ${cfg.border} ${sizeClasses}`}>
      {showIcon && (
        <Icon className={`${iconSize} ${showPulse && (status === 'processing' || status === 'syncing') ? 'animate-pulse-soft' : ''}`} />
      )}
      {cfg.label}
    </span>
  );
}

export function StatusDot({ status, size = 'md' }: { status: Status; size?: 'sm' | 'md' | 'lg' }) {
  const cfg = STATUS_CONFIG[status];
  const colorMap: Record<Status, string> = {
    normal: 'bg-success-500',
    warning: 'bg-warning-500',
    attention: 'bg-attention-500',
    invalid: 'bg-invalid-500',
    offline: 'bg-ink-400',
    processing: 'bg-accent-500',
    syncing: 'bg-accent-500',
  };
  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';
  return (
    <span className={`inline-block rounded-full ${colorMap[status]} ${sizeClass} ${status === 'processing' || status === 'syncing' ? 'animate-pulse-soft' : ''}`} title={cfg.label} />
  );
}
