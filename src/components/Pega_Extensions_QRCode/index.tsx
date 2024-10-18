import { useEffect, useState, type SyntheticEvent } from 'react';
import {
  withConfiguration,
  Flex,
  FormControl,
  FormField,
  QRCode,
  FieldValueList,
  Text
} from '@pega/cosmos-react-core';
import StyledWrapper from './styles';
import '../create-nonce';

type QRCodeCompProps = {
  label: string;
  value: string;
  inputProperty: string;
  helperText?: string;
  validatemessage?: string;
  hideLabel: boolean;
  readOnly?: boolean;
  testId?: string;
  displayMode?: string;
  variant?: any;
  getPConnect: any;
};

export const PegaExtensionsQRCode = (props: QRCodeCompProps) => {
  const {
    inputProperty,
    label,
    value,
    validatemessage,
    hideLabel = false,
    readOnly,
    helperText,
    testId,
    displayMode,
    variant,
    getPConnect
  } = props;
  const pConn = getPConnect();
  const [outputValue, setOutputValue] = useState(value);
  const [info, setInfo] = useState(validatemessage || helperText);
  const [status, setStatus] = useState<'success' | 'warning' | 'error' | 'pending' | undefined>(
    undefined
  );

  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;

  useEffect(() => {
    if (!readOnly) {
      if (validatemessage !== '') {
        setStatus('error');
      }
      if (status !== 'success') {
        setStatus(validatemessage !== '' ? 'error' : undefined);
      }
      setInfo(validatemessage || helperText);
    }
  }, [inputProperty, validatemessage, helperText, readOnly, status]);

  const displayComp = value || '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }
  if (displayMode === 'LABELS_LEFT') {
    return (
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
    );
  }
  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <Text variant='h1' as='span'>
        {displayComp}
      </Text>
    );
  }

  return (
    <StyledWrapper>
      <Flex container={{ direction: 'column', justify: 'center', alignItems: 'center' }}>
        <FormField
          label={label}
          labelHidden={hideLabel}
          info={info}
          status={status}
          testId={testId}
        >
          <FormControl ariaLabel={label}>
            {readOnly ? (
              <img alt='QR Code' src={outputValue} />
            ) : (
              <QRCode
                value={inputProperty}
                label={label}
                onLoad={(event: SyntheticEvent<HTMLImageElement, Event>) => {
                  const blob = (event.currentTarget as HTMLImageElement)?.src;
                  if (blob && propName) {
                    actions.updateFieldValue(propName, blob);
                    setOutputValue(blob);
                  }
                }}
              />
            )}
          </FormControl>
        </FormField>
      </Flex>
    </StyledWrapper>
  );
};
export default withConfiguration(PegaExtensionsQRCode);
