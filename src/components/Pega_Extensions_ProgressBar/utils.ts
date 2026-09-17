export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'compact' | 'regular' | 'large';

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
