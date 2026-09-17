export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'compact' | 'regular' | 'large';

export const normalizeProgress = (value: number, max: number): number => {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return Math.min(max, Math.max(0, value));
};

export const getPercentage = (value: number, max: number): number => {
  if (max <= 0) {
    return 0;
  }

  return Math.round((value / max) * 100);
};

export const getProgressStatus = (percentage: number, tone: ProgressTone, indeterminate: boolean): string => {
  if (indeterminate) {
    return 'Working';
  }

  if (percentage === 100) {
    return 'Complete';
  }

  if (tone === 'danger') {
    return 'Needs attention';
  }

  if (tone === 'warning') {
    return 'In review';
  }

  return 'On track';
};
