import { useEffect, useState, useRef, type ChangeEvent } from 'react';
import { withConfiguration, Switch, Text, FormField } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

export type ToggleProps = {
  getPConnect?: any;
  label: string;
  caption: string;
  value?: boolean;
  helperText?: string;
  validatemessage?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  trueLabel?: string;
  falseLabel?: string;
  displayValue?: string;
  fieldMetadata?: any;
  additionalProps?: any;
  displayMode?: 'DISPLAY_ONLY' | '';
  hasSuggestions?: boolean;
};

const getReadOnlyDisplayText = (
  value: boolean | undefined,
  trueLabel: string,
  falseLabel: string,
  displayValue?: string,
): string => {
  if (displayValue === 'True/False') {
    return value ? 'True' : 'False';
  }
  return value ? trueLabel : falseLabel;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
export const PegaExtensionsToggle = (props: ToggleProps) => {
  const {
    getPConnect,
    validatemessage = '',
    label,
    caption,
    value,
    helperText = '',
    hideLabel = false,
    testId = '',
    trueLabel = 'Yes',
    falseLabel = 'No',
    displayValue,
    additionalProps,
    displayMode,
    hasSuggestions,
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const hasValueChange = useRef(false);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const [inputValue, setInputValue] = useState(!!value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

  useEffect(() => setInputValue(!!value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  const readOnlyText = getReadOnlyDisplayText(inputValue, trueLabel, falseLabel, displayValue);

  if (displayMode === 'DISPLAY_ONLY' || readOnly) {
    return <Text>{readOnlyText}</Text>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked;
    if (hasSuggestions) {
      setStatus(undefined);
    }
    setInputValue(checked);
    if (value !== checked) {
      actions.updateFieldValue(propName, checked);
      hasValueChange.current = true;
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if ((!value || hasValueChange.current) && !readOnly) {
      actions.triggerFieldChange(propName, e.currentTarget.checked);
      if (hasSuggestions) {
        pConn.ignoreSuggestion();
      }
      hasValueChange.current = false;
    }
  };

  return (
    <FormField
      {...additionalProps}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      status={status}
      testId={testId}
      required={required}
      disabled={disabled}
    >
      <Switch label={caption} on={inputValue} disabled={disabled} onChange={handleChange} onBlur={handleBlur} />
    </FormField>
  );
};

export default withConfiguration(PegaExtensionsToggle);
