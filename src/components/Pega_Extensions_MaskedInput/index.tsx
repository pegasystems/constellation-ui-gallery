import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { withConfiguration, Input, Text } from '@pega/cosmos-react-core';
import IMask, { type FactoryArg, type InputMaskElement } from 'imask';
import '../create-nonce';

export type MaskedInputProps = {
  getPConnect?: any;
  label: string;
  mask: string;
  value?: string;
  helperText?: string;
  placeholder?: string;
  validatemessage?: string;
  hideLabel?: boolean;
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
export const PegaExtensionsMaskedInput = (props: MaskedInputProps) => {
  const {
    getPConnect,
    placeholder,
    validatemessage = '',
    label,
    mask,
    value,
    hideLabel = false,
    helperText = '',
    testId = '',
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
  const [maskObj, setMask] = useState<any>(null);
  const ref = useRef<InputMaskElement>(null);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (ref?.current && !disabled && !readOnly) {
      const maskOptions: FactoryArg = {
        mask,
        definitions: {
          // defaults are '0', 'a', '*'
          // You can extend by adding other characters
          A: /[A-Z]/,
        },
      };
      if (maskObj) {
        maskObj.updateOptions(maskOptions);
      } else {
        setMask(IMask(ref.current, maskOptions));
      }
    }
  }, [ref, mask, disabled, readOnly, maskObj]);

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

  const displayComp = value || '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }

  return (
    <Input
      {...additionalProps}
      ref={ref}
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText || mask}
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
        if (e.currentTarget.value !== value) {
          setInputValue(e.currentTarget.value);
          actions.updateFieldValue(propName, e.currentTarget.value);
        }
        if (!value || hasValueChange.current) {
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

export default withConfiguration(PegaExtensionsMaskedInput);
