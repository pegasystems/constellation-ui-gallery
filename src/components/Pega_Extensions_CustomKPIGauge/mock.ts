export const configProps = {
  label: 'Monthly Revenue ($)',
  subtitle: 'Current Month',
  dataPageName: 'D_MetricData',
  propertyName: 'TotalRevenue',
  valueUnit: '$',
  minPropertyName: 'MinValue',
  maxPropertyName: 'MaxValue',
  minValue: 0,
  maxValue: 150,
  thresholdLowPropertyName: '',
  thresholdLow: 80,
  thresholdHighPropertyName: '',
  thresholdHigh: 120,
  targetValuePropertyName: '',
  targetValue: '120',
  targetLabel: 'Target',
  colorBelowLow: '#d91e18',
  colorBetween: '#f59e0b',
  colorAboveHigh: '#2ca02c',
  showLegend: true,
  legendLowLabel: 'Low',
  legendWarningLabel: 'Warning',
  legendGoodLabel: 'Good',
  testId: 'CustomKPIGauge-12345678'
};

export const mockDataPageResponse = {
  data: {
    data: [
      {
        TotalRevenue: 85,
        MinValue: 0,
        MaxValue: 150
      }
    ]
  },
  status: 200,
  statusText: ''
};

export const mockDataPageResponseAboveThreshold = {
  data: {
    data: [
      {
        TotalRevenue: 130,
        MinValue: 0,
        MaxValue: 150
      }
    ]
  },
  status: 200,
  statusText: ''
};

export const mockEmptyResponse = {
  data: {
    data: null
  },
  status: 200,
  statusText: ''
};
