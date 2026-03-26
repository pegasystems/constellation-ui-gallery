import { useEffect, useRef, useState } from 'react';
import { Configuration, DateInput, Text, withConfiguration, type DateInputProps } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

type DateInputChange = {
  valueAsISOString?: string;
  valueAsTimestamp?: number;
  state?: 'incomplete' | 'invalid';
};

export type DateInputExtProps = {
  getPConnect?: any;
  label: string;
  value?: string;
  helperText?: string;
  validatemessage?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  fieldMetadata?: {
    maxLength?: number;
    min?: string;
    max?: string;
    minValue?: string;
    maxValue?: string;
  };
  additionalProps?: Partial<DateInputProps>;
  displayMode?: 'DISPLAY_ONLY' | '';
  hasSuggestions?: boolean;
  localeOverride?: string;
  showWeekNumber?: boolean;
};

export const normalizeDateValue = (valueAsISOString?: string) => {
  if (!valueAsISOString) {
    return '';
  }

  return valueAsISOString.slice(0, 10);
};

export const resolveLocale = (
  localeOverride?: string,
  environmentInfo?: { getLocale?: () => string; getUseLocale?: () => string },
) => {
  if (localeOverride) {
    return localeOverride;
  }

  return environmentInfo?.getLocale?.() || environmentInfo?.getUseLocale?.() || undefined;
};

export const formatDisplayValue = (value?: string, locale?: string) => {
  if (!value) {
    return '';
  }

  const normalizedValue = value.length > 10 ? value : `${value}T00:00:00.000Z`;
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeZone: 'UTC',
    }).format(parsedDate);
  } catch {
    return value;
  }
};

export const PegaExtensionsDateInput = (props: DateInputExtProps) => {
  const {
    getPConnect,
    label,
    value = '',
    helperText = '',
    validatemessage = '',
    hideLabel = false,
    testId,
    fieldMetadata,
    additionalProps,
    displayMode,
    hasSuggestions,
    localeOverride,
    showWeekNumber = false,
  } = props;

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const hasValueChange = useRef(false);
  const environmentInfo = (window as any).PCore?.getEnvironmentInfo?.() as
    | { getLocale?: () => string; getUseLocale?: () => string }
    | undefined;
  const resolvedLocale = resolveLocale(localeOverride, environmentInfo);

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<DateInputProps['status']>(hasSuggestions ? 'pending' : undefined);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
      return;
    }

    if (hasSuggestions) {
      setStatus('pending');
      return;
    }

    setStatus(undefined);
  }, [validatemessage, hasSuggestions]);

  const displayComp = formatDisplayValue(inputValue || value, resolvedLocale);

  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }

  const handleChange = (nextValue: DateInputChange) => {
    if (hasSuggestions) {
      setStatus(undefined);
    }

    if (nextValue.state === 'invalid') {
      setStatus('error');
      return;
    }

    if (nextValue.state === 'incomplete') {
      return;
    }

    const normalizedValue = normalizeDateValue(nextValue.valueAsISOString);
    setInputValue(normalizedValue);

    if (value !== normalizedValue) {
      actions.updateFieldValue(propName, normalizedValue);
      hasValueChange.current = true;
    }
  };

  const handleBlur = (nextValue: DateInputChange) => {
    if (nextValue.state === 'invalid' || nextValue.state === 'incomplete') {
      return;
    }

    const normalizedValue = normalizeDateValue(nextValue.valueAsISOString);
    setInputValue(normalizedValue);

    if ((!value || hasValueChange.current) && !readOnly) {
      actions.triggerFieldChange(propName, normalizedValue);
      if (hasSuggestions) {
        pConn.ignoreSuggestion?.('');
      }
      hasValueChange.current = false;
    }
  };

  const dateInput = (
    <DateInput
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      testId={testId}
      value={inputValue}
      status={status}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      min={fieldMetadata?.minValue || fieldMetadata?.min}
      max={fieldMetadata?.maxValue || fieldMetadata?.max}
      showWeekNumber={showWeekNumber}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );

  if (!resolvedLocale) {
    return dateInput;
  }

  return <Configuration locale={resolvedLocale}>{dateInput}</Configuration>;
};

export default withConfiguration(PegaExtensionsDateInput);
