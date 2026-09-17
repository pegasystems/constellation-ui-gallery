import { createUID, Text, withConfiguration } from '@pega/cosmos-react-core';
import { useCallback, useEffect, useState } from 'react';

import '../shared/create-nonce';

import {
  StyledProgressBar,
  StyledProgressFill,
  StyledProgressHeader,
  StyledProgressLegend,
  StyledProgressMarker,
  StyledProgressMarkers,
  StyledProgressRail,
  StyledProgressStatus,
  StyledProgressTrack,
  StyledProgressValue,
} from './styles';
import { getPercentage, getProgressStatus, isProgressTone, normalizeProgress, type ProgressSize, type ProgressTone } from './utils';

export interface PegaExtensionsProgressBarProps {
  /** Widget label. */
  label: string;
  /** Name of the data page providing the progress value. Refreshed only via the PCore messaging service. */
  dataPage: string;
  /** Property in the data page response holding the current progress value. */
  valueProperty?: string;
  /** Property in the data page response holding the minimum progress value. */
  minProperty?: string;
  /** Property in the data page response holding the maximum progress value. */
  maxProperty?: string;
  /** Property in the data page response holding the progress tone. Overrides the static `tone` prop when valid. */
  toneProperty?: string;
  /** Supporting text shown below the label. */
  helperText?: string;
  /** Test identifier. */
  testId?: string;
  /** Visual tone for the progress fill. */
  tone?: ProgressTone;
  /** Track height. */
  size?: ProgressSize;
  /** Shows the percentage or in-progress label. */
  showValue?: boolean;
  /** Shows milestone markers at 25%, 50%, and 75%. */
  showMarkers?: boolean;
  getPConnect: () => typeof PConnect;
}

export function PegaExtensionsProgressBar(props: PegaExtensionsProgressBarProps) {
  const {
    label,
    dataPage,
    valueProperty = 'Value',
    minProperty = 'Min',
    maxProperty = 'Max',
    toneProperty = 'Tone',
    helperText,
    testId,
    tone = 'accent',
    size = 'regular',
    showValue = true,
    showMarkers = true,
    getPConnect,
  } = props;

  const pConn = getPConnect();
  const localize = (text: string) => pConn.getLocalizedValue?.(text) || text;
  const [id] = useState(() => createUID());
  const [value, setValue] = useState<number | undefined>(undefined);
  const [min, setMin] = useState<number | undefined>(undefined);
  const [max, setMax] = useState<number | undefined>(undefined);
  const [dataPageTone, setDataPageTone] = useState<ProgressTone | undefined>(undefined);

  const loadFromDataPage = useCallback(() => {
    if (!dataPage) return;
    PCore.getDataApiUtils()
      .getData(dataPage, {}, getPConnect().getContextName())
      .then((response: any) => {
        const data = response?.data?.data;
        const record = Array.isArray(data) ? data[0] : data;
        if (record) {
          if (record[valueProperty] !== undefined) setValue(Number(record[valueProperty]));
          if (record[minProperty] !== undefined) setMin(Number(record[minProperty]));
          if (record[maxProperty] !== undefined) setMax(Number(record[maxProperty]));
          if (isProgressTone(record[toneProperty])) setDataPageTone(record[toneProperty]);
        }
      })
      .catch(() => {});
  }, [dataPage, valueProperty, minProperty, maxProperty, toneProperty, getPConnect]);

  /* The PCore messaging service is the only trigger for refreshing this widget's progress. */
  useEffect(() => {
    if (!dataPage) return undefined;
    /* On a case, listen for that case's updates; on a page (no case context), listen for the data page itself */
    let caseID: string | undefined;
    try {
      caseID = getPConnect().getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    } catch {
      caseID = undefined;
    }
    const filter: { matcher: string; criteria: Record<string, string> } = caseID
      ? { matcher: 'CASE', criteria: { caseId: caseID } }
      : { matcher: 'DATAPAGE_UPDATED', criteria: { datapage: dataPage } };
    const subscriptionId = PCore.getMessagingServiceManager().subscribe(
      filter,
      loadFromDataPage,
      getPConnect().getContextName(),
    );
    loadFromDataPage();
    return () => {
      PCore.getMessagingServiceManager().unsubscribe(subscriptionId);
    };
  }, [dataPage, loadFromDataPage, getPConnect]);

  const indeterminate = value === undefined;
  const effectiveTone = dataPageTone ?? tone;
  const normalizedMin = Number.isFinite(min) ? (min as number) : 0;
  const normalizedMax = Number.isFinite(max) && (max as number) > normalizedMin ? (max as number) : normalizedMin + 100;
  const normalizedValue = normalizeProgress(value ?? normalizedMin, normalizedMin, normalizedMax);
  const percentage = getPercentage(normalizedValue, normalizedMin, normalizedMax);
  const progressText = percentage === 100 ? localize('Complete') : `${percentage}%`;
  const statusText = localize(getProgressStatus(percentage, effectiveTone, indeterminate));
  const ariaValueText = indeterminate ? localize('In progress') : `${percentage}% ${localize('complete')}`;
  const progressId = `${id}-progress`;
  const helperId = `${id}-helper`;
  const markers = [25, 50, 75];

  return (
    <StyledProgressBar data-testid={testId}>
      <Text variant='h3'>{label}</Text>
      {helperText && (
        <Text id={helperId} variant='secondary'>
          {helperText}
        </Text>
      )}
      {showValue && !indeterminate && (
        <StyledProgressHeader>
          <StyledProgressStatus $tone={effectiveTone}>{statusText}</StyledProgressStatus>
          <StyledProgressValue>{progressText}</StyledProgressValue>
        </StyledProgressHeader>
      )}
      <StyledProgressRail>
        <StyledProgressTrack
          id={progressId}
          role='progressbar'
          aria-label={label}
          aria-describedby={helperText ? helperId : undefined}
          aria-valuemin={normalizedMin}
          aria-valuemax={normalizedMax}
          aria-valuenow={indeterminate ? undefined : normalizedValue}
          aria-valuetext={ariaValueText}
          $size={size}
        >
          <StyledProgressFill
            $complete={percentage === 100 && !indeterminate}
            $indeterminate={indeterminate}
            $percentage={percentage}
            $tone={effectiveTone}
          />
          {showMarkers && !indeterminate && (
            <StyledProgressMarkers aria-hidden='true'>
              {markers.map((marker) => (
                <StyledProgressMarker
                  key={marker}
                  $active={percentage >= marker}
                  data-testid={testId ? `${testId}:marker:${marker}` : undefined}
                  style={{ left: `${marker}%` }}
                />
              ))}
            </StyledProgressMarkers>
          )}
        </StyledProgressTrack>
        {showMarkers && !indeterminate && (
          <StyledProgressLegend aria-hidden='true'>
            <span>{localize('Complete')}</span>
          </StyledProgressLegend>
        )}
      </StyledProgressRail>
    </StyledProgressBar>
  );
}

export default withConfiguration(PegaExtensionsProgressBar);
