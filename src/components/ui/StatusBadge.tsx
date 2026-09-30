import type { Status, Lang } from '@/lib/types';
import { t as translate } from '@/lib/i18n';
import { AlertCircle, AlertTriangle, CheckCircle, MinusCircle, RefreshCw, XCircle, Zap, Clock } from 'lucide-react';

export const STATUS_CONFIG: Record<Status, { labelKey: string; color: string; bg: string; border: string; icon: typeof CheckCircle }> = {
  normal: { labelKey: 'common.normal', color: 'text-success-700', bg: 'bg-success-50', border: 'border-success-200', icon: CheckCircle },
  warning: { labelKey: 'common.warning', color: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-200', icon: AlertTriangle },
  attention: { labelKey: 'common.attention', color: 'text-attention-700', bg: 'bg-attention-50', border: 'border-attention-200', icon: AlertCircle },
  invalid: { labelKey: 'common.invalid', color: 'text-invalid-700', bg: 'bg-invalid-50', border: 'border-invalid-200', icon: XCircle },
  offline: { labelKey: 'common.offline', color: 'text-ink-500', bg: 'bg-ink-100', border: 'border-ink-200', icon: MinusCircle },
  processing: { labelKey: 'common.processing', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', icon: Zap },
  syncing: { labelKey: 'common.syncing', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', icon: RefreshCw },
  pending: { labelKey: 'common.pending', color: 'text-ink-600', bg: 'bg-ink-100', border: 'border-ink-200', icon: Clock },
};

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  showPulse?: boolean;
  lang?: Lang;
}

export function StatusBadge({ status, size = 'sm', showIcon = true, showPulse = false, lang = 'cn' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-2.5 py-1 gap-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${cfg.bg} ${cfg.color} ${cfg.border} ${sizeClasses}`}>
      {showIcon && (
        <Icon className={`${iconSize} ${showPulse && (status === 'processing' || status === 'syncing') ? 'animate-pulse-soft' : ''}`} />
      )}
      {translate(cfg.labelKey, lang)}
    </span>
  );
}

export function StatusDot({ status, size = 'md' }: { status: Status; size?: 'sm' | 'md' | 'lg' }) {
  const colorMap: Record<Status, string> = {
    normal: 'bg-success-500',
    warning: 'bg-warning-500',
    attention: 'bg-attention-500',
    invalid: 'bg-invalid-500',
    offline: 'bg-ink-400',
    processing: 'bg-teal-500',
    syncing: 'bg-teal-500',
    pending: 'bg-ink-400',
  };
  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';
  return (
    <span className={`inline-block rounded-full ${colorMap[status]} ${sizeClass} ${status === 'processing' || status === 'syncing' ? 'animate-pulse-soft' : ''}`} />
  );
}
