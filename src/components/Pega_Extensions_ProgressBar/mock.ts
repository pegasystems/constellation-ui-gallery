export const configProps = {
  label: 'Export job progress',
  dataPage: 'D_ExportJobProgress',
  valueProperty: 'Value',
  maxProperty: 'Max',
  helperText: 'Progress is streamed by the export job several times a second.',
  testId: 'ProgressBar-12345678',
  tone: 'accent' as const,
  size: 'regular' as const,
  showValue: true,
  showMarkers: true,
};

/* Successive values the export job reports as it streams rapid, roughly once-a-second progress updates */
export const rapidProgressSteps = [12, 27, 41, 58, 73, 89, 100];

export const mockCompleteDataPageResponse = {
  data: {
    data: [
      {
        Value: 100,
        Max: 100,
      },
    ],
  },
  status: 200,
  statusText: '',
};
