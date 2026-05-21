import '../shared/create-nonce';
import React, { useState, useEffect, useCallback } from 'react';
import {
  withConfiguration,
  Card,
  CardHeader,
  CardContent,
  Flex,
  Text,
  Button,
  Progress
} from '@pega/cosmos-react-core';

type DataPageValueDisplayProps = {
  label?: string;
  subtitle?: string;
  dataPageName?: string;
  propertyName?: string;
  valueUnit?: string;
  minPropertyName?: string;
  maxPropertyName?: string;
  minValue?: number;
  maxValue?: number;
  thresholdLowPropertyName?: string;
  thresholdHighPropertyName?: string;
  thresholdLow?: number;
  thresholdHigh?: number;
  targetValuePropertyName?: string;
  targetValue?: string;
  targetLabel?: string;
  colorBelowLow?: string;
  colorBetween?: string;
  colorAboveHigh?: string;
  showLegend?: boolean;
  legendLowLabel?: string;
  legendWarningLabel?: string;
  legendGoodLabel?: string;
  getPConnect?: any;
};

/* ── Helpers ─────────────────────────────────────────────── */

const toRad = (deg: number) => (deg * Math.PI) / 180;

const START_ANGLE = 150;
const END_ANGLE = 390;
const TOTAL_ANGLE = END_ANGLE - START_ANGLE;

/* ── Gauge SVG ───────────────────────────────────────────── */

