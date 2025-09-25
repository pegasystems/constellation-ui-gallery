import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { withConfiguration, Checkbox, Text } from '@pega/cosmos-react-core';
import '../create-nonce';

export type CheckboxTriggerProps = {
  getPConnect?: any;
  label: string;
  dataPage: string;
  value?: boolean;
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
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsCheckboxTrigger = (props: CheckboxTriggerProps) => {
  const {
    getPConnect,
    placeholder,
    validatemessage = '',
    label,
    dataPage = '',
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
      label={label}
      info={validatemessage || helperText}
      data-testid={testId}
      checked={inputValue}
      status={status}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      onChange={(e: MouseEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.checked);
        if (value !== e.currentTarget.checked) {
          actions.updateFieldValue(propName, e.currentTarget.checked);
          hasValueChange.current = true;
          const context = getPConnect().getContextName();
          const data: any = (window as any).PCore.getStore().getState().data?.[context]?.dataInfo?.content;

          /* To force the refresh, we will call a savable DP that will contain the current value and return the update content */
          const itemData = (window as any).PCore.getContainerUtils().getContainerItemData(
            getPConnect().getTarget(),
            getPConnect().getContextName(),
          );
          const key = itemData?.key ? JSON.parse(itemData.key) : {};
          const newObj = { ...data };
          delete newObj?.classID;
          const bodyData = { ...newObj, ...key };
          (window as any).PCore.getRestClient()
            .invokeRestApi('createDataObject', {
              body: { data: bodyData },
              queryPayload: { data_view_ID: dataPage },
            })
            .then((resp: any) => {
              const respData = resp?.data?.responseData;
              const updateObj = { ...respData };
              delete updateObj?.pzInsKey;
              (window as any).PCore.getStore().dispatch({
                type: 'SET_PROPERTY',
                payload: {
                  context: getPConnect().getContextName(),
                  reference: 'dataInfo.content',
                  value: updateObj,
                },
              });
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

export default withConfiguration(PegaExtensionsCheckboxTrigger);
