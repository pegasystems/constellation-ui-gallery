export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'compact' | 'regular' | 'large';
/** `messaging` pushes via the PCore messaging service, `interval` polls the data page on a timer, `onLoad` fetches once on mount. */
export type ProgressUpdateStrategy = 'messaging' | 'interval' | 'onLoad';

const progressTones: ProgressTone[] = ['accent', 'success', 'warning', 'danger'];
const progressUpdateStrategies: ProgressUpdateStrategy[] = ['messaging', 'interval', 'onLoad'];

export const DEFAULT_REFRESH_INTERVAL_SECONDS = 30;
const MIN_REFRESH_INTERVAL_SECONDS = 10;

export const isProgressTone = (value: unknown): value is ProgressTone => progressTones.includes(value as ProgressTone);

export const isProgressUpdateStrategy = (value: unknown): value is ProgressUpdateStrategy =>
  progressUpdateStrategies.includes(value as ProgressUpdateStrategy);

export const getRefreshIntervalMs = (seconds: number | undefined): number => {
  const safeSeconds = Number.isFinite(seconds) ? (seconds as number) : DEFAULT_REFRESH_INTERVAL_SECONDS;
  return Math.max(MIN_REFRESH_INTERVAL_SECONDS, safeSeconds) * 1000;
};

export const normalizeProgress = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

export const getPercentage = (value: number, min: number, max: number): number => {
  if (max <= min) {
    return 0;
  }

  return Math.round(((value - min) / (max - min)) * 100);
};

export const getProgressStatus = (percentage: number, tone: ProgressTone): string => {
  if (percentage === 100) {
    return 'Complete';
  }

  if (tone === 'danger') {
    return 'Needs attention';
  }

  if (tone === 'warning') {
    return 'At risk';
  }

  return 'On track';
};
