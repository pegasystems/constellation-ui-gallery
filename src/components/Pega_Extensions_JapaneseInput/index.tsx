import { type FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  Input,
  FieldValueList,
  Text,
  withConfiguration,
  type InputProps,
  type FormControlProps,
  type TestIdProp,
  useTestIds,
  createTestIds,
  withTestIds
} from '@pega/cosmos-react-core';
import '../create-nonce';
import type { FieldValueVariant } from '@pega/cosmos-react-core/lib/components/FieldValueList/FieldValueList';
import { convertHiraganaToKatakana, fullWidthToHalfWidth } from './utils';

enum DisplayMode {
  DisplayOnly = 'DISPLAY_ONLY',
  LabelsLeft = 'LABELS_LEFT',
  StackedLargeVal = 'STACKED_LARGE_VAL'
}

// interface for props
export interface PegaExtensionsJapaneseInputProps extends InputProps, TestIdProp {
  // If any, enter additional props that only exist on TextInput here
  hasSuggestions?: boolean;
  variant?: FieldValueVariant;
  hiraganaToKatakana: boolean;
  fullToHalf: boolean;
  lowerToUpper: boolean;
  label: string;
  getPConnect: any;
  errorMessage: string;
  displayMode?: DisplayMode;
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
  errorMessage,
  displayMode,
  value,
  label,
  labelHidden,
  info,
  variant,
  hasSuggestions = false,
  hiraganaToKatakana = false,
  fullToHalf = false,
  lowerToUpper = false,
  ...restProps
}: PegaExtensionsJapaneseInputProps) => {
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const hasValueChange = useRef(false);
  const testIds = useTestIds(testId, getJapaneseInputTestIds);

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<FormControlProps['status']>(
    hasSuggestions ? 'pending' : undefined
  );

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
  if (displayMode === DisplayMode.DisplayOnly) {
    return <Text>{displayComp}</Text>;
  }

  if (displayMode === DisplayMode.LabelsLeft) {
    return (
      <FieldValueList
        variant={labelHidden ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: labelHidden ? '' : label, value: displayComp }]}
      />
    );
  }

  if (displayMode === DisplayMode.StackedLargeVal) {
    return (
      <Text variant='h1' as='span'>
        {displayComp}
      </Text>
    );
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