const Gauge = ({
  value,
  min,
  max,
  thresholdLow,
  thresholdHigh,
  targetValue,
  targetLabel,
  colorLow,
  colorWarning,
  colorGood,
  unit
}: {
  value: number;
  min: number;
  max: number;
  thresholdLow: number;
  thresholdHigh: number;
  targetValue: string | null;
  targetLabel: string;
  colorLow: string;
  colorWarning: string;
  colorGood: string;
  unit: string;
}) => {
  const size = 320;
  const strokeWidth = 34;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = (size - strokeWidth) / 2 - 20;

  const range = max - min || 1;

  const polarToCartesian = (angle: number, r?: number) => ({
    x: cx + (r ?? radius) * Math.cos(toRad(angle)),
    y: cy + (r ?? radius) * Math.sin(toRad(angle))
  });

  const valueToAngle = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    return START_ANGLE + ((clamped - min) / range) * TOTAL_ANGLE;
  };

  const describeArc = (startDeg: number, endDeg: number, r?: number) => {
    const s = polarToCartesian(startDeg, r);
    const e = polarToCartesian(endDeg, r);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    const rad = r ?? radius;
    return `M ${s.x} ${s.y} A ${rad} ${rad} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  // Zone angles
  const lowEndAngle = valueToAngle(thresholdLow);
  const highStartAngle = lowEndAngle;
  const highEndAngle = valueToAngle(thresholdHigh);

  // Value needle
  const clampedValue = Math.max(min, Math.min(max, value));
  const valueAngle = valueToAngle(clampedValue);
  const needleLength = radius - 10;
  const needleTip = polarToCartesian(valueAngle, needleLength);

  return (
    <svg
      width='100%'
      viewBox={`0 0 ${size} ${size * 0.82}`}
      preserveAspectRatio='xMidYMid meet'
      style={{ overflow: 'visible', maxWidth: size }}
    >
      {/* Background arc (light gray) */}
      <path
        d={describeArc(START_ANGLE, END_ANGLE)}
        fill='none'
        stroke='#e5e7eb'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />

      {/* Zone: Low (red, solid) */}
      <path
        d={describeArc(START_ANGLE, lowEndAngle)}
        fill='none'
        stroke={colorLow}
        strokeWidth={strokeWidth}
        strokeLinecap='butt'
      />

      {/* Zone: Warning */}
      <path
        d={describeArc(highStartAngle, highEndAngle)}
        fill='none'
        stroke={colorWarning}
        strokeWidth={strokeWidth}
        strokeLinecap='butt'
      />

      {/* Zone: Good (green, solid) */}
      <path
        d={describeArc(highEndAngle, END_ANGLE)}
        fill='none'
        stroke={colorGood}
        strokeWidth={strokeWidth}
        strokeLinecap='butt'
      />

      {/* Needle (arrow shape) */}
      {(() => {
        const angle = toRad(valueAngle);
        const perpAngle = angle + Math.PI / 2;
        const baseWidth = 6;
        const bx1 = cx + baseWidth * Math.cos(perpAngle);
        const by1 = cy + baseWidth * Math.sin(perpAngle);
        const bx2 = cx - baseWidth * Math.cos(perpAngle);
        const by2 = cy - baseWidth * Math.sin(perpAngle);
        return (
          <polygon
            points={`${needleTip.x},${needleTip.y} ${bx1},${by1} ${bx2},${by2}`}
            fill='#1f2937'
          />
        );
      })()}

      {/* Needle hub */}
      <circle cx={cx} cy={cy} r='8' fill='#374151' />
      <circle cx={cx} cy={cy} r='4' fill='#6b7280' />

      {/* Center value */}
      <text
        x={cx}
        y={cy + 48}
        textAnchor='middle'
        fontSize='28'
        fontWeight='700'
        fill='#1f2937'
      >
        {value}
        {unit && (
          <tspan>{` ${unit}`}</tspan>
        )}
      </text>
      {targetValue !== null && (() => {
        const ty = cy + (unit ? 80 : 76);
        const displayText = targetLabel ? `${targetLabel}: ${targetValue}` : `${targetValue}`;
        const charWidth = 7;
        const pillWidth = displayText.length * charWidth + 22;
        const pillHeight = 22;
        return (
          <g>
            <rect
              x={cx - pillWidth / 2}
              y={ty - pillHeight / 2 - 1.5}
              width={pillWidth}
              height={pillHeight}
              rx={pillHeight / 2}
              ry={pillHeight / 2}
              fill='#f3f4f6'
              stroke='#d1d5db'
              strokeWidth='1'
            />
            <text
              x={cx}
              y={ty - 1}
              textAnchor='middle'
              dominantBaseline='central'
              fontSize='11'
              fontWeight='600'
              fill='#374151'
            >
              {displayText}
            </text>
          </g>
        );
      })()}

      {/* Min label */}
      <text
        x={polarToCartesian(START_ANGLE).x}
        y={polarToCartesian(START_ANGLE).y + 38}
        textAnchor='middle'
        fontSize='11'
        fontWeight='700'
        fill='#1f2937'
      >
        {min}
      </text>
      {/* Low threshold label */}
      <text
        x={polarToCartesian(lowEndAngle, radius + strokeWidth / 2 + 18).x}
        y={polarToCartesian(lowEndAngle, radius + strokeWidth / 2 + 18).y + 5}
        textAnchor='middle'
        fontSize='11'
        fontWeight='700'
        fill='#1f2937'
      >
        {thresholdLow}
      </text>
      {/* High threshold label */}
      <text
        x={polarToCartesian(highEndAngle, radius + strokeWidth / 2 + 18).x}
        y={polarToCartesian(highEndAngle, radius + strokeWidth / 2 + 18).y + 5}
        textAnchor='middle'
        fontSize='11'
        fontWeight='700'
        fill='#1f2937'
      >
        {thresholdHigh}
      </text>
      {/* Max label */}
      <text
        x={polarToCartesian(END_ANGLE).x}
        y={polarToCartesian(END_ANGLE).y + 38}
        textAnchor='middle'
        fontSize='11'
        fontWeight='700'
        fill='#1f2937'
      >
        {max}
      </text>
    </svg>
  );
};

/* ── Legend ───────────────────────────────────────────────── */

const Legend = ({
  colorLow,
  colorWarning,
  colorGood,
  labelLow,
  labelWarning,
  labelGood
}: {
  colorLow: string;
  colorWarning: string;
  colorGood: string;
  labelLow: string;
  labelWarning: string;
  labelGood: string;
}) => {
  const itemStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#374151'
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '10px',
        marginTop: '4px'
      }}
    >
      <span style={itemStyle}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: colorLow, flexShrink: 0 }} />
        {labelLow}
      </span>
      <span style={itemStyle}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: colorWarning, flexShrink: 0 }} />
        {labelWarning}
      </span>
      <span style={itemStyle}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: colorGood, flexShrink: 0 }} />
        {labelGood}
      </span>
    </div>
  );
};

/* ── Main component ──────────────────────────────────────── */

export const PegaExtensionsCustomKPIGauge = (props: DataPageValueDisplayProps) => {
  const {
    label = 'Value',
    subtitle = '',
    dataPageName = '',
    propertyName = '',
    valueUnit = '',
    minPropertyName = '',
    maxPropertyName = '',
    minValue: minValueProp = 0,
    maxValue: maxValueProp = 100,
    thresholdLowPropertyName = '',
    thresholdHighPropertyName = '',
    thresholdLow: thresholdLowProp = 50,
    thresholdHigh: thresholdHighProp = 100,
    targetValuePropertyName = '',
    targetValue: targetValueProp = '',
    targetLabel = 'Target',
    colorBelowLow = '#d91e18',
    colorBetween = '#f59e0b',
    colorAboveHigh = '#2ca02c',
    showLegend = true,
    legendLowLabel = 'Low',
    legendWarningLabel = 'Warning',
    legendGoodLabel = 'Good',
    getPConnect
  } = props;

  const [value, setValue] = useState<number | null>(null);
  const [minValue, setMinValue] = useState<number>(minValueProp);
  const [maxValue, setMaxValue] = useState<number>(maxValueProp);
  const [thresholdLow, setThresholdLow] = useState<number>(thresholdLowProp);
  const [thresholdHigh, setThresholdHigh] = useState<number>(thresholdHighProp);
  const [targetValue, setTargetValue] = useState<string>(targetValueProp);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const processRecord = useCallback((record: any) => {
    const v = parseFloat(record[propertyName]);
    if (!isNaN(v)) setValue(v);
    else setError(`Value "${record[propertyName]}" is not numeric.`);

    const numericFields: Array<[string, (v: number) => void]> = [
      [minPropertyName, setMinValue],
      [maxPropertyName, setMaxValue],
      [thresholdLowPropertyName, setThresholdLow],
      [thresholdHighPropertyName, setThresholdHigh]
    ];
    for (const [prop, setter] of numericFields) {
      if (prop && record[prop] !== undefined) {
        const n = parseFloat(record[prop]);
        if (!isNaN(n)) setter(n);
      }
    }
    if (targetValuePropertyName && record[targetValuePropertyName] !== undefined) {
      setTargetValue(String(record[targetValuePropertyName]));
    }
  }, [propertyName, minPropertyName, maxPropertyName, thresholdLowPropertyName, thresholdHighPropertyName, targetValuePropertyName]);

  const fetchData = useCallback(() => {
    if (!dataPageName || !propertyName) {
      setLoading(false);
      setError('Data page name and property name are required.');
      return;
    }

    setLoading(true);
    setError('');

    const PCore = (window as any).PCore;
    if (!PCore) {
      setLoading(false);
      setError('PCore is not available.');
      return;
    }

    const dataApiUtils = PCore.getDataApiUtils?.();
    if (!dataApiUtils) {
      setLoading(false);
      setError('Data API utils are not available.');
      return;
    }

    const pConn = getPConnect?.();
    const contextName = pConn?.getContextName?.() || '';

    dataApiUtils
      .getData(dataPageName, {}, contextName)
      .then((response: any) => {
        const data = response?.data?.data;
        if (data !== null && data !== undefined) {
          let record: any;
          if (Array.isArray(data)) {
            record = data[0];
          } else {
            record = data;
          }

          if (record && record[propertyName] !== undefined) {
            processRecord(record);
          } else {
            setError(`Property "${propertyName}" not found in data page response.`);
          }
        } else {
          setError('No data returned from data page.');
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setError(`Failed to load data: ${err?.message || 'Unknown error'}`);
        setLoading(false);
      });
  }, [dataPageName, propertyName, processRecord, getPConnect]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!dataPageName || !propertyName) {
    return (
      <Card>
        <CardHeader>
          <Text variant='h3'>{label}</Text>
        </CardHeader>
        <CardContent>
          <Text>Please configure the data page name and property name.</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div style={{ position: 'relative' }}>
          {/* Refresh button – top right */}
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <Button
              variant='simple'
              label='Refresh'
              icon
              compact
              onClick={fetchData}
              disabled={loading}
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M21 2v6h-6' />
                <path d='M3 12a9 9 0 0 1 15-6.7L21 8' />
                <path d='M3 22v-6h6' />
                <path d='M21 12a9 9 0 0 1-15 6.7L3 16' />
              </svg>
            </Button>
          </div>

          {/* Title + subtitle centered above gauge */}
          <Flex container={{ direction: 'column', alignItems: 'center', gap: 0.25 }}>
            <Text variant='h3'>{label}</Text>
            {subtitle && (
              <Text variant='secondary'>{subtitle}</Text>
            )}
          </Flex>
        </div>

        {loading && <Progress placement='local' message='Loading...' />}
        {!loading && error && (
          <Text variant='secondary'>{error}</Text>
        )}
        {!loading && !error && value !== null && (
          <Flex container={{ direction: 'column', alignItems: 'center', gap: 0.5 }}>
            <Gauge
              value={value}
              min={minValue}
              max={maxValue}
              thresholdLow={thresholdLow}
              thresholdHigh={thresholdHigh}
              targetValue={targetValue.trim() || null}
              targetLabel={targetLabel}
              colorLow={colorBelowLow}
              colorWarning={colorBetween}
              colorGood={colorAboveHigh}
              unit={valueUnit}
            />

            {showLegend && (
              <Legend
                colorLow={colorBelowLow}
                colorWarning={colorBetween}
                colorGood={colorAboveHigh}
                labelLow={legendLowLabel}
                labelWarning={legendWarningLabel}
                labelGood={legendGoodLabel}
              />
            )}
          </Flex>
        )}
      </CardContent>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsCustomKPIGauge);
