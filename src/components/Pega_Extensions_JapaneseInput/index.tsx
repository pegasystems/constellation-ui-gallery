import { type FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  Input,
  Text,
  withConfiguration,
  type InputProps,
  type FormControlProps,
  type TestIdProp,
  useTestIds,
  createTestIds,
  withTestIds,
} from '@pega/cosmos-react-core';
import '../shared/create-nonce';
import {
  convertHiraganaToKatakana,
  fullWidthToHalfWidth,
  convertGregorianToJapaneseEra,
  convertJapaneseEraToGregorian,
} from './utils';

// interface for props
export interface PegaExtensionsJapaneseInputProps extends InputProps, TestIdProp {
  // If any, enter additional props that only exist on TextInput here
  hasSuggestions?: boolean;
  hiraganaToKatakana: boolean;
  fullToHalf: boolean;
  lowerToUpper: boolean;
  japaneseEraToGregorian: boolean;
  gregorianToJapaneseEra: boolean;
  label: string;
  getPConnect: any;
  errorMessage: string;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
}

// interface for StateProps object
export interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// Test-id configuration
export const getJapaneseInputTestIds = createTestIds('japanese-input', [] as const);

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsJapaneseInput: FC<PegaExtensionsJapaneseInputProps> = ({
  testId,
  getPConnect,
  errorMessage = '',
  displayMode,
  value,
  label,
  labelHidden,
  info,
  hasSuggestions = false,
  hiraganaToKatakana = false,
  fullToHalf = false,
  lowerToUpper = false,
  japaneseEraToGregorian = false,
  gregorianToJapaneseEra = false,
  ...restProps
}: PegaExtensionsJapaneseInputProps) => {
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const hasValueChange = useRef(false);
  const testIds = useTestIds(testId, getJapaneseInputTestIds);

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<FormControlProps['status']>(hasSuggestions ? 'pending' : undefined);

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (errorMessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(errorMessage !== '' ? 'error' : undefined);
    }
  }, [errorMessage, hasSuggestions, status]);

  const displayComp = inputValue || '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }

  const handleChange = (event: any) => {
    if (hasSuggestions) {
      setStatus(undefined);
    }
    setInputValue(event.target.value);
    if (value !== event.target.value) {
      actions.updateFieldValue(propName, event.target.value);
      hasValueChange.current = true;
    }
  };

  const handleBlur = (event: any) => {
    if (!value || hasValueChange.current) {
      actions.triggerFieldChange(propName, event.target.value);
      if (hasSuggestions) {
        pConn.ignoreSuggestion('');
      }
      hasValueChange.current = false;
    }

    let newValue = event.target.value;
    if (hiraganaToKatakana) {
      newValue = convertHiraganaToKatakana(newValue);
    }
    if (fullToHalf) {
      newValue = fullWidthToHalfWidth(newValue);
    }
    if (lowerToUpper) {
      newValue = newValue.toUpperCase();
    }
    if (japaneseEraToGregorian && /^(令和|平成|昭和|大正|明治)/.test(newValue)) {
      newValue = convertJapaneseEraToGregorian(newValue);
    } else if (gregorianToJapaneseEra && /^([\d０-９]{3,4})(年)?/.test(newValue)) {
      newValue = convertGregorianToJapaneseEra(newValue);
    }
    if (event.target.value !== newValue) {
      setInputValue(newValue);
      actions.updateFieldValue(propName, newValue);
    }
  };

  return (
    <Input
      {...restProps}
      testId={testIds.root}
      type='text'
      label={label}
      labelHidden={labelHidden}
      info={errorMessage || info}
      value={inputValue}
      status={status}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default withTestIds(withConfiguration(PegaExtensionsJapaneseInput), getJapaneseInputTestIds);
