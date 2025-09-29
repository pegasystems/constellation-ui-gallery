import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { withConfiguration, Checkbox, Text } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

export type CheckboxRowProps = {
  getPConnect?: any;
  label: string;
  labelProperty?: string;
  value?: boolean;
  helperText?: string;
  validatemessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  testId?: string;
  fieldMetadata?: any;
  additionalProps?: any;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
};

// Helper function to safely access nested object properties
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => {
    // Handle array indices like 'Policies[0]'
    if (key.includes('[') && key.includes(']')) {
      const arrayKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
      return current?.[arrayKey]?.[index];
    }
    return current?.[key];
  }, obj);
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsCheckboxRow = (props: CheckboxRowProps) => {
  const {
    getPConnect,
    validatemessage = '',
    label,
    labelProperty = '',
    value,
    helperText = '',
    testId = '',
    additionalProps,
    displayMode,
  } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const hasValueChange = useRef(false);

  let { readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true'),
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<string>();

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, status]);

  const displayComp = value || '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }
  return (
    <Checkbox
      {...additionalProps}
      label={labelProperty || label}
      info={validatemessage || helperText}
      data-testid={testId}
      checked={inputValue}
      status={status}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      onChange={(e: MouseEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.checked);
        if (value !== e.currentTarget.checked) {
          actions.updateFieldValue(propName, e.currentTarget.checked);
          hasValueChange.current = true;
          const context = getPConnect().getContextName();

          const storeData = (window as any).PCore.getStore().getState().data?.[context];
          const pageRef = getPConnect().options.pageReference;
          /* page Ref could be 'caseInfo.content.Policies[0]' */

          const data: any = getNestedValue(storeData, pageRef);

          /* Iterate over object - if a property is of type boolean - call updateFieldValue to set the value to e.currentTarget.checked */
          Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'boolean') {
              const otherPropName = `.${key}`;
              if (otherPropName !== propName) {
                actions.updateFieldValue(otherPropName, e.currentTarget.checked);
              }
            }
          });
        }
      }}
      onBlur={(e: MouseEvent<HTMLInputElement>) => {
        if ((!value || hasValueChange.current) && !readOnly) {
          actions.triggerFieldChange(propName, e.currentTarget.checked);
          hasValueChange.current = false;
        }
      }}
    />
  );
};

export default withConfiguration(PegaExtensionsCheckboxRow);
