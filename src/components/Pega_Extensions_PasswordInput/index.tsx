import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { Input, FieldValueList, Text } from '@pega/cosmos-react-core';

type PasswordInputProps = {
  getPConnect: any;
  label: string;
  value: string;
  helperText?: string;
  placeholder?: string;
  validatemessage?: string;
  hideLabel: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  fieldMetadata?: any;
  additionalProps?: any;
  displayMode?: string;
  variant?: any;
  hasSuggestions?: boolean;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const PegaExtensionsPasswordInput = (props: PasswordInputProps) => {
  const {
    getPConnect,
    placeholder,
    validatemessage,
    label,
    hideLabel,
    helperText,
    testId,
    fieldMetadata,
    additionalProps,
    displayMode,
    variant,
    hasSuggestions
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false);

  let { readOnly, required, disabled } = props;
  const { value } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);
  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions]);

  const displayComp = value ? '***********' : '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  } else if (displayMode === 'LABELS_LEFT') {
    return (
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
    );
  } else if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <Text variant='h1' as='span'>
        {displayComp}
      </Text>
    );
  }

  return (
    <Input
      {...additionalProps}
      type='password'
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      data-testid={testId}
      value={inputValue}
      status={status}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      maxLength={maxLength}
      onChange={(e: MouseEvent<HTMLInputElement>) => {
        if (hasSuggestions) {
          setStatus(undefined);
        }
        setInputValue(e.currentTarget.value);
        if (value !== e.currentTarget.value) {
          actions.updateFieldValue(propName, e.currentTarget.value);
          hasValueChange.current = true;
        }
      }}
      onBlur={(e: MouseEvent<HTMLInputElement>) => {
        if ((!value || hasValueChange.current) && !readOnly) {
          actions.triggerFieldChange(propName, e.currentTarget.value);
          if (hasSuggestions) {
            pConn.ignoreSuggestion();
          }
          hasValueChange.current = false;
        }
      }}
    />
  );
};

export default PegaExtensionsPasswordInput;
