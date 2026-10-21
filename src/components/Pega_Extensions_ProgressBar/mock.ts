import type { ProgressTone } from './utils';

export interface ProgressDataPageProps {
  valueProperty?: string;
  minProperty?: string;
  maxProperty?: string;
  toneProperty?: string;
}

export const configProps = {
  label: 'Export job progress',
  dataPage: 'D_ExportJobProgress',
  valueProperty: 'Value',
  minProperty: 'Min',
  maxProperty: 'Max',
  toneProperty: 'Tone',
  helperText: 'Progress is streamed by the export job several times a second.',
  testId: 'ProgressBar-12345678',
  tone: 'accent' as const,
  size: 'regular' as const,
  showValue: true,
  showFraction: true,
};

export const createProgressDataPageResponse = (
  props: ProgressDataPageProps,
  value: number,
  min: number,
  max: number,
  tone?: ProgressTone,
) => {
  const record: Record<string, number | string> = {
    [props.valueProperty ?? 'Value']: value,
    [props.minProperty ?? 'Min']: min,
    [props.maxProperty ?? 'Max']: max,
  };

  if (tone) {
    record[props.toneProperty ?? 'Tone'] = tone;
  }

  return {
    data: {
      data: [record],
    },
  };
};

/* Successive values the export job reports as it streams rapid, roughly once-a-second progress updates */
export const rapidProgressSteps = [12, 27, 41, 58, 73, 89, 100];
