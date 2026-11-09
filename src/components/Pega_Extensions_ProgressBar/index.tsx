import { createUID, Text, withConfiguration } from '@pega/cosmos-react-core';
import { useCallback, useEffect, useState } from 'react';

import '../shared/create-nonce';

import {
  StyledProgressBar,
  StyledProgressFill,
  StyledProgressHeader,
  StyledProgressFraction,
  StyledProgressRail,
  StyledProgressStatus,
  StyledProgressTrack,
  StyledProgressValue,
} from './styles';
import {
  DEFAULT_REFRESH_INTERVAL_SECONDS,
  getPercentage,
  getProgressStatus,
  getRefreshIntervalMs,
  isProgressTone,
  isProgressUpdateStrategy,
  normalizeProgress,
  type ProgressSize,
  type ProgressTone,
  type ProgressUpdateStrategy,
} from './utils';

export interface PegaExtensionsProgressBarProps {
  /** Label shown above the progress bar. */
  label: string;
  /** Shows a never-ending progress animation and skips the data page and all refresh strategies. */
  indeterminateOnly?: boolean;
  /** Name of the data page that returns the progress record (the first record if it returns a list). Fetched according to `updateStrategy`. Ignored when `indeterminateOnly` is set. */
  dataPage?: string;
  /** When the data page is fetched: `messaging` on each PCore messaging service update, `interval` on a timer, or `onLoad` once on mount. */
  updateStrategy?: ProgressUpdateStrategy;
  /** Seconds between data page fetches when `updateStrategy` is `interval`. Defaults to 30; values below 10 are raised to 10. */
  refreshIntervalSeconds?: number;
  /** Data page property holding the current progress value. */
  valueProperty?: string;
  /** Data page property holding the minimum progress value. Defaults to 0 when missing. */
  minProperty?: string;
  /** Data page property holding the maximum progress value. Defaults to the minimum plus 100 when missing or not greater than the minimum. */
  maxProperty?: string;
  /** Data page property holding the progress tone (`accent`, `success`, `warning` or `danger`). A valid value overrides the `tone` prop. */
  toneProperty?: string;
  /** Supporting text shown below the label. */
  helperText?: string;
  /** Test identifier. */
  testId?: string;
  /** Default tone of the progress fill, used until or unless the data page provides one. */
  tone?: ProgressTone;
  /** Height of the progress track. */
  size?: ProgressSize;
  /** Shows the status label and the percentage above the bar. Hidden while the progress is indeterminate. */
  showValue?: boolean;
  /** Shows the completed fraction (for example `20 of 80 completed`) below the bar. Hidden while the progress is indeterminate. */
  showFraction?: boolean;
  getPConnect: () => typeof PConnect;
}

export function PegaExtensionsProgressBar(props: PegaExtensionsProgressBarProps) {
  const {
    label,
    indeterminateOnly = false,
    dataPage,
    updateStrategy: updateStrategyProp = 'messaging',
    refreshIntervalSeconds = DEFAULT_REFRESH_INTERVAL_SECONDS,
    valueProperty = 'Value',
    minProperty = 'Min',
    maxProperty = 'Max',
    toneProperty = 'Tone',
    helperText,
    testId,
    tone = 'accent',
    size = 'regular',
    showValue = true,
    showFraction = true,
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
    if (indeterminateOnly || !dataPage) return;
    PCore.getDataApiUtils()
      .getData(dataPage, {}, getPConnect().getContextName())
      .then((response: any) => {
        const data = response?.data?.data;
        const record = Array.isArray(data) ? data[0] : data;
        if (record) {
          if (record[valueProperty] !== undefined) setValue(Number(record[valueProperty]));
          if (record[minProperty] !== undefined) setMin(Number(record[minProperty]));
          if (record[maxProperty] !== undefined) setMax(Number(record[maxProperty]));
          setDataPageTone(isProgressTone(record[toneProperty]) ? record[toneProperty] : undefined);
        }
      })
      .catch(() => {});
  }, [indeterminateOnly, dataPage, valueProperty, minProperty, maxProperty, toneProperty, getPConnect]);

  useEffect(() => {
    setDataPageTone(undefined);
  }, [dataPage, toneProperty, indeterminateOnly]);

  const updateStrategy = isProgressUpdateStrategy(updateStrategyProp) ? updateStrategyProp : 'messaging';

  useEffect(() => {
    if (indeterminateOnly || !dataPage) return undefined;

    if (updateStrategy === 'onLoad') {
      loadFromDataPage();
      return undefined;
    }

    const startPolling = () => {
      loadFromDataPage();
      const intervalId = window.setInterval(loadFromDataPage, getRefreshIntervalMs(refreshIntervalSeconds));
      return () => {
        window.clearInterval(intervalId);
      };
    };

    if (updateStrategy === 'interval') return startPolling();

    /* Messaging: on a case, listen for that case's updates; on a page (no case context), listen for the data page itself */
    let caseID: string | undefined;
    try {
      caseID = getPConnect().getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    } catch {
      caseID = undefined;
    }
    const filter: { matcher: string; criteria: Record<string, string> } = caseID
      ? { matcher: 'CASE', criteria: { caseId: caseID } }
      : { matcher: 'DATAPAGE_UPDATED', criteria: { datapage: dataPage } };

    let subscriptionId: string;
    try {
      subscriptionId = PCore.getMessagingServiceManager().subscribe(
        filter,
        loadFromDataPage,
        getPConnect().getContextName(),
      );
    } catch {
      /* Messaging service unavailable: fall back to polling */
      return startPolling();
    }
    loadFromDataPage();
    return () => {
      try {
        PCore.getMessagingServiceManager().unsubscribe(subscriptionId);
      } catch {
        /* Messaging service already gone */
      }
    };
  }, [indeterminateOnly, dataPage, updateStrategy, refreshIntervalSeconds, loadFromDataPage, getPConnect]);

  const indeterminate = indeterminateOnly || value === undefined;
  const effectiveTone = dataPageTone ?? tone;
  const normalizedMin = Number.isFinite(min) ? (min as number) : 0;
  const normalizedMax = Number.isFinite(max) && (max as number) > normalizedMin ? (max as number) : normalizedMin + 100;
  const normalizedValue = normalizeProgress(value ?? normalizedMin, normalizedMin, normalizedMax);
  const percentage = getPercentage(normalizedValue, normalizedMin, normalizedMax);
  const completedValue = normalizedValue - normalizedMin;
  const totalValue = normalizedMax - normalizedMin;
  const progressText = percentage === 100 ? localize('Complete') : `${percentage}%`;
  const fractionText = `${completedValue} ${localize('of')} ${totalValue} ${localize('completed')}`;
  const statusText = localize(getProgressStatus(percentage, effectiveTone));
  const ariaValueText = indeterminate ? localize('In progress') : `${percentage}% ${localize('complete')}`;
  const progressId = `${id}-progress`;
  const helperId = `${id}-helper`;

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
        </StyledProgressTrack>
        {showFraction && !indeterminate && <StyledProgressFraction>{fractionText}</StyledProgressFraction>}
      </StyledProgressRail>
    </StyledProgressBar>
  );
}

export default withConfiguration(PegaExtensionsProgressBar);
