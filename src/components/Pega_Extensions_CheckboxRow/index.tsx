import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { withConfiguration, Checkbox, Text } from '@pega/cosmos-react-core';
import '../create-nonce';
import { updateAllSiblingCheckboxes, updateBooleanFieldsOnPage } from './utils';

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
  selectAllProperty?: string;
  fieldMetadata?: any;
  additionalProps?: any;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
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
    selectAllProperty = '',
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
  const handleChange = (checked: boolean) => {
    setInputValue(checked);
    if (value === checked) return;

    actions.updateFieldValue(propName, checked);
    hasValueChange.current = true;

    const contextName = pConn.getContextName();
    const storeData = (window as any).PCore.getStore().getState().data?.[contextName];
    if (!storeData) return;

    if (selectAllProperty) {
      updateAllSiblingCheckboxes({ selectAllProperty, checked, pConn, storeData });
      return;
    }

    const pageRef = pConn.options.pageReference; // e.g. caseInfo.content.Policies[0]
    updateBooleanFieldsOnPage({
      pageRef,
      checked,
      actions,
      storeData,
      excludeProp: propName,
    });
  };

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
      onChange={(e: MouseEvent<HTMLInputElement>) => handleChange(e.currentTarget.checked)}
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
