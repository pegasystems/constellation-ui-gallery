import { createUID, FormField, withConfiguration } from '@pega/cosmos-react-core';
import { useState } from 'react';

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
import { getPercentage, getProgressStatus, normalizeProgress, type ProgressSize, type ProgressTone } from './utils';

export interface PegaExtensionsProgressBarProps {
  /** Field label. */
  label: string;
  /** Current progress value. */
  value?: number;
  /** Maximum progress value. */
  max?: number;
  /** Supporting text shown below the label. */
  helperText?: string;
  /** Validation message. */
  validatemessage?: string;
  /** Hides the field label visually while retaining it for assistive technology. */
  hideLabel?: boolean;
  /** Test identifier. */
  testId?: string;
  /** Display mode. */
  displayMode?: '' | 'DISPLAY_ONLY';
  /** Visual tone for the progress fill. */
  tone?: ProgressTone;
  /** Track height. */
  size?: ProgressSize;
  /** Shows the percentage or in-progress label. */
  showValue?: boolean;
  /** Shows milestone markers at 25%, 50%, and 75%. */
  showMarkers?: boolean;
  /** Shows an indeterminate animated state instead of a numeric value. */
  indeterminate?: boolean;
  getPConnect: () => typeof PConnect;
}

export function PegaExtensionsProgressBar(props: PegaExtensionsProgressBarProps) {
  const {
    label,
    value = 0,
    max = 100,
    helperText,
    validatemessage,
    hideLabel = false,
    testId,
    displayMode = '',
    tone = 'accent',
    size = 'regular',
    showValue = true,
    showMarkers = true,
    indeterminate = false,
    getPConnect,
  } = props;

  const pConn = getPConnect();
  const localize = (text: string) => pConn.getLocalizedValue?.(text) || text;
  const [id] = useState(() => createUID());
  const normalizedMax = Number.isFinite(max) && max > 0 ? max : 100;
  const normalizedValue = normalizeProgress(value, normalizedMax);
  const percentage = getPercentage(normalizedValue, normalizedMax);
  const progressText = indeterminate
    ? localize('In progress')
    : percentage === 100
      ? localize('Complete')
      : `${percentage}%`;
  const statusText = localize(getProgressStatus(percentage, tone, indeterminate));
  const status = validatemessage ? 'error' : undefined;
  const ariaValueText = indeterminate ? localize('In progress') : `${percentage}% ${localize('complete')}`;
  const progressId = `${id}-progress`;
  const markers = [25, 50, 75];
  const progress = (
    <StyledProgressBar data-testid={testId}>
      {showValue && (
        <StyledProgressHeader>
          <StyledProgressStatus $tone={tone}>{statusText}</StyledProgressStatus>
          <StyledProgressValue>{progressText}</StyledProgressValue>
        </StyledProgressHeader>
      )}
      <StyledProgressRail>
        <StyledProgressTrack
          id={progressId}
          role='progressbar'
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={normalizedMax}
          aria-valuenow={indeterminate ? undefined : normalizedValue}
          aria-valuetext={ariaValueText}
          $size={size}
        >
          <StyledProgressFill
            $complete={percentage === 100 && !indeterminate}
            $indeterminate={indeterminate}
            $percentage={percentage}
            $tone={tone}
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

  if (displayMode === 'DISPLAY_ONLY') {
    return progress;
  }

  return (
    <FormField
      id={id}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      status={status}
      testId={testId}
    >
      {progress}
    </FormField>
  );
}

export default withConfiguration(PegaExtensionsProgressBar);
