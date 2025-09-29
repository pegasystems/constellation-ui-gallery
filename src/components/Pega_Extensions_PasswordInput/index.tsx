import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { withConfiguration, Input, Text } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

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
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
  hasSuggestions?: boolean;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsPasswordInput = (props: PasswordInputProps) => {
  const {
    getPConnect,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    fieldMetadata,
    additionalProps,
    displayMode,
    hasSuggestions,
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false);

  let { readOnly, required, disabled } = props;
  const { value } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
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
  }, [validatemessage, hasSuggestions, status]);

  const displayComp = value ? '***********' : '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
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
export default withConfiguration(PegaExtensionsPasswordInput);
